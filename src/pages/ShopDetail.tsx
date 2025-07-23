import { useParams, Link } from "react-router-dom";
import { useShops } from "@/hooks/useShops";
import { ArrowLeft, MapPin, Star, Clock, Phone, Euro, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const ShopDetail = () => {
  const { id } = useParams();
  const { shops, isLoading, error } = useShops();
  const shop = shops.find((s) => s.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">Caricamento...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          Impossibile caricare i negozi
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Negozio non trovato</h1>
          <Link to="/">
            <Button>Torna alla Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Torna al catalogo
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative rounded-lg overflow-hidden mb-6">
              <img 
                src={`/placeholder.svg?height=400&width=800&text=${encodeURIComponent(shop.name)}`}
                alt={shop.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-local-green text-white">
                  {shop.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Shop Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">{shop.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {shop.neighborhood} • {shop.distance}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                    {shop.rating} ({shop.reviewCount} recensioni)
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Descrizione</h2>
                <p className="text-muted-foreground leading-relaxed">{shop.description}</p>
              </div>

              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Informazioni di contatto</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Orari di apertura</p>
                        <p className="text-sm text-muted-foreground">Lun-Sab: 09:00 - 19:00</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Telefono</p>
                        <p className="text-sm text-muted-foreground">+39 123 456 7890</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Gift Cards */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Gift Card Disponibili</h3>
                <div className="space-y-3">
                  {shop.giftCardPrices.map((price) => (
                    <div key={price} className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-center">
                        <Euro className="w-5 h-5 mr-2 text-local-green" />
                        <span className="font-medium">{price}€</span>
                      </div>
                      <Button size="sm">Acquista</Button>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <Button className="w-full bg-primary hover:bg-primary-hover" size="lg">
                    Acquista Gift Card
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Pagamento sicuro • Consegna immediata
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetail;