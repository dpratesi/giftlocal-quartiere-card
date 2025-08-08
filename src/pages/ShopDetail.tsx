import { useParams, Link, useNavigate } from "react-router-dom";
import { useShops } from "@/hooks/useShops";
import { ArrowLeft, MapPin, Star, Clock, Phone, Euro, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const ShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shops, isLoading, error } = useShops();
  const shop = shops.find((s) => s.id === id);
  const { t } = useLanguage();
  
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustomSelected, setIsCustomSelected] = useState(false);

  const handleBuyGiftCard = () => {
    if (selectedAmount && shop) {
      navigate("/checkout", {
        state: {
          shopId: shop.id,
          shopName: shop.name,
          amount: selectedAmount
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          {t('error.loading')}
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{t('shop.notFound')}</h1>
          <Link to="/shops">
            <Button>{t('backToHome')}</Button>
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
        <Link to="/shops">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToCatalog')}
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
                    {shop.rating} ({shop.reviewCount} {t('reviews')})
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">{t('shop.description')}</h2>
                <p className="text-muted-foreground leading-relaxed">{shop.description}</p>
              </div>

              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">{t('shop.contactInfo')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t('shop.openingHours')}</p>
                        <p className="text-sm text-muted-foreground">{t('shop.schedule')}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t('shop.phone')}</p>
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
                <h3 className="text-xl font-semibold mb-4">{t('giftCard.available')}</h3>
                <div className="space-y-3">
                  {shop.giftCardPrices.map((price) => (
                    <div 
                      key={price} 
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAmount === price && !isCustomSelected
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary'
                      }`}
                      onClick={() => {
                        setSelectedAmount(price);
                        setIsCustomSelected(false);
                        setCustomAmount("");
                      }}
                    >
                      <div className="flex items-center">
                        <Euro className="w-5 h-5 mr-2 text-local-green" />
                        <span className="font-medium">{price}€</span>
                      </div>
                      {selectedAmount === price && !isCustomSelected && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  ))}
                  
                  {/* Custom Amount Option */}
                  <div className={`p-3 border rounded-lg ${
                    isCustomSelected ? 'border-primary bg-primary/10' : 'border-border'
                  }`}>
                    <div 
                      className="flex items-center justify-between cursor-pointer mb-2"
                      onClick={() => {
                        setIsCustomSelected(true);
                        if (!customAmount) {
                          setCustomAmount(shop.min_gift_card_amount.toString());
                          setSelectedAmount(shop.min_gift_card_amount);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <Euro className="w-5 h-5 mr-2 text-local-green" />
                        <span className="font-medium">{t('giftCard.customAmount')}</span>
                      </div>
                      {isCustomSelected && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    {isCustomSelected && (
                      <input
                        type="number"
                        min={shop.min_gift_card_amount}
                        value={customAmount}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCustomAmount(value);
                          const numValue = parseInt(value) || shop.min_gift_card_amount;
                          setSelectedAmount(Math.max(shop.min_gift_card_amount, numValue));
                        }}
                        placeholder={`Minimo ${shop.min_gift_card_amount}€`}
                        className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <Button 
                    className="w-full bg-primary hover:bg-primary-hover" 
                    size="lg"
                    onClick={handleBuyGiftCard}
                    disabled={!selectedAmount}
                  >
                    {selectedAmount ? `${t('giftCard.buy')} €${selectedAmount}` : t('giftCard.selectAmount')}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    {t('giftCard.securePayment')} • {t('giftCard.instantDelivery')}
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
