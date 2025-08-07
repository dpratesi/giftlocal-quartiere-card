import { useState } from "react";
import { Star, Euro, MapPin, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FilterState } from "./ShopFilters";

interface FiltersSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const categories = ["Bar & Caffè", "Ristoranti", "Librerie", "Bellezza", "Abbigliamento", "Alimentari"];

const FiltersSidebar = ({ filters, onFiltersChange, onClearFilters }: FiltersSidebarProps) => {
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

  const activeFiltersCount = 
    filters.categories.length + 
    (filters.minRating > 0 ? 1 : 0) + 
    (filters.maxDistance < 1000 ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtri
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground px-1.5 py-0.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 sm:w-96">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              Filtri Negozi
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </SheetTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancella tutto
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="space-y-6 pr-4">
          {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Categoria</Label>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {category}
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
              className="space-y-3"
            >
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 cursor-pointer">
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersSidebar;