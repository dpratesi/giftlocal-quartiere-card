import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchMerchantStats, 
  fetchMerchantOrders, 
  fetchMerchantShopsOptions,
  fetchMerchantGiftCards,
  type MerchantStats,
  type MerchantOrder,
  type ShopOption
} from "@/lib/merchantApi";

export function useMerchantDashboard(selectedShopId?: string) {
  const { user } = useAuth();

  const { data: stats = { totalSales: 0, giftCardsSold: 0, pendingRedemptions: 0, totalCustomers: 0 }, isLoading: statsLoading, error: statsError } = useQuery<MerchantStats>({
    queryKey: ['merchant-stats', user?.id, selectedShopId],
    queryFn: () => {
      console.log('Fetching merchant stats for user:', user?.id, 'shop:', selectedShopId);
      if (!user?.id) throw new Error('User not authenticated');
      return fetchMerchantStats(user.id, selectedShopId);
    },
    enabled: !!user?.id && user?.type === 'merchant',
  });

  const { data: orders = [], isLoading: ordersLoading, error: ordersError } = useQuery<MerchantOrder[]>({
    queryKey: ['merchant-orders', user?.id, selectedShopId],
    queryFn: () => {
      console.log('Fetching merchant orders for user:', user?.id, 'shop:', selectedShopId);
      if (!user?.id) throw new Error('User not authenticated');
      return fetchMerchantOrders(user.id, selectedShopId);
    },
    enabled: !!user?.id && user?.type === 'merchant',
  });

  const { data: shopOptions = [], isLoading: shopsLoading, error: shopsError } = useQuery<ShopOption[]>({
    queryKey: ['merchant-shop-options', user?.id],
    queryFn: () => {
      console.log('Fetching merchant shop options for user:', user?.id);
      if (!user?.id) throw new Error('User not authenticated');
      return fetchMerchantShopsOptions(user.id);
    },
    enabled: !!user?.id && user?.type === 'merchant',
  });

  const { data: giftCards = [], isLoading: giftCardsLoading, error: giftCardsError } = useQuery({
    queryKey: ['merchant-gift-cards', user?.id, selectedShopId],
    queryFn: () => {
      console.log('Fetching merchant gift cards for user:', user?.id, 'shop:', selectedShopId);
      if (!user?.id) throw new Error('User not authenticated');
      return fetchMerchantGiftCards(user.id, selectedShopId);
    },
    enabled: !!user?.id && user?.type === 'merchant',
  });

  console.log('Hook state:', { 
    user: user?.id, 
    userType: user?.type, 
    statsLoading, 
    ordersLoading, 
    shopsLoading,
    statsError: statsError?.message,
    ordersError: ordersError?.message,
    shopsError: shopsError?.message
  });

  return {
    stats,
    orders,
    shopOptions,
    giftCards,
    isLoading: statsLoading || ordersLoading || shopsLoading || giftCardsLoading,
    error: statsError || ordersError || shopsError || giftCardsError
  };
}