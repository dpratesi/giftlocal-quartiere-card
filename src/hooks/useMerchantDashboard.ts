import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchMerchantStats, 
  fetchMerchantOrders, 
  fetchMerchantShopsOptions,
  type MerchantStats,
  type MerchantOrder,
  type ShopOption
} from "@/lib/merchantApi";

export function useMerchantDashboard(selectedShopId?: string) {
  const { user } = useAuth();

  const { data: stats = { totalSales: 0, giftCardsSold: 0, pendingRedemptions: 0, totalCustomers: 0 }, isLoading: statsLoading } = useQuery<MerchantStats>({
    queryKey: ['merchant-stats', user?.id, selectedShopId],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return fetchMerchantStats(user.id, selectedShopId);
    },
    enabled: !!user?.id && user?.type === 'merchant',
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<MerchantOrder[]>({
    queryKey: ['merchant-orders', user?.id, selectedShopId],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return fetchMerchantOrders(user.id, selectedShopId);
    },
    enabled: !!user?.id && user?.type === 'merchant',
  });

  const { data: shopOptions = [], isLoading: shopsLoading } = useQuery<ShopOption[]>({
    queryKey: ['merchant-shop-options', user?.id],
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return fetchMerchantShopsOptions(user.id);
    },
    enabled: !!user?.id && user?.type === 'merchant',
  });

  return {
    stats,
    orders,
    shopOptions,
    isLoading: statsLoading || ordersLoading || shopsLoading
  };
}