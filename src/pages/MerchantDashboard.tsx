import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Euro, 
  CreditCard, 
  Users, 
  BarChart3,
  Calendar,
  Download,
  Plus,
  Eye,
  Settings,
  LogOut,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GiftCardModal from "@/components/GiftCardModal";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import QRRedemptionModal from "@/components/QRRedemptionModal";
import MerchantSettingsModal from "@/components/MerchantSettingsModal";

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const [merchantData, setMerchantData] = useState<any>(null);

  useEffect(() => {
    const authData = localStorage.getItem('merchantAuth');
    if (!authData) {
      navigate('/merchant/login');
      return;
    }
    
    setMerchantData(JSON.parse(authData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('merchantAuth');
    navigate('/');
  };

  if (!merchantData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Caricamento...</h2>
          <p className="text-muted-foreground">Verifica dell'autenticazione in corso</p>
        </div>
      </div>
    );
  }

  // Mock data for dashboard
  const stats = {
    totalSales: 2450.00,
    giftCardsSold: 23,
    pendingRedemptions: 5,
    totalCustomers: 18
  };

  const recentOrders = [
    { id: "GC-1234567", customer: "mario.rossi@email.com", amount: 50, date: "2024-01-20", status: "completed" },
    { id: "GC-1234568", customer: "anna.verdi@email.com", amount: 25, date: "2024-01-19", status: "pending" },
    { id: "GC-1234569", customer: "luca.bianchi@email.com", amount: 100, date: "2024-01-19", status: "completed" },
    { id: "GC-1234570", customer: "sara.neri@email.com", amount: 75, date: "2024-01-18", status: "redeemed" }
  ];

  const giftCards = [
    { id: "GC-001", amount: 25, active: true, sold: 8, remaining: 2 },
    { id: "GC-002", amount: 50, active: true, sold: 12, remaining: 8 },
    { id: "GC-003", amount: 100, active: true, sold: 3, remaining: 7 },
    { id: "GC-004", amount: 150, active: false, sold: 0, remaining: 5 }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Completato", variant: "default" as const },
      pending: { label: "In attesa", variant: "secondary" as const },
      redeemed: { label: "Utilizzato", variant: "outline" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{merchantData.shopName}</h1>
              <p className="text-muted-foreground">Dashboard Merchant</p>
            </div>
            <div className="flex items-center gap-2">
              <QRRedemptionModal />
              <MerchantSettingsModal 
                merchantData={merchantData} 
                onSettingsUpdate={(settings) => console.log('Settings updated:', settings)}
              />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vendite Totali</p>
                  <p className="text-2xl font-bold">€{stats.totalSales.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Euro className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+12.5%</span>
                <span className="text-muted-foreground ml-1">vs mese scorso</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gift Card Vendute</p>
                  <p className="text-2xl font-bold">{stats.giftCardsSold}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+8.2%</span>
                <span className="text-muted-foreground ml-1">vs mese scorso</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Da Utilizzare</p>
                  <p className="text-2xl font-bold">{stats.pendingRedemptions}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Gift card in attesa
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clienti Totali</p>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+15.3%</span>
                <span className="text-muted-foreground ml-1">nuovi clienti</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Ordini</TabsTrigger>
            <TabsTrigger value="giftcards">Gift Card</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Ordini Recenti</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Esporta
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-medium">{order.id}</p>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{order.amount}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <OrderDetailsModal order={order} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="giftcards">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Gestione Gift Card</CardTitle>
                <GiftCardModal onGiftCardCreated={(giftCard) => console.log('New gift card:', giftCard)} />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {giftCards.map((card) => (
                    <div key={card.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold">
                          €{card.amount}
                        </div>
                        <div>
                          <p className="font-medium">Gift Card da €{card.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            Vendute: {card.sold} • Disponibili: {card.remaining}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={card.active ? "default" : "secondary"}>
                          {card.active ? "Attiva" : "Disattivata"}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Vendite per Mese
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Gennaio 2024</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-3/4"></div>
                        </div>
                        <span className="text-sm font-medium">€1,850</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Dicembre 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-full"></div>
                        </div>
                        <span className="text-sm font-medium">€2,450</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Novembre 2023</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-1/2"></div>
                        </div>
                        <span className="text-sm font-medium">€1,200</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gift Card più Vendute</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>€50</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-4/5"></div>
                        </div>
                        <span className="text-sm font-medium">12 vendute</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>€25</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-3/5"></div>
                        </div>
                        <span className="text-sm font-medium">8 vendute</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>€100</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 w-1/5"></div>
                        </div>
                        <span className="text-sm font-medium">3 vendute</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MerchantDashboard;