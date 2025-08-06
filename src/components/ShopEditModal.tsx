import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { LoadingButton } from '@/components/LoadingButton';
import { updateShop, updateShopGiftCardPrices } from '@/lib/merchantApi';
import { toast } from '@/hooks/use-toast';

interface Shop {
  id: string;
  name: string;
  category: string;
  description: string;
  neighborhood: string;
  city: string;
  gift_card_prices?: number[];
}

interface ShopEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
  onShopUpdated: () => void;
}

const shopEditSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri").max(50, "Massimo 50 caratteri"),
  category: z.string().min(1, "Seleziona una categoria"),
  description: z.string().min(20, "La descrizione deve contenere almeno 20 caratteri").max(500, "Massimo 500 caratteri"),
  neighborhood: z.string().min(2, "Inserisci il quartiere"),
  city: z.string().min(2, "Inserisci la città"),
});

type ShopEditFormData = z.infer<typeof shopEditSchema>;

export const ShopEditModal: React.FC<ShopEditModalProps> = ({
  isOpen,
  onClose,
  shop,
  onShopUpdated,
}) => {
  const [giftCardPrices, setGiftCardPrices] = useState<number[]>([]);
  const [newPrice, setNewPrice] = useState<string>('');

  const form = useForm<ShopEditFormData>({
    resolver: zodResolver(shopEditSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      neighborhood: '',
      city: '',
    },
  });

  useEffect(() => {
    if (shop) {
      form.reset({
        name: shop.name,
        category: shop.category,
        description: shop.description,
        neighborhood: shop.neighborhood,
        city: shop.city,
      });
      setGiftCardPrices(shop.gift_card_prices || [10, 25, 50, 100]);
    }
  }, [shop, form]);

  const addGiftCardPrice = () => {
    const price = parseInt(newPrice);
    if (price && price > 0 && !giftCardPrices.includes(price)) {
      setGiftCardPrices([...giftCardPrices, price].sort((a, b) => a - b));
      setNewPrice('');
    }
  };

  const removeGiftCardPrice = (price: number) => {
    setGiftCardPrices(giftCardPrices.filter(p => p !== price));
  };

  const onSubmit = async (data: ShopEditFormData) => {
    if (!shop) return;

    try {
      // Update shop information
      await updateShop(shop.id, {
        name: data.name,
        category: data.category,
        description: data.description,
        neighborhood: data.neighborhood,
        city: data.city,
      });
      
      // Update gift card prices
      await updateShopGiftCardPrices(shop.id, giftCardPrices);
      
      onShopUpdated();
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento del negozio",
        variant: "destructive",
      });
    }
  };

  if (!shop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifica negozio</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informazioni di base</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome del negozio *</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Caffè del Borgo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bar-caffe">Bar & Caffè</SelectItem>
                          <SelectItem value="ristoranti">Ristoranti</SelectItem>
                          <SelectItem value="librerie">Librerie</SelectItem>
                          <SelectItem value="bellezza">Bellezza</SelectItem>
                          <SelectItem value="abbigliamento">Abbigliamento</SelectItem>
                          <SelectItem value="alimentari">Alimentari</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrizione *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrivi il tuo negozio, i tuoi prodotti e cosa rende speciale la tua attività..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartiere *</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Centro Storico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Città *</FormLabel>
                      <FormControl>
                        <Input placeholder="es. Roma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Gift Card Prices */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Prezzi Gift Card</h3>
              
              <div className="flex flex-wrap gap-2">
                {giftCardPrices.map((price) => (
                  <Badge 
                    key={price} 
                    variant="secondary" 
                    className="px-3 py-1 flex items-center gap-2"
                  >
                    €{price}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeGiftCardPrice(price)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Nuovo prezzo (€)"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addGiftCardPrice}
                  disabled={!newPrice || parseInt(newPrice) <= 0}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                I clienti potranno acquistare gift card di questi importi
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Annulla
              </Button>
              <LoadingButton 
                type="submit" 
                loading={form.formState.isSubmitting}
                loadingText="Salvataggio..."
              >
                Salva modifiche
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};