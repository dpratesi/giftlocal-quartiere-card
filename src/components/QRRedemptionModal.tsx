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

interface QRRedemptionModalProps {
  onRedemption?: (giftCardCode: string, amount: number) => void;
}

const QRRedemptionModal = ({ onRedemption }: QRRedemptionModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const { toast } = useToast();

  const mockGiftCards = [
    { code: "GC12345678", amount: 50, status: "active", customer: "mario.rossi@email.com", purchaseDate: "2024-01-20" },
    { code: "GC87654321", amount: 25, status: "active", customer: "anna.verdi@email.com", purchaseDate: "2024-01-19" },
    { code: "GC11111111", amount: 100, status: "redeemed", customer: "luca.bianchi@email.com", purchaseDate: "2024-01-18" },
  ];

  const handleVerifyCode = async () => {
    if (!giftCardCode.trim()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find gift card
      const giftCard = mockGiftCards.find(gc => gc.code === giftCardCode.toUpperCase());
      
      if (!giftCard) {
        setVerificationResult({
          valid: false,
          error: "Gift card non trovata"
        });
      } else if (giftCard.status === "redeemed") {
        setVerificationResult({
          valid: false,
          error: "Gift card già utilizzata",
          giftCard
        });
      } else {
        setVerificationResult({
          valid: true,
          giftCard
        });
      }
    } catch (error) {
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
    if (!verificationResult?.giftCard) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onRedemption?.(verificationResult.giftCard.code, verificationResult.giftCard.amount);
      
      toast({
        title: "Gift Card Utilizzata",
        description: `Gift card da €${verificationResult.giftCard.amount} utilizzata con successo`,
      });

      // Reset and close
      setGiftCardCode("");
      setVerificationResult(null);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'utilizzo della gift card",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGiftCardCode("");
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

            {/* Quick Test Codes */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm font-medium mb-2">Codici di test:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <code className="bg-background px-2 py-1 rounded">GC12345678</code>
                    <span className="text-muted-foreground">€50 - Valida</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="bg-background px-2 py-1 rounded">GC87654321</code>
                    <span className="text-muted-foreground">€25 - Valida</span>
                  </div>
                  <div className="flex justify-between">
                    <code className="bg-background px-2 py-1 rounded">GC11111111</code>
                    <span className="text-muted-foreground">€100 - Già utilizzata</span>
                  </div>
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
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Elaborazione..." : `Utilizza €${verificationResult.giftCard.amount}`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRRedemptionModal;