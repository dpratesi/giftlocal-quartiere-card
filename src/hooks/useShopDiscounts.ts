import { useQuery } from "@tanstack/react-query";
import { fetchShopDiscounts } from "@/lib/discountApi";
import type { ShopDiscount } from "@/lib/discountApi";

export function useShopDiscounts(shopId: string) {
  const { data = [], isLoading, error } = useQuery<ShopDiscount[]>({
    queryKey: ['shop-discounts', shopId],
    queryFn: () => fetchShopDiscounts(shopId),
    enabled: !!shopId,
  });

  return { discounts: data, isLoading, error };
}