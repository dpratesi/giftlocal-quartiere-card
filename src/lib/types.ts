export interface Shop {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  neighborhood: string;
  distance: string;
  giftCardPrices: number[];
  description: string;
  city: string;
}

export interface PurchasedGiftCard {
  id: string;
  user_id: string;
  shop_id: string;
  gift_card_code: string;
  amount: number;
  remaining_value: number;
  recipient_email?: string;
  recipient_name?: string;
  message?: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  purchase_date: string;
  expiry_date: string;
  shop?: {
    name: string;
    image: string;
  };
}
