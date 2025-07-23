import { useQuery } from "@tanstack/react-query";
import { fetchShops } from "@/lib/api";
import type { Shop } from "@/lib/types";

export function useShops() {
  const { data = [], isLoading, error } = useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: fetchShops,
  });

  return { shops: data, isLoading, error };
}

