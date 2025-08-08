import { MapPin, Star, Euro, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LocalizeVerifiedBadge from "@/components/LocalizeVerifiedBadge";
import { useCategories } from "@/hooks/useCategories";
import type { Shop } from "@/lib/types";

interface ShopCardProps extends Shop {}

const ShopCard = ({ 
  id,
  name, 
  category, 
  image, 
  rating, 
  reviewCount, 
  distance, 
  giftCardPrices, 
  description,
  neighborhood 
 }: ShopCardProps) => {
  const { t } = useLanguage();
  const { getCategoryNameByKey } = useCategories();
  
  const minPrice = Math.min(...giftCardPrices);
  const maxPrice = Math.max(...giftCardPrices);

  return (
    <Link to={`/shop/${id}`}>
      <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 overflow-hidden cursor-pointer h-full rounded-2xl">
      <div className="relative">
        <img 
          src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(name)}`}
          alt={name}
          className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white text-foreground p-1.5 sm:p-2 rounded-full shadow-sm"
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <Badge variant="secondary" className="bg-localize-sage text-white text-xs sm:text-sm rounded-full">
            {getCategoryNameByKey(category)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 flex-1">
        <div className="space-y-2 sm:space-y-3">
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-foreground line-clamp-1">{name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{neighborhood} • {distance}</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-current" />
              <span className="ml-1 text-xs sm:text-sm font-medium">{rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{t('shop.sampleDescription')}</p>

          <LocalizeVerifiedBadge />

          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs sm:text-sm text-foreground">
              <Euro className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-localize-sage flex-shrink-0" />
              <span className="font-medium">
                {minPrice === maxPrice ? `${minPrice}` : `${minPrice}-${maxPrice}`}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {giftCardPrices.length} {t('shops.giftCards')}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0">
        <Button 
          className="w-full bg-localize-terracotta hover:bg-localize-terracotta/90 text-white transition-colors text-sm sm:text-base rounded-xl"
          size="sm"
        >
          {t('shops.discoverGiftCards')}
        </Button>
      </CardFooter>
    </Card>
    </Link>
  );
};

export default ShopCard;