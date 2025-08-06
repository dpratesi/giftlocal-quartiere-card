import { useQuery } from "@tanstack/react-query";
import { fetchUserGiftCards } from "@/lib/api";
import type { PurchasedGiftCard } from "@/lib/types";

export function useGiftCards() {
  const { data = [], isLoading, error } = useQuery<PurchasedGiftCard[]>({
    queryKey: ['user-gift-cards'],
    queryFn: fetchUserGiftCards,
  });

  return { giftCards: data, isLoading, error };
}