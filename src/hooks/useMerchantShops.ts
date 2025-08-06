import { useQuery } from '@tanstack/react-query';
import { fetchMerchantShops } from '@/lib/merchantApi';
import { useAuth } from '@/contexts/AuthContext';

export const useMerchantShops = (merchantId?: string) => {
  const { user, isMerchant } = useAuth();
  
  const enabled = !!merchantId && isMerchant;

  const {
    data: shops,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['merchant-shops', merchantId],
    queryFn: () => fetchMerchantShops(merchantId!),
    enabled,
  });

  return {
    shops,
    isLoading,
    error,
    refetch,
  };
};