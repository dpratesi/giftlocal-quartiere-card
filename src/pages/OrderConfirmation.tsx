import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Download, Mail, QrCode, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

interface OrderData {
  orderId: string;
  giftCardCode: string;
  shopName: string;
  amount: number;
  email: string;
  recipientEmail: string;
  recipientName: string;
  message: string;
  purchaseDate: string;
  expiryDate: string;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state as OrderData;

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Ordine non trovato</h1>
          <Button onClick={() => navigate("/shops")}>Torna al catalogo</Button>
        </div>
      </div>
    );
  }

  const generateQRCode = () => {
    // Generate QR code with the actual gift card code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GIFTCARD:${orderData.giftCardCode}:${orderData.amount}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Header */}
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Acquisto completato!</h1>
            <p className="text-muted-foreground">
              La tua gift card è stata generata ed è pronta per l'uso
            </p>
          </div>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Dettagli ordine</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Ordine ID:</span>
                  <p className="font-mono font-medium">{orderData.orderId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data:</span>
                  <p className="font-medium">{new Date(orderData.purchaseDate).toLocaleDateString('it-IT')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Negozio:</span>
                  <p className="font-medium">{orderData.shopName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Importo:</span>
                  <p className="font-medium">€{orderData.amount}</p>
                </div>
              </div>
              
              {orderData.message && (
                <div className="pt-4 border-t">
                  <span className="text-muted-foreground text-sm">Messaggio:</span>
                  <p className="mt-1 p-3 bg-muted rounded-lg">{orderData.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gift Card Preview */}
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">Gift Card</h3>
                    <p className="text-white/80">{orderData.shopName}</p>
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Attiva
                  </Badge>
                </div>
                
                <div className="text-center">
                  <p className="text-white/80 text-sm">Valore</p>
                  <p className="text-4xl font-bold">€{orderData.amount}</p>
                </div>
                
                <div className="flex justify-center">
                  <div className="bg-white p-2 rounded-lg">
                    <img 
                      src={generateQRCode()} 
                      alt="QR Code Gift Card" 
                      className="w-32 h-32"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-white/80 text-sm">Codice gift card</p>
                  <p className="font-mono text-lg tracking-wider">{orderData.giftCardCode}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Scarica PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Invia per email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Condividi
            </Button>
          </div>

          {/* Next Steps */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Come utilizzare la gift card</h3>
              <div className="space-y-3 text-sm text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <p>Mostra il QR code o comunica il codice al negozio</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <p>Il negoziante scansionerà il codice per verificare la validità</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <p>Effettua i tuoi acquisti fino al valore della gift card</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button onClick={() => navigate("/shops")} size="lg">
              Continua shopping
            </Button>
            <Button variant="outline" onClick={() => navigate("/profile")} size="lg">
              Visualizza le mie gift card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;