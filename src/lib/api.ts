
import { supabase } from "@/integrations/supabase/client";
import type { Shop, PurchasedGiftCard } from "@/lib/types";

// Utility function to calculate dynamic gift card amounts
export function calculateGiftCardAmounts(minAmount: number): number[] {
  switch (minAmount) {
    case 25:
      return [25, 50, 100];
    case 50:
      return [50, 75, 100];
    case 100:
      return [100, 150, 200];
    default:
      return [25, 50, 100];
  }
}

export async function fetchShops(): Promise<Shop[]> {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select(`
        id,
        name,
        category,
        image,
        rating,
        review_count,
        neighborhood,
        distance,
        description,
        city,
        min_gift_card_amount,
        status
      `)
      .eq('status', 'active'); // Solo negozi attivi visibili ai clienti

    if (error) {
      throw new Error(`Failed to fetch shops: ${error.message}`);
    }

    // Get all active discounts for all shops
    const { data: discounts, error: discountsError } = await supabase
      .from('shop_discounts')
      .select('shop_id, discount_percentage')
      .eq('is_active', true);

    if (discountsError) {
      console.warn('Failed to fetch discounts:', discountsError);
    }

    // Create a map of shop discounts
    const shopDiscounts = new Map<string, number>();
    discounts?.forEach(discount => {
      const currentMax = shopDiscounts.get(discount.shop_id) || 0;
      shopDiscounts.set(discount.shop_id, Math.max(currentMax, discount.discount_percentage));
    });

    // Transform data to match the Shop interface
    const shops: Shop[] = data?.map(shop => ({
      id: shop.id,
      name: shop.name,
      category: shop.category,
      image: shop.image,
      rating: Number(shop.rating || 0),
      reviewCount: shop.review_count || 0,
      neighborhood: shop.neighborhood,
      distance: shop.distance,
      description: shop.description,
      city: shop.city,
      min_gift_card_amount: shop.min_gift_card_amount || 25,
      giftCardPrices: calculateGiftCardAmounts(shop.min_gift_card_amount || 25),
      maxDiscountPercentage: shopDiscounts.get(shop.id) || undefined
    })) || [];

    return shops;
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
}

export async function purchaseGiftCard(data: {
  shopId: string;
  amount: number;
  email: string;
  recipientEmail?: string;
  recipientName?: string;
  message?: string;
}): Promise<PurchasedGiftCard> {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verifica che il negozio sia attivo prima di permettere l'acquisto
    const { data: shopStatus, error: shopError } = await supabase
      .from('shops')
      .select('status, name')
      .eq('id', data.shopId)
      .single();

    if (shopError) {
      throw new Error(`Failed to verify shop status: ${shopError.message}`);
    }

    if (shopStatus.status !== 'active') {
      throw new Error(`Il negozio "${shopStatus.name}" non è attualmente disponibile per l'acquisto di gift card.`);
    }

    // Generate gift card code
    const { data: codeData, error: codeError } = await supabase
      .rpc('generate_gift_card_code');
    
    if (codeError) {
      throw new Error(`Failed to generate gift card code: ${codeError.message}`);
    }

    // Insert purchased gift card
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchased_gift_cards')
      .insert({
        user_id: user.id,
        shop_id: data.shopId,
        gift_card_code: codeData,
        amount: data.amount,
        remaining_value: data.amount,
        recipient_email: data.recipientEmail,
        recipient_name: data.recipientName,
        message: data.message
      })
      .select()
      .single();

    if (purchaseError) {
      throw new Error(`Failed to purchase gift card: ${purchaseError.message}`);
    }

    // Get shop details separately  
    const { data: shopData, error: shopError2 } = await supabase
      .from('shops')
      .select('name, image')
      .eq('id', data.shopId)
      .single();

    if (shopError2) {
      console.warn('Could not fetch shop details:', shopError2);
    }

    return {
      id: purchaseData.id,
      user_id: purchaseData.user_id,
      shop_id: purchaseData.shop_id,
      gift_card_code: purchaseData.gift_card_code,
      amount: purchaseData.amount,
      remaining_value: purchaseData.remaining_value,
      recipient_email: purchaseData.recipient_email,
      recipient_name: purchaseData.recipient_name,
      message: purchaseData.message,
      status: purchaseData.status as 'active' | 'used' | 'expired' | 'cancelled',
      purchase_date: purchaseData.purchase_date,
      expiry_date: purchaseData.expiry_date,
      shop: shopData ? {
        name: shopData.name,
        image: shopData.image
      } : undefined
    };
  } catch (error) {
    console.error('Error purchasing gift card:', error);
    throw error;
  }
}

export async function fetchUserGiftCards(): Promise<PurchasedGiftCard[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('purchased_gift_cards')
      .select(`
        *,
        shops (
          name,
          image
        )
      `)
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch gift cards: ${error.message}`);
    }

    return data?.map(card => ({
      id: card.id,
      user_id: card.user_id,
      shop_id: card.shop_id,
      gift_card_code: card.gift_card_code,
      amount: card.amount,
      remaining_value: card.remaining_value,
      recipient_email: card.recipient_email,
      recipient_name: card.recipient_name,
      message: card.message,
      status: card.status as 'active' | 'used' | 'expired' | 'cancelled',
      purchase_date: card.purchase_date,
      expiry_date: card.expiry_date,
      shop: (card as any).shops ? {
        name: (card as any).shops.name,
        image: (card as any).shops.image
      } : undefined
    })) || [];
  } catch (error) {
    console.error('Error fetching user gift cards:', error);
    throw error;
  }
}

// Fetch gift card transaction history
export async function fetchGiftCardTransactions(giftCardId: string) {
  const { data, error } = await supabase
    .from('gift_card_transactions')
    .select(`
      *,
      shop:shops(name, image),
      merchant:profiles(name)
    `)
    .eq('gift_card_id', giftCardId)
    .order('transaction_date', { ascending: false });

  if (error) {
    console.error('Error fetching gift card transactions:', error);
    throw error;
  }

  return data || [];
}

// Update user preferred city
export async function updateUserPreferredCity(city: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ preferred_city: city })
    .eq('id', (await supabase.auth.getUser()).data.user?.id);

  if (error) {
    throw new Error(`Failed to update preferred city: ${error.message}`);
  }
}

// Get user preferred city
export async function getUserPreferredCity(): Promise<string> {
  const { data, error } = await supabase
    .from('profiles')
    .select('preferred_city')
    .eq('id', (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (error) {
    console.error('Error fetching preferred city:', error);
    return 'Roma'; // Default fallback
  }

  return data?.preferred_city || 'Roma';
}
