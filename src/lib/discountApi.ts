
import { supabase } from "@/integrations/supabase/client";

export interface ShopDiscount {
  id: string;
  shop_id: string;
  gift_card_amount: number;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateDiscountData {
  shop_id: string;
  gift_card_amount: number;
  discount_percentage: number;
}

// Fetch discounts for a specific shop
export async function fetchShopDiscounts(shopId: string): Promise<ShopDiscount[]> {
  const { data, error } = await supabase
    .from('shop_discounts')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_active', true)
    .order('gift_card_amount', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch shop discounts: ${error.message}`);
  }

  return data || [];
}

// Create a new discount
export async function createShopDiscount(discountData: CreateDiscountData): Promise<ShopDiscount> {
  const { data, error } = await supabase
    .from('shop_discounts')
    .insert(discountData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create discount: ${error.message}`);
  }

  return data;
}

// Update discount status
export async function updateDiscountStatus(discountId: string, isActive: boolean): Promise<ShopDiscount> {
  const { data, error } = await supabase
    .from('shop_discounts')
    .update({ is_active: isActive })
    .eq('id', discountId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update discount status: ${error.message}`);
  }

  return data;
}

// Delete a discount
export async function deleteShopDiscount(discountId: string): Promise<void> {
  const { error } = await supabase
    .from('shop_discounts')
    .delete()
    .eq('id', discountId);

  if (error) {
    throw new Error(`Failed to delete discount: ${error.message}`);
  }
}
