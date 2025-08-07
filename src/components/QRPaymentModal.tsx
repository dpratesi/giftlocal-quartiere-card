import { useState, useEffect } from "react";
import { X, Copy, QrCode, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { PurchasedGiftCard } from "@/lib/types";
import QRCode from "qrcode";

interface QRPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftCard: PurchasedGiftCard;
}

const QRPaymentModal = ({ isOpen, onClose, giftCard }: QRPaymentModalProps) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && giftCard) {
      // Generate QR code data - includes gift card code and essential info
      const qrData = JSON.stringify({
        code: giftCard.gift_card_code,
        amount: giftCard.remaining_value,
        shop: giftCard.shop?.name || 'Negozio',
        expires: giftCard.expiry_date
      });

      QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCodeDataUrl);
    }
  }, [isOpen, giftCard]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(giftCard.gift_card_code);
      toast({
        title: "Codice copiato",
        description: "Il codice della gift card è stato copiato negli appunti",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile copiare il codice",
        variant: "destructive",
      });
    }
  };

  const copyQRData = async () => {
    const qrData = JSON.stringify({
      code: giftCard.gift_card_code,
      amount: giftCard.remaining_value,
      shop: giftCard.shop?.name || 'Negozio',
      expires: giftCard.expiry_date
    });

    try {
      await navigator.clipboard.writeText(qrData);
      toast({
        title: "Dati QR copiati",
        description: "I dati del QR code sono stati copiati negli appunti",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile copiare i dati",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Usa Gift Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Gift Card Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">{giftCard.shop?.name || 'Negozio'}</h3>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Valore rimanente</p>
                    <p className="text-2xl font-bold text-primary">€{giftCard.remaining_value}</p>
                  </div>
                </div>
              </div>
              <Badge variant="default" className="w-full justify-center">
                Attiva
              </Badge>
            </CardContent>
          </Card>

          {/* QR Code */}
          <div className="text-center">
            <h4 className="font-medium mb-3">Scansiona il QR Code</h4>
            <div className="flex justify-center mb-4">
              {qrCodeDataUrl ? (
                <div className="relative">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code Gift Card" 
                    className="border border-border rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={copyQRData}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Mostra questo QR code al commerciante per il pagamento
            </p>
          </div>

          {/* Manual Code */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Codice Manuale
            </h4>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm font-mono text-center">
                {giftCard.gift_card_code}
              </code>
              <Button variant="outline" size="sm" onClick={copyCode}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              In alternativa, comunica questo codice al commerciante
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Come utilizzare la gift card
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>1. Mostra il QR code o comunica il codice al commerciante</li>
              <li>2. Il commerciante scansionerà o inserirà il codice</li>
              <li>3. L'importo utilizzato verrà sottratto dal valore rimanente</li>
              <li>4. Riceverai una conferma dell'utilizzo</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Chiudi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRPaymentModal;