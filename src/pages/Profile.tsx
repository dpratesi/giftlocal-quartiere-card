
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, CreditCard, Settings, User, MapPin, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useGiftCards } from "@/hooks/useGiftCards";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { giftCards, isLoading: isLoadingGiftCards } = useGiftCards();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Categorize gift cards
  const activeGiftCards = giftCards.filter(card => {
    const isNotExpired = new Date(card.expiry_date) > new Date();
    const hasRemainingValue = card.remaining_value > 0;
    return card.status === 'active' && isNotExpired && hasRemainingValue;
  });

  const inactiveGiftCards = giftCards.filter(card => {
    const isExpired = new Date(card.expiry_date) <= new Date();
    const hasNoRemainingValue = card.remaining_value === 0;
    return card.status !== 'active' || isExpired || hasNoRemainingValue;
  });

  const getInactiveReason = (card: any) => {
    if (card.status !== 'active') return card.status;
    if (card.remaining_value === 0) return 'estinta';
    if (new Date(card.expiry_date) <= new Date()) return 'scaduta';
    return 'inattiva';
  };

  const renderGiftCard = (card: any, isActive: boolean) => (
    <div key={card.id} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{card.shop?.name || 'Negozio'}</h3>
          <p className="text-sm text-muted-foreground">
            Acquistata il {format(new Date(card.purchase_date), 'dd MMMM yyyy', { locale: it })}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Codice: {card.gift_card_code}
          </p>
        </div>
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Attiva" : 
            getInactiveReason(card) === 'estinta' ? "Estinta" :
            getInactiveReason(card) === 'scaduta' ? "Scaduta" :
            getInactiveReason(card) === 'used' ? "Utilizzata" :
            getInactiveReason(card) === 'expired' ? "Scaduta" :
            getInactiveReason(card) === 'cancelled' ? "Annullata" : "Inattiva"
          }
        </Badge>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm text-muted-foreground">Valore</p>
            <p className="font-semibold">€{card.amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Rimangono</p>
            <p className={`font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              €{card.remaining_value}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Scade il</p>
            <p className={`font-semibold ${new Date(card.expiry_date) <= new Date() ? 'text-red-600' : ''}`}>
              {format(new Date(card.expiry_date), 'dd MMMM yyyy', { locale: it })}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Dettagli</Button>
          {isActive && (
            <Button size="sm">Usa ora</Button>
          )}
        </div>
      </div>
      
      {card.message && (
        <div className="mt-3 p-2 bg-muted rounded text-sm">
          <p className="text-muted-foreground">Messaggio: {card.message}</p>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="mt-3">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${isActive ? 'bg-primary' : 'bg-muted-foreground'}`}
            style={{ width: `${(card.remaining_value / card.amount) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Mock data for favorites (will be replaced with real data later)
  const favoriteShops = [
    { id: "1", name: "Caffè Centrale", category: "Caffetteria" },
    { id: "3", name: "Trattoria da Mario", category: "Ristoranti" },
    { id: "5", name: "Boutique Elisa", category: "Moda" }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Accesso richiesto</h2>
            <p className="text-muted-foreground mb-4">Effettua il login per accedere al tuo profilo</p>
            <Link to="/login">
              <Button>Accedi</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Home
            </Button>
          </Link>

          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              {user.name}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge variant={user.type === 'merchant' ? 'default' : 'secondary'} className="mt-2">
              {user.type === 'merchant' ? 'Merchant' : 'Cliente'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Azioni rapide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Impostazioni
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifiche
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Le mie posizioni
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Esci
                  </Button>
                </CardContent>
              </Card>

              {user.type === 'customer' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-500" />
                      Negozi preferiti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {favoriteShops.map((shop) => (
                      <div key={shop.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                        <div>
                          <p className="font-medium text-sm">{shop.name}</p>
                          <p className="text-xs text-muted-foreground">{shop.category}</p>
                        </div>
                        <Link to={`/shop/${shop.id}`}>
                          <Button size="sm" variant="ghost">Visita</Button>
                        </Link>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Columns - Content based on user type */}
            <div className="lg:col-span-2">
              {user.type === 'customer' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <CreditCard className="w-6 h-6 mr-2 text-primary" />
                      Le mie Gift Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingGiftCards ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Caricamento gift card...</p>
                      </div>
                    ) : giftCards.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          Non hai ancora acquistato nessuna gift card
                        </p>
                        <Link to="/shops">
                          <Button>Esplora negozi</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Active Gift Cards */}
                        {activeGiftCards.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-green-600 flex items-center">
                              <CreditCard className="w-5 h-5 mr-2" />
                              Gift Card Attive ({activeGiftCards.length})
                            </h3>
                            <div className="space-y-4">
                              {activeGiftCards.map((card) => renderGiftCard(card, true))}
                            </div>
                          </div>
                        )}

                        {/* Inactive Gift Cards */}
                        {inactiveGiftCards.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-muted-foreground flex items-center">
                              <CreditCard className="w-5 h-5 mr-2" />
                              Gift Card Disattive ({inactiveGiftCards.length})
                            </h3>
                            <div className="space-y-4">
                              {inactiveGiftCards.map((card) => renderGiftCard(card, false))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {user.type === 'merchant' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Dashboard Merchant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Accedi alla tua dashboard per gestire le gift card e monitorare le vendite
                      </p>
                      <Link to="/merchant/dashboard">
                        <Button>Vai alla Dashboard</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
