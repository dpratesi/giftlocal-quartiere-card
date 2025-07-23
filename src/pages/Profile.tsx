import { Link } from "react-router-dom";
import { ArrowLeft, Heart, CreditCard, Settings, User, MapPin, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const Profile = () => {
  const userGiftCards = [
    {
      id: "1",
      shopName: "Caffè del Borgo",
      amount: 25,
      remaining: 15,
      purchaseDate: "2024-01-15",
      expiryDate: "2024-07-15"
    },
    {
      id: "2", 
      shopName: "La Libreria di Giulia",
      amount: 30,
      remaining: 30,
      purchaseDate: "2024-01-10",
      expiryDate: "2024-07-10"
    }
  ];

  const favoriteShops = [
    { id: "1", name: "Caffè del Borgo", category: "Bar & Caffè" },
    { id: "3", name: "Osteria da Marco", category: "Ristoranti" },
    { id: "5", name: "Atelier Sofia", category: "Abbigliamento" }
  ];

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
              Mario Rossi
            </h1>
            <p className="text-muted-foreground">mario.rossi@email.com</p>
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
                </CardContent>
              </Card>

              {/* Favorite Shops */}
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
            </div>

            {/* Right Columns - Gift Cards */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <CreditCard className="w-6 h-6 mr-2 text-primary" />
                    Le mie Gift Card
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userGiftCards.map((card) => (
                      <div key={card.id} className="border border-border rounded-lg p-4 hover:border-primary transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{card.shopName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Acquistata il {new Date(card.purchaseDate).toLocaleDateString('it-IT')}
                            </p>
                          </div>
                          <Badge variant={card.remaining > 0 ? "default" : "secondary"}>
                            {card.remaining > 0 ? "Attiva" : "Utilizzata"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Valore</p>
                              <p className="font-semibold">{card.amount}€</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Rimangono</p>
                              <p className="font-semibold text-primary">{card.remaining}€</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Scade il</p>
                              <p className="font-semibold">{new Date(card.expiryDate).toLocaleDateString('it-IT')}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Dettagli</Button>
                            {card.remaining > 0 && (
                              <Button size="sm">Usa ora</Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-3">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${(card.remaining / card.amount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {userGiftCards.length === 0 && (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          Non hai ancora acquistato nessuna gift card
                        </p>
                        <Link to="/shops">
                          <Button>Esplora negozi</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;