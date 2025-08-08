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
import { useLanguage } from "@/contexts/LanguageContext";
import { useCategories } from "@/hooks/useCategories";

interface FiltersSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}


const FiltersSidebar = ({ filters, onFiltersChange, onClearFilters }: FiltersSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { categories, isLoading, getCategoryName } = useCategories();

  const updateFilters = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (categoryKey: string) => {
    const newCategories = filters.categories.includes(categoryKey)
      ? filters.categories.filter(c => c !== categoryKey)
      : [...filters.categories, categoryKey];
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
          {t('filters.title')}
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
              {t('filters.shopsTitle')}
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
                {t('filters.clearAll')}
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="space-y-6 pr-4">
          {/* Categories */}
          <div>
            <Label className="text-sm font-medium mb-3 block">{t('filters.category')}</Label>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {categories
                  .filter(cat => cat.key !== 'all')
                  .map((category) => (
                    <div key={category.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.key}`}
                        checked={filters.categories.includes(category.key)}
                        onCheckedChange={() => toggleCategory(category.key)}
                      />
                      <Label
                        htmlFor={`category-${category.key}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {getCategoryName(category)}
                      </Label>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block flex items-center gap-1">
              <Euro className="w-4 h-4" />
              {t('filters.priceRange')}: €{filters.priceRange[0]} - €{filters.priceRange[1]}
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
              {t('filters.minRating')}
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
                      t('filters.allRatings')
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
              {t('filters.maxDistance')}: {filters.maxDistance === 1000 ? t('filters.allDistances') : `${filters.maxDistance}m`}
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