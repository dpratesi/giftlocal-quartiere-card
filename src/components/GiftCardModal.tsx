import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GiftCardModalProps {
  onGiftCardCreated?: (giftCard: any) => void;
}

const GiftCardModal = ({ onGiftCardCreated }: GiftCardModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    validityMonths: "12",
    quantity: "10"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newGiftCard = {
        id: `GC-${Date.now()}`,
        amount: parseInt(formData.amount),
        description: formData.description,
        validityMonths: parseInt(formData.validityMonths),
        quantity: parseInt(formData.quantity),
        active: true,
        sold: 0,
        remaining: parseInt(formData.quantity),
        createdAt: new Date().toISOString()
      };

      onGiftCardCreated?.(newGiftCard);
      
      toast({
        title: "Gift Card Creata",
        description: `Gift Card da €${formData.amount} creata con successo`,
      });

      // Reset form and close
      setFormData({
        amount: "",
        description: "",
        validityMonths: "12",
        quantity: "10"
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante la creazione della gift card",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuova Gift Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crea Nuova Gift Card</DialogTitle>
          <DialogDescription>
            Configura una nuova gift card per il tuo negozio
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Importo (€)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="50"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min="1"
                max="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantità</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="10"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                min="1"
                max="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              placeholder="Gift Card perfetta per ogni occasione..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validity">Validità</Label>
            <Select
              value={formData.validityMonths}
              onValueChange={(value) => setFormData({ ...formData, validityMonths: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona validità" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 mesi</SelectItem>
                <SelectItem value="12">12 mesi</SelectItem>
                <SelectItem value="24">24 mesi</SelectItem>
                <SelectItem value="0">Senza scadenza</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {formData.amount && (
            <div className="space-y-2">
              <Label>Anteprima Gift Card</Label>
              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="w-full h-32 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center text-white relative">
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">€{formData.amount}</div>
                      <div className="text-sm opacity-90">Gift Card</div>
                    </div>
                    <div className="absolute bottom-2 right-2 text-xs opacity-70">
                      Valida {formData.validityMonths === "0" ? "sempre" : `${formData.validityMonths} mesi`}
                    </div>
                  </div>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground mt-2">{formData.description}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Annulla
            </Button>
            <Button type="submit" disabled={loading || !formData.amount}>
              {loading ? "Creazione..." : "Crea Gift Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GiftCardModal;