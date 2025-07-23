import { MapPin, Star, Euro, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface ShopCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  giftCardPrices: number[];
  description: string;
  neighborhood: string;
}

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
  const minPrice = Math.min(...giftCardPrices);
  const maxPrice = Math.max(...giftCardPrices);

  return (
    <Link to={`/shop/${id}`}>
      <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50 overflow-hidden cursor-pointer">
      <div className="relative">
        <img 
          src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(name)}`}
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/80 hover:bg-white text-foreground p-2 rounded-full shadow-sm"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-local-green text-white">
            {category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {neighborhood} • {distance}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="ml-1 text-sm font-medium">{rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount} recensioni)</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-foreground">
              <Euro className="w-4 h-4 mr-1 text-local-green" />
              <span className="font-medium">
                {minPrice === maxPrice ? `${minPrice}` : `${minPrice}-${maxPrice}`}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {giftCardPrices.length} gift card
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground transition-colors"
          size="sm"
        >
          Scopri Gift Card
        </Button>
      </CardFooter>
    </Card>
    </Link>
  );
};

export default ShopCard;