import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, CreditCard, User, Calendar, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customer: string;
  amount: number;
  date: string;
  status: string;
  paymentMethod?: string;
  giftCardCode?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}

interface OrderDetailsModalProps {
  order: Order;
}

const OrderDetailsModal = ({ order }: OrderDetailsModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completato", variant: "default" as const, icon: CheckCircle },
      pending: { label: "In attesa", variant: "secondary" as const, icon: RefreshCw },
      redeemed: { label: "Utilizzato", variant: "outline" as const, icon: CheckCircle },
      cancelled: { label: "Annullato", variant: "destructive" as const, icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status || "Sconosciuto",
      variant: "secondary" as const,
      icon: RefreshCw
    };
    
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Stato Aggiornato",
        description: `Ordine ${order.id} aggiornato a: ${newStatus}`,
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento dello stato",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mockOrderDetails = {
    customerName: order.customer.split('@')[0].replace('.', ' '),
    customerPhone: "+39 123 456 7890",
    paymentMethod: "Carta di Credito ****1234",
    giftCardCode: `GC${Date.now().toString().slice(-8)}`,
    notes: "Regalo per compleanno",
    transactionId: `TXN-${order.id}`,
    purchaseTime: "14:32"
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Dettagli Ordine {order.id}
          </DialogTitle>
          <DialogDescription>
            Informazioni complete sull'ordine e sulla gift card
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Amount */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusBadge(order.status)}
              <div className="text-2xl font-bold">€{order.amount}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              {order.date} alle {mockOrderDetails.purchaseTime}
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Informazioni Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nome:</span>
                <span className="font-medium">{mockOrderDetails.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{order.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Telefono:</span>
                <span>{mockOrderDetails.customerPhone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Dettagli Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metodo:</span>
                <span>{mockOrderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transazione:</span>
                <span className="font-mono text-sm">{mockOrderDetails.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Importo:</span>
                <span className="font-semibold">€{order.amount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Gift Card Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Gift Card Generata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-4 text-white mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">€{order.amount}</div>
                    <div className="text-sm opacity-90">Gift Card</div>
                  </div>
                  <CreditCard className="w-8 h-8 opacity-80" />
                </div>
                <div className="mt-2 text-sm opacity-90">
                  Codice: {mockOrderDetails.giftCardCode}
                </div>
              </div>
              
              {mockOrderDetails.notes && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Note:</span>
                  <p className="text-sm">{mockOrderDetails.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {order.status === "pending" && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleStatusChange("completed")}
                disabled={loading}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Conferma Ordine
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleStatusChange("cancelled")}
                disabled={loading}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Annulla Ordine
              </Button>
            </div>
          )}

          {order.status === "completed" && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange("redeemed")}
              disabled={loading}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Segna come Utilizzato
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Chiudi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;