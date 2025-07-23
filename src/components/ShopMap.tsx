import { MapPin, Star, Euro } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Shop } from "@/lib/api";

interface ShopMapProps {
  shops: Shop[];
}

const ShopMap = ({ shops }: ShopMapProps) => {
  // Mock positions for shops on the map
  const shopPositions = shops.map((shop, index) => ({
    ...shop,
    x: 20 + (index % 4) * 15 + Math.random() * 10,
    y: 20 + Math.floor(index / 4) * 20 + Math.random() * 10
  }));

  return (
    <div className="w-full h-[600px] relative bg-gradient-to-br from-local-green-light to-muted rounded-lg border overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-local-green/10 to-primary/5">
        {/* Mock streets */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <h4 className="font-semibold text-sm mb-2">Legenda</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Negozio</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>La tua posizione</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User location */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <MapPin className="w-8 h-8 text-red-500 drop-shadow-lg" />
          <div className="absolute -top-1 -left-1 w-10 h-10 bg-red-500/20 rounded-full animate-pulse"></div>
        </div>
        <p className="text-xs font-medium mt-1 text-center bg-white/90 rounded px-1">Tu</p>
      </div>

      {/* Shop markers */}
      {shopPositions.map((shop) => (
        <div
          key={shop.id}
          className="absolute z-10 group cursor-pointer"
          style={{ left: `${shop.x}%`, top: `${shop.y}%` }}
        >
          {/* Marker */}
          <div className="relative">
            <div className="w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform">
              <div className="w-full h-full bg-primary rounded-full animate-pulse opacity-30"></div>
            </div>
            
            {/* Shop info popup */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
              <Card className="w-64 bg-white/95 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{shop.name}</h4>
                        <p className="text-xs text-muted-foreground">{shop.neighborhood}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-local-green text-white">
                        {shop.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span>{shop.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span>{shop.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Euro className="w-3 h-3 text-local-green" />
                        <span>{Math.min(...shop.giftCardPrices)}-{Math.max(...shop.giftCardPrices)}€</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {shop.description}
                    </p>
                    
                    <Link to={`/shop/${shop.id}`}>
                      <Button size="sm" className="w-full text-xs">
                        Vedi Dettagli
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ))}

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1">
        <Button variant="secondary" size="sm" className="w-8 h-8 p-0 bg-white/90">+</Button>
        <Button variant="secondary" size="sm" className="w-8 h-8 p-0 bg-white/90">-</Button>
      </div>
    </div>
  );
};

export default ShopMap;