import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  fetchShopDiscounts, 
  createShopDiscount, 
  updateDiscountStatus, 
  deleteShopDiscount,
  type ShopDiscount,
  type CreateDiscountData 
} from '@/lib/discountApi';

interface Shop {
  id: string;
  name: string;
  category: string;
  description: string;
  neighborhood: string;
  city: string;
  min_gift_card_amount: number;
  status?: string;
}

interface ShopDiscountsPanelProps {
  shop: Shop;
}

export const ShopDiscountsPanel: React.FC<ShopDiscountsPanelProps> = ({ shop }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    gift_card_amount: 50,
    discount_percentage: 10
  });

  const { data: discounts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['shop-discounts', shop.id],
    queryFn: () => fetchShopDiscounts(shop.id),
  });

  const handleCreateDiscount = async () => {
    if (newDiscount.gift_card_amount <= 0 || newDiscount.discount_percentage <= 0) {
      toast({
        title: "Errore",
        description: "Inserisci valori validi per importo e sconto",
        variant: "destructive"
      });
      return;
    }

    // Check if discount already exists for this amount
    const existingDiscount = discounts.find(d => d.gift_card_amount === newDiscount.gift_card_amount);
    if (existingDiscount) {
      toast({
        title: "Errore",
        description: "Esiste già uno sconto per questo importo",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreating(true);
      const discountData: CreateDiscountData = {
        shop_id: shop.id,
        gift_card_amount: newDiscount.gift_card_amount,
        discount_percentage: newDiscount.discount_percentage
      };
      
      await createShopDiscount(discountData);
      refetch();
      setNewDiscount({ gift_card_amount: 50, discount_percentage: 10 });
      
      toast({
        title: "Successo",
        description: "Sconto creato con successo"
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante la creazione dello sconto",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (discount: ShopDiscount) => {
    try {
      await updateDiscountStatus(discount.id, !discount.is_active);
      refetch();
      
      toast({
        title: "Successo",
        description: `Sconto ${!discount.is_active ? 'attivato' : 'disattivato'}`
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento dello sconto",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDiscount = async (discount: ShopDiscount) => {
    try {
      await deleteShopDiscount(discount.id);
      refetch();
      
      toast({
        title: "Successo",
        description: "Sconto eliminato con successo"
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione dello sconto",
        variant: "destructive"
      });
    }
  };

  const calculateDiscountedPrice = (amount: number, discount: number) => {
    return Math.round(amount * (100 - discount) / 100);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-destructive text-center">Errore nel caricamento degli sconti</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Sconti Gift Card</h3>
        <p className="text-muted-foreground">
          Crea sconti sulle gift card per attirare più clienti. I clienti vedranno il prezzo scontato quando acquistano.
        </p>
      </div>

      {/* Create New Discount */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Crea Nuovo Sconto</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Importo Gift Card (€)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={newDiscount.gift_card_amount}
                onChange={(e) => setNewDiscount({
                  ...newDiscount,
                  gift_card_amount: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div>
              <Label htmlFor="discount">Sconto (%)</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="99"
                value={newDiscount.discount_percentage}
                onChange={(e) => setNewDiscount({
                  ...newDiscount,
                  discount_percentage: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleCreateDiscount}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? "Creazione..." : "Crea Sconto"}
              </Button>
            </div>
          </div>

          {/* Preview */}
          {newDiscount.gift_card_amount > 0 && newDiscount.discount_percentage > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Anteprima:</p>
              <p className="text-sm text-muted-foreground">
                Gift Card da €{newDiscount.gift_card_amount} con sconto {newDiscount.discount_percentage}% 
                → <span className="font-semibold text-primary">
                  €{calculateDiscountedPrice(newDiscount.gift_card_amount, newDiscount.discount_percentage)}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Existing Discounts */}
      <div>
        <h4 className="font-semibold mb-4">Sconti Attivi ({discounts.length})</h4>
        
        {discounts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Nessuno sconto creato ancora</p>
              <p className="text-sm text-muted-foreground mt-2">
                Crea il tuo primo sconto per iniziare ad attirare più clienti
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discounts.map((discount) => (
              <Card key={discount.id} className={`${!discount.is_active ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">Gift Card €{discount.gift_card_amount}</p>
                      <p className="text-sm text-muted-foreground">
                        Sconto {discount.discount_percentage}%
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        €{calculateDiscountedPrice(discount.gift_card_amount, discount.discount_percentage)}
                      </p>
                      <p className="text-xs text-muted-foreground line-through">
                        €{discount.gift_card_amount}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={discount.is_active}
                        onCheckedChange={() => handleToggleStatus(discount)}
                      />
                      <span className="text-sm">
                        {discount.is_active ? 'Attivo' : 'Inattivo'}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDiscount(discount)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
