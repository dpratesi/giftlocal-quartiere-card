import { useState } from "react";
import { ChevronDown, Star, Euro, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface FilterState {
  categories: string[];
  cities: string[];
  priceRange: [number, number];
  minRating: number;
  maxDistance: number;
}

interface ShopFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const categories = ["Bar & Caffè", "Ristoranti", "Librerie", "Bellezza", "Abbigliamento", "Alimentari"];
const cities = ["Borgo Vecchio", "Centro Storico", "Porta Romana", "Quartiere Moda"];

const ShopFilters = ({ filters, onFiltersChange, onClearFilters }: ShopFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters('categories', newCategories);
  };

  const toggleCity = (city: string) => {
    const newCities = filters.cities.includes(city)
      ? filters.cities.filter(c => c !== city)
      : [...filters.cities, city];
    updateFilters('cities', newCities);
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.cities.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.maxDistance < 1000 ? 1 : 0);

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                Filtri
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearFilters();
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancella
                  </Button>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Categoria</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label
                      htmlFor={`category-${category}`}
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Quartiere</Label>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={filters.cities.includes(city)}
                      onCheckedChange={() => toggleCity(city)}
                    />
                    <Label
                      htmlFor={`city-${city}`}
                      className="text-sm cursor-pointer"
                    >
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center gap-1">
                <Euro className="w-4 h-4" />
                Range Prezzo Gift Card: €{filters.priceRange[0]} - €{filters.priceRange[1]}
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters('priceRange', value as [number, number])}
                max={200}
                min={10}
                step={5}
                className="w-full"
              />
            </div>

            {/* Rating */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center gap-1">
                <Star className="w-4 h-4" />
                Valutazione minima
              </Label>
              <RadioGroup
                value={filters.minRating.toString()}
                onValueChange={(value) => updateFilters('minRating', parseFloat(value))}
                className="flex flex-wrap gap-4"
              >
                {[0, 4.0, 4.5, 4.8].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                    <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1">
                      {rating === 0 ? (
                        "Tutte"
                      ) : (
                        <>
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          {rating}+
                        </>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Distance */}
            <div>
              <Label className="text-sm font-medium mb-3 block flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Distanza massima: {filters.maxDistance === 1000 ? "Tutte" : `${filters.maxDistance}m`}
              </Label>
              <Slider
                value={[filters.maxDistance]}
                onValueChange={(value) => updateFilters('maxDistance', value[0])}
                max={1000}
                min={100}
                step={50}
                className="w-full"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ShopFilters;