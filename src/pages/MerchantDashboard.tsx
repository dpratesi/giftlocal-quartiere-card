
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
  QrCode,
  Building2,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import GiftCardModal from "@/components/GiftCardModal";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import QRRedemptionModal from "@/components/QRRedemptionModal";
import MerchantSettingsModal from "@/components/MerchantSettingsModal";
import { useMerchantDashboard } from "@/hooks/useMerchantDashboard";

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isMerchant } = useAuth();
  const [selectedShopId, setSelectedShopId] = useState<string | undefined>(undefined);
  const { stats, orders, shopOptions, giftCards, monthlyStats, giftCardStats, isLoading, error } = useMerchantDashboard(selectedShopId);

  console.log('MerchantDashboard render:', { 
    user: user?.id, 
    userType: user?.type, 
    isAuthenticated, 
    isMerchant, 
    isLoading, 
    error: error?.message,
    statsCount: stats ? Object.keys(stats).length : 0,
    ordersCount: orders?.length || 0,
    shopsCount: shopOptions?.length || 0
  });

  useEffect(() => {
    if (!isAuthenticated || !isMerchant) {
      navigate('/merchant/login');
      return;
    }
  }, [isAuthenticated, isMerchant, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Caricamento...</h2>
          <p className="text-muted-foreground">Verifica dell'autenticazione in corso</p>
        </div>
      </div>
    );
  }

  const getShopDisplayName = () => {
    if (!selectedShopId) return "Tutti i negozi";
    const shop = shopOptions.find(s => s.id === selectedShopId);
    return shop?.name || "Negozio selezionato";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Attiva", variant: "default" as const },
      used: { label: "Utilizzata", variant: "secondary" as const },
      expired: { label: "Scaduta", variant: "destructive" as const },
      cancelled: { label: "Annullata", variant: "outline" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">Dashboard Merchant - {getShopDisplayName()}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <Select value={selectedShopId || "all"} onValueChange={(value) => setSelectedShopId(value === "all" ? undefined : value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Seleziona negozio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutti i negozi</SelectItem>
                    {shopOptions.map(shop => (
                      <SelectItem key={shop.id} value={shop.id}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate('/merchant/shops')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Gestisci Negozi
                </Button>
                <QRRedemptionModal />
                <MerchantSettingsModal 
                  merchantData={{ shopName: user.name, email: user.email }}
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
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nessun ordine trovato</p>
                      {selectedShopId && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Prova a cambiare negozio o visualizzare tutti i negozi
                        </p>
                      )}
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-medium">{order.gift_card_code}</p>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.shopName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">€{order.amount}</p>
                          <p className="text-sm text-muted-foreground">{order.date}</p>
                        </div>
                        <OrderDetailsModal order={order} />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="giftcards">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gift Card Attive */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                      Gift Card Attive
                    </span>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {giftCards.filter(card => card.status === 'active').length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {giftCards.filter(card => card.status === 'active').length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Nessuna gift card attiva</p>
                      </div>
                    ) : (
                      giftCards
                        .filter(card => card.status === 'active')
                        .map((card) => (
                          <div key={card.id} className="p-3 border border-green-200 rounded-lg bg-green-50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-mono text-sm font-medium">{card.code}</p>
                                <p className="text-sm text-muted-foreground">{card.customer}</p>
                                <p className="text-xs text-muted-foreground">{card.shopName}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-green-600">€{card.remainingValue}</p>
                                <p className="text-xs text-muted-foreground">di €{card.amount}</p>
                                <p className="text-xs text-muted-foreground">{card.purchaseDate}</p>
                              </div>
                            </div>
                            {card.recipientName && (
                              <div className="mt-2 pt-2 border-t border-green-200">
                                <p className="text-xs text-muted-foreground">
                                  Per: {card.recipientName} ({card.recipientEmail})
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Gift Card Esaurite */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                      Gift Card Esaurite
                    </span>
                    <Badge variant="secondary">
                      {giftCards.filter(card => card.status === 'used').length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {giftCards.filter(card => card.status === 'used').length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Nessuna gift card esaurita</p>
                      </div>
                    ) : (
                      giftCards
                        .filter(card => card.status === 'used')
                        .map((card) => (
                          <div key={card.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-mono text-sm font-medium text-gray-600">{card.code}</p>
                                <p className="text-sm text-muted-foreground">{card.customer}</p>
                                <p className="text-xs text-muted-foreground">{card.shopName}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-600">€{card.amount}</p>
                                <p className="text-xs text-muted-foreground line-through">€0 rimanente</p>
                                <p className="text-xs text-muted-foreground">{card.purchaseDate}</p>
                              </div>
                            </div>
                            {card.recipientName && (
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-xs text-muted-foreground">
                                  Per: {card.recipientName} ({card.recipientEmail})
                                </p>
                              </div>
                            )}
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                Completamente utilizzata
                              </Badge>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistiche Gift Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistiche Gift Card</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{giftCards.filter(card => card.status === 'active').length}</p>
                    <p className="text-sm text-muted-foreground">Gift Card Attive</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valore residuo: €{giftCards.filter(card => card.status === 'active').reduce((sum, card) => sum + card.remainingValue, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-600">{giftCards.filter(card => card.status === 'used').length}</p>
                    <p className="text-sm text-muted-foreground">Gift Card Esaurite</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valore utilizzato: €{giftCards.filter(card => card.status === 'used').reduce((sum, card) => sum + card.amount, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{giftCards.length}</p>
                    <p className="text-sm text-muted-foreground">Totale Gift Card</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Valore totale: €{giftCards.reduce((sum, card) => sum + card.amount, 0).toFixed(2)}
                    </p>
                  </div>
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
                    {monthlyStats.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Nessuna vendita negli ultimi mesi</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Le statistiche appariranno dopo le prime vendite
                        </p>
                      </div>
                    ) : (
                      monthlyStats.map((monthData, index) => {
                        const maxTotal = Math.max(...monthlyStats.map(m => m.total));
                        const widthPercent = Math.max((monthData.total / maxTotal) * 100, 5);
                        
                        return (
                          <div key={index} className="flex justify-between items-center">
                            <span className="min-w-[120px]">{monthData.month}</span>
                            <div className="flex items-center gap-2 flex-1">
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all duration-300" 
                                  style={{ width: `${widthPercent}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium min-w-[80px] text-right">
                                €{monthData.total.toFixed(2)}
                              </span>
                              <span className="text-xs text-muted-foreground min-w-[60px] text-right">
                                ({monthData.count} vendite)
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gift Card più Vendute</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {giftCardStats.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Nessuna gift card venduta</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Le statistiche appariranno dopo le prime vendite
                        </p>
                      </div>
                    ) : (
                      giftCardStats.slice(0, 5).map((cardStat, index) => {
                        const maxCount = Math.max(...giftCardStats.map(c => c.count));
                        const widthPercent = Math.max((cardStat.count / maxCount) * 100, 5);
                        const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
                        const color = colors[index % colors.length];
                        
                        return (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-medium">€{cardStat.amount}</span>
                            <div className="flex items-center gap-2 flex-1 ml-4">
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${color} transition-all duration-300`}
                                  style={{ width: `${widthPercent}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium min-w-[100px] text-right">
                                {cardStat.count} vendute
                              </span>
                              <span className="text-xs text-muted-foreground min-w-[80px] text-right">
                                €{(cardStat.amount * cardStat.count).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {giftCardStats.length > 5 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground text-center">
                        Mostrando le top 5 gift card più vendute
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Statistiche aggiuntive */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      €{monthlyStats.reduce((sum, month) => sum + month.total, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Fatturato ultimi 6 mesi</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {monthlyStats.reduce((sum, month) => sum + month.count, 0)} transazioni totali
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      €{monthlyStats.length > 0 ? (monthlyStats.reduce((sum, month) => sum + month.total, 0) / monthlyStats.length).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-muted-foreground">Media mensile</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Vendite per mese negli ultimi 6 mesi
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      €{giftCardStats.length > 0 ? (giftCardStats.reduce((sum, stat) => sum + (stat.amount * stat.count), 0) / giftCardStats.reduce((sum, stat) => sum + stat.count, 0) || 0).toFixed(2) : '0.00'}
                    </p>
                    <p className="text-sm text-muted-foreground">Valore medio gift card</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Importo medio per transazione
                    </p>
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
