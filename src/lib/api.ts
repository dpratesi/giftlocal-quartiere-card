
import { supabase } from "@/integrations/supabase/client";
import type { Shop } from "@/lib/types";

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
