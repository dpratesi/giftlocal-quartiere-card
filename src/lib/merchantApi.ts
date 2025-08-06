import { supabase } from "@/integrations/supabase/client";

export interface MerchantStats {
  totalSales: number;
  giftCardsSold: number;
  pendingRedemptions: number;
  totalCustomers: number;
}

export interface MerchantOrder {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  shopName: string;
  gift_card_code: string;
}

export interface ShopOption {
  id: string;
  name: string;
}

// Fetch merchant statistics (aggregated or for specific shop)
export async function fetchMerchantStats(merchantId: string, shopId?: string): Promise<MerchantStats> {
  let query = supabase
    .from('purchased_gift_cards')
    .select(`
      amount,
      remaining_value,
      status,
      shops!inner(owner_id)
    `)
    .eq('shops.owner_id', merchantId);

  if (shopId) {
    query = query.eq('shop_id', shopId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch merchant stats: ${error.message}`);
  }

  if (!data) {
    return {
      totalSales: 0,
      giftCardsSold: 0,
      pendingRedemptions: 0,
      totalCustomers: 0
    };
  }

  const totalSales = data.reduce((sum, card) => sum + card.amount, 0);
  const giftCardsSold = data.length;
  const pendingRedemptions = data.filter(card => card.status === 'active').length;
  
  // Get unique customers count
  const { data: customersData, error: customersError } = await supabase
    .from('purchased_gift_cards')
    .select(`
      user_id,
      shops!inner(owner_id)
    `)
    .eq('shops.owner_id', merchantId);

  const totalCustomers = customersData ? 
    new Set(customersData.map(card => card.user_id)).size : 0;

  return {
    totalSales,
    giftCardsSold,
    pendingRedemptions,
    totalCustomers
  };
}

// Fetch merchant orders (aggregated or for specific shop)
export async function fetchMerchantOrders(merchantId: string, shopId?: string): Promise<MerchantOrder[]> {
  let query = supabase
    .from('purchased_gift_cards')
    .select(`
      id,
      gift_card_code,
      amount,
      purchase_date,
      status,
      user_id,
      shops!inner(name, owner_id)
    `)
    .eq('shops.owner_id', merchantId)
    .order('purchase_date', { ascending: false });

  if (shopId) {
    query = query.eq('shop_id', shopId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch merchant orders: ${error.message}`);
  }

  // Fetch user emails separately to avoid join issues
  const userIds = data?.map(order => order.user_id) || [];
  const { data: usersData } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds);

  const usersMap = new Map(usersData?.map(user => [user.id, user.email]) || []);

  return data?.map(order => ({
    id: order.gift_card_code,
    customer: usersMap.get(order.user_id) || 'N/A',
    amount: order.amount,
    date: new Date(order.purchase_date).toLocaleDateString('it-IT'),
    status: order.status as 'active' | 'used' | 'expired' | 'cancelled',
    shopName: order.shops?.name || 'N/A',
    gift_card_code: order.gift_card_code
  })) || [];
}

// Fetch merchant shops for dropdown
export async function fetchMerchantShopsOptions(merchantId: string): Promise<ShopOption[]> {
  const { data, error } = await supabase
    .from('shops')
    .select('id, name')
    .eq('owner_id', merchantId)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch merchant shops: ${error.message}`);
  }

  return data || [];
}

// Fetch all merchant shops with full details
export async function fetchMerchantShops(merchantId: string) {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', merchantId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch merchant shops: ${error.message}`);
  }

  return data || [];
}

// Update shop information
export async function updateShop(shopId: string, shopData: {
  name: string;
  category: string;
  description: string;
  neighborhood: string;
  city: string;
}) {
  const { data, error } = await supabase
    .from('shops')
    .update({
      ...shopData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', shopId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update shop: ${error.message}`);
  }

  return data;
}

// Update shop gift card prices (store in gift_cards table)
export async function updateShopGiftCardPrices(shopId: string, prices: number[]) {
  // First, deactivate existing gift cards for this shop
  const { error: deactivateError } = await supabase
    .from('gift_cards')
    .update({ is_active: false })
    .eq('shop_id', shopId);

  if (deactivateError) {
    throw new Error(`Failed to deactivate existing gift cards: ${deactivateError.message}`);
  }

  // Then, insert new gift cards for each price
  const giftCards = prices.map(price => ({
    shop_id: shopId,
    amount: price,
    is_active: true,
  }));

  const { data, error } = await supabase
    .from('gift_cards')
    .insert(giftCards)
    .select();

  if (error) {
    throw new Error(`Failed to update gift card prices: ${error.message}`);
  }

  return data;
}