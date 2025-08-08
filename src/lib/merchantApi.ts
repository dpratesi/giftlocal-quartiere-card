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
  min_gift_card_amount?: number;
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

// Create a new shop
export async function createShop(shopData: {
  name: string;
  category: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  neighborhood: string;
  postalCode: string;
  city: string;
  vat?: string;
  iban?: string;
  ownerId: string;
}) {
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .insert({
      name: shopData.name,
      category: shopData.category,
      description: shopData.description,
      neighborhood: shopData.neighborhood,
      city: shopData.city,
      owner_id: shopData.ownerId,
      image: '/placeholder.svg', // Default image for now
      distance: '0 km', // Default distance
      rating: 0,
      review_count: 0,
      min_gift_card_amount: 25, // Default minimum amount
    })
    .select()
    .single();

  if (shopError) {
    throw new Error(`Failed to create shop: ${shopError.message}`);
  }

  // Create default gift cards for the new shop
  const defaultPrices = [25, 50, 100]; // Default gift card amounts
  const giftCards = defaultPrices.map(price => ({
    shop_id: shop.id,
    amount: price,
    is_active: true,
  }));

  const { error: giftCardsError } = await supabase
    .from('gift_cards')
    .insert(giftCards);

  if (giftCardsError) {
    console.error('Failed to create default gift cards:', giftCardsError.message);
    // Don't throw here, as the shop was created successfully
  }

  return shop;
}

// Verify gift card by code
export async function verifyGiftCard(giftCardCode: string) {
  const { data, error } = await supabase
    .from('purchased_gift_cards')
    .select(`
      *,
      shops!inner(name, owner_id)
    `)
    .eq('gift_card_code', giftCardCode.toUpperCase())
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { valid: false, error: "Gift card non trovata" };
    }
    throw new Error(`Failed to verify gift card: ${error.message}`);
  }

  if (!data) {
    return { valid: false, error: "Gift card non trovata" };
  }

  if (data.status === 'used') {
    return { 
      valid: false, 
      error: "Gift card già utilizzata",
      giftCard: data
    };
  }

  if (data.status === 'expired') {
    return { 
      valid: false, 
      error: "Gift card scaduta",
      giftCard: data
    };
  }

  if (new Date(data.expiry_date) < new Date()) {
    return { 
      valid: false, 
      error: "Gift card scaduta",
      giftCard: data
    };
  }

  // Get customer email separately
  const { data: customerData } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', data.user_id)
    .single();

  return {
    valid: true,
    giftCard: {
      code: data.gift_card_code,
      amount: data.remaining_value,
      status: data.status,
      customer: customerData?.email || 'N/A',
      purchaseDate: new Date(data.purchase_date).toLocaleDateString('it-IT'),
      shopName: data.shops?.name || 'N/A',
      expiryDate: new Date(data.expiry_date).toLocaleDateString('it-IT')
    }
  };
}

// Redeem gift card
export async function redeemGiftCard(giftCardCode: string, merchantId: string, amount: number) {
  // First verify the gift card and check if merchant owns the shop
  const { data: giftCardData, error: fetchError } = await supabase
    .from('purchased_gift_cards')
    .select(`
      *,
      shops!inner(name, owner_id)
    `)
    .eq('gift_card_code', giftCardCode.toUpperCase())
    .single();

  if (fetchError || !giftCardData) {
    throw new Error('Gift card non trovata');
  }

  // Check if merchant owns the shop
  if (giftCardData.shops?.owner_id !== merchantId) {
    throw new Error('Non sei autorizzato a utilizzare questa gift card');
  }

  // Check if already used
  if (giftCardData.status === 'used') {
    throw new Error('Gift card già utilizzata');
  }

  // Check if amount is valid
  if (amount <= 0) {
    throw new Error('Importo non valido');
  }

  if (amount > giftCardData.remaining_value) {
    throw new Error(`Importo superiore al valore rimanente (€${giftCardData.remaining_value})`);
  }

  // Calculate new remaining value
  const newRemainingValue = giftCardData.remaining_value - amount;
  const newStatus = newRemainingValue === 0 ? 'used' : 'active';

  // Update gift card
  const { error: updateError } = await supabase
    .from('purchased_gift_cards')
    .update({ 
      status: newStatus,
      remaining_value: newRemainingValue,
      updated_at: new Date().toISOString()
    })
    .eq('gift_card_code', giftCardCode.toUpperCase());

  if (updateError) {
    throw new Error(`Failed to redeem gift card: ${updateError.message}`);
  }

  // Record the transaction
  const { error: transactionError } = await supabase
    .from('gift_card_transactions')
    .insert({
      gift_card_id: giftCardData.id,
      shop_id: giftCardData.shop_id,
      merchant_id: merchantId,
      amount_used: amount,
      description: `Riscatto presso ${giftCardData.shops?.name || 'Negozio'}`
    });

  if (transactionError) {
    console.error('Error recording transaction:', transactionError);
    // Don't throw here as the redemption was successful
  }

  return {
    success: true,
    amount: amount,
    remainingValue: newRemainingValue,
    code: giftCardCode,
    fullyUsed: newStatus === 'used'
  };
}

// Fetch all gift cards for merchant (purchased by customers)
export async function fetchMerchantGiftCards(merchantId: string, shopId?: string) {
  let query = supabase
    .from('purchased_gift_cards')
    .select(`
      *,
      shops!inner(name, owner_id)
    `)
    .eq('shops.owner_id', merchantId)
    .order('purchase_date', { ascending: false });

  if (shopId) {
    query = query.eq('shop_id', shopId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch merchant gift cards: ${error.message}`);
  }

  // Fetch customer emails separately
  const userIds = data?.map(card => card.user_id) || [];
  const { data: usersData } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds);

  const usersMap = new Map(usersData?.map(user => [user.id, user.email]) || []);

  return data?.map(card => ({
    id: card.id,
    code: card.gift_card_code,
    amount: card.amount,
    remainingValue: card.remaining_value,
    status: card.status,
    customer: usersMap.get(card.user_id) || 'N/A',
    purchaseDate: new Date(card.purchase_date).toLocaleDateString('it-IT'),
    expiryDate: new Date(card.expiry_date).toLocaleDateString('it-IT'),
    shopName: card.shops?.name || 'N/A',
    recipientName: card.recipient_name,
    recipientEmail: card.recipient_email,
    message: card.message
  })) || [];
}

// Analytics functions
export async function fetchMerchantMonthlyStats(merchantId: string, shopId?: string) {
  let query = supabase
    .from('purchased_gift_cards')
    .select(`
      amount,
      purchase_date,
      shops!inner(owner_id)
    `)
    .eq('shops.owner_id', merchantId)
    .gte('purchase_date', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()); // Last year

  if (shopId) {
    query = query.eq('shop_id', shopId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch monthly stats: ${error.message}`);
  }

  // Group by month
  const monthlyData = new Map();
  
  data?.forEach(card => {
    const date = new Date(card.purchase_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long' });
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { month: monthName, total: 0, count: 0 });
    }
    
    const current = monthlyData.get(monthKey);
    current.total += card.amount;
    current.count += 1;
  });

  // Convert to array and sort by date
  const result = Array.from(monthlyData.entries())
    .sort(([a], [b]) => b.localeCompare(a)) // Most recent first
    .slice(0, 6) // Last 6 months
    .map(([key, value]) => value);

  return result;
}

export async function fetchMerchantGiftCardStats(merchantId: string, shopId?: string) {
  let query = supabase
    .from('purchased_gift_cards')
    .select(`
      amount,
      shops!inner(owner_id)
    `)
    .eq('shops.owner_id', merchantId);

  if (shopId) {
    query = query.eq('shop_id', shopId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch gift card stats: ${error.message}`);
  }

  // Group by amount and count
  const amountStats = new Map();
  
  data?.forEach(card => {
    if (!amountStats.has(card.amount)) {
      amountStats.set(card.amount, 0);
    }
    amountStats.set(card.amount, amountStats.get(card.amount) + 1);
  });

  // Convert to array and sort by count
  const result = Array.from(amountStats.entries())
    .map(([amount, count]) => ({ amount, count }))
    .sort((a, b) => b.count - a.count);

  return result;
}