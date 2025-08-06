import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Shop } from "@/lib/types";

export function useMerchantShops() {
  const { user } = useAuth();

  const { data = [], isLoading, error } = useQuery<Shop[]>({
    queryKey: ['merchant-shops', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

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
          gift_cards!inner (
            amount
          )
        `)
        .eq('owner_id', user.id)
        .eq('gift_cards.is_active', true);

      if (error) {
        throw new Error(`Failed to fetch merchant shops: ${error.message}`);
      }

      return data?.map(shop => ({
        ...shop,
        reviewCount: shop.review_count,
        giftCardPrices: [...new Set(shop.gift_cards.map(gc => gc.amount))].sort((a, b) => a - b)
      })) || [];
    },
    enabled: !!user?.id && user?.type === 'merchant',
  });

  return { shops: data, isLoading, error };
}