export interface Shop {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  giftCardPrices: number[];
  description: string;
  neighborhood: string;
}

export async function fetchShops(): Promise<Shop[]> {
  const response = await fetch('/shops.json');
  if (!response.ok) {
    throw new Error('Errore nel caricamento dei negozi');
  }
  return response.json();
}
