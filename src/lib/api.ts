
import { supabase } from "@/integrations/supabase/client";
import type { Shop, PurchasedGiftCard } from "@/lib/types";

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
        gift_cards (
          amount
        )
      `);

    if (error) {
      throw new Error(`Failed to fetch shops: ${error.message}`);
    }

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
      giftCardPrices: shop.gift_cards?.map(gc => gc.amount) || []
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
    const { data: shopData, error: shopError } = await supabase
      .from('shops')
      .select('name, image')
      .eq('id', data.shopId)
      .single();

    if (shopError) {
      console.warn('Could not fetch shop details:', shopError);
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
