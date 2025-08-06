import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, CreditCard, CheckCircle, AlertCircle, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { verifyGiftCard, redeemGiftCard } from "@/lib/merchantApi";
import { useAuth } from "@/contexts/AuthContext";

interface QRRedemptionModalProps {
  onRedemption?: (giftCardCode: string, amount: number) => void;
}

const QRRedemptionModal = ({ onRedemption }: QRRedemptionModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [amountToUse, setAmountToUse] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleVerifyCode = async () => {
    if (!giftCardCode.trim()) return;
    
    setLoading(true);
    try {
      const result = await verifyGiftCard(giftCardCode);
      setVerificationResult(result);
    } catch (error) {
      console.error('Error verifying gift card:', error);
      toast({
        title: "Errore",
        description: "Errore durante la verifica del codice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!verificationResult?.giftCard || !user || !amountToUse) return;
    
    const amount = parseFloat(amountToUse);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Errore",
        description: "Inserisci un importo valido",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const result = await redeemGiftCard(verificationResult.giftCard.code, user.id, amount);
      
      onRedemption?.(verificationResult.giftCard.code, amount);
      
      toast({
        title: "Gift Card Utilizzata",
        description: `Utilizzati €${amount} dalla gift card. ${result.fullyUsed ? 'Gift card completamente utilizzata.' : `Rimanente: €${result.remainingValue}`}`,
      });

      // Reset and close
      setGiftCardCode("");
      setAmountToUse("");
      setVerificationResult(null);
      setOpen(false);
    } catch (error: any) {
      console.error('Error redeeming gift card:', error);
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'utilizzo della gift card",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGiftCardCode("");
    setAmountToUse("");
    setVerificationResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="w-4 h-4 mr-2" />
          Utilizza Gift Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Utilizza Gift Card
          </DialogTitle>
          <DialogDescription>
            Scansiona il QR code o inserisci manualmente il codice della gift card
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Scansiona QR</TabsTrigger>
            <TabsTrigger value="manual">Codice Manuale</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="space-y-4">
            <Card className="p-8">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-4 p-0">
                <div className="w-32 h-32 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Scanner QR Code</p>
                  <p className="text-sm text-muted-foreground">
                    Inquadra il QR code della gift card
                  </p>
                </div>
                <Button variant="outline" disabled>
                  <Scan className="w-4 h-4 mr-2" />
                  Avvia Scanner (Demo)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="giftCardCode">Codice Gift Card</Label>
              <div className="flex gap-2">
                <Input
                  id="giftCardCode"
                  placeholder="es. GC12345678"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                  className="font-mono"
                />
                <Button 
                  onClick={handleVerifyCode} 
                  disabled={loading || !giftCardCode.trim()}
                  variant="outline"
                >
                  {loading ? "Verifica..." : "Verifica"}
                </Button>
              </div>
            </div>

            {/* Verification Result */}
            {verificationResult && (
              <Card className={verificationResult.valid ? "border-green-200" : "border-red-200"}>
                <CardContent className="p-4">
                  {verificationResult.valid ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Gift Card Valida</span>
                      </div>
                      
                      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">€{verificationResult.giftCard.amount}</div>
                            <div className="text-sm opacity-90">Gift Card</div>
                          </div>
                          <CreditCard className="w-8 h-8 opacity-80" />
                        </div>
                        <div className="mt-2 text-sm opacity-90">
                          Codice: {verificationResult.giftCard.code}
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cliente:</span>
                          <span>{verificationResult.giftCard.customer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Acquistata il:</span>
                          <span>{verificationResult.giftCard.purchaseDate}</span>
                        </div>
                      </div>
                      
                      {/* Amount to use input */}
                      <div className="space-y-2">
                        <Label htmlFor="amountToUse">Importo da utilizzare</Label>
                        <div className="flex gap-2">
                          <Input
                            id="amountToUse"
                            type="number"
                            placeholder="0.00"
                            value={amountToUse}
                            onChange={(e) => setAmountToUse(e.target.value)}
                            min="0"
                            max={verificationResult.giftCard.amount}
                            step="0.01"
                            className="text-center"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setAmountToUse(verificationResult.giftCard.amount.toString())}
                          >
                            Tutto
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Massimo €{verificationResult.giftCard.amount}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">{verificationResult.error}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Helper Text */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-2">Come utilizzare:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Inserisci il codice gift card nell'input sopra</p>
                  <p>• Clicca "Verifica" per controllare la validità</p>
                  <p>• Se valida, clicca "Utilizza" per completare la transazione</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annulla
          </Button>
          {verificationResult?.valid && (
            <Button 
              onClick={handleRedeem} 
              disabled={loading || !amountToUse || parseFloat(amountToUse) <= 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Elaborazione..." : amountToUse ? `Utilizza €${amountToUse}` : 'Inserisci importo'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRRedemptionModal;