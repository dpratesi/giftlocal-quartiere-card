import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { LoadingButton } from '@/components/LoadingButton';
import { updateShop } from '@/lib/merchantApi';
import { calculateGiftCardAmounts } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';

interface Shop {
  id: string;
  name: string;
  category: string;
  description: string;
  neighborhood: string;
  city: string;
  min_gift_card_amount: number;
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

const CategorySelectContent = () => {
  const { categories, getCategoryName } = useCategories();
  
  return (
    <SelectContent>
      {categories
        .filter(cat => cat.key !== 'all')
        .map((category) => (
          <SelectItem key={category.key} value={category.key}>
            {getCategoryName(category)}
          </SelectItem>
        ))}
    </SelectContent>
  );
};

export const ShopEditModal: React.FC<ShopEditModalProps> = ({
  isOpen,
  onClose,
  shop,
  onShopUpdated,
}) => {
  const [minGiftCardAmount, setMinGiftCardAmount] = useState<number>(25);

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
      setMinGiftCardAmount(shop.min_gift_card_amount || 25);
    }
  }, [shop, form]);


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
        min_gift_card_amount: minGiftCardAmount,
      });
      
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
                        <CategorySelectContent />
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

            {/* Gift Card Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Impostazioni Gift Card</h3>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Importo minimo Gift Card</label>
                <Select 
                  value={minGiftCardAmount.toString()} 
                  onValueChange={(value) => setMinGiftCardAmount(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">€25 (Tagli: 25€, 50€, 100€)</SelectItem>
                    <SelectItem value="50">€50 (Tagli: 50€, 75€, 100€)</SelectItem>
                    <SelectItem value="100">€100 (Tagli: 100€, 150€, 200€)</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tagli automatici generati:</strong> {calculateGiftCardAmounts(minGiftCardAmount).join('€, ')}€
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    I clienti potranno anche scegliere un importo personalizzato (minimo {minGiftCardAmount}€)
                  </p>
                </div>
              </div>
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