import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useShops } from "@/hooks/useShops";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ShopFilters, { FilterState } from "@/components/ShopFilters";
import ViewToggle from "@/components/ViewToggle";
import ShopCard from "@/components/ShopCard";
import ShopMap from "@/components/ShopMap";
import { ShopListSkeleton } from "@/components/ShopCardSkeleton";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city');
  const initialCategory = searchParams.get('category');

  const [view, setView] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState<FilterState>(() => ({
    categories: initialCategory ? [initialCategory] : [],
    cities: initialCity ? [initialCity] : [],
    priceRange: [10, 200],
    minRating: 0,
    maxDistance: 1000
  }));

  const { shops, isLoading, error } = useShops();

  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(shop.category)) {
        return false;
      }
      
      // City or neighborhood filter
      if (
        filters.cities.length > 0 &&
        !filters.cities.includes(shop.neighborhood) &&
        !filters.cities.includes(shop.city)
      ) {
        return false;
      }
      
      // Price range filter
      const minPrice = Math.min(...shop.giftCardPrices);
      const maxPrice = Math.max(...shop.giftCardPrices);
      if (maxPrice < filters.priceRange[0] || minPrice > filters.priceRange[1]) {
        return false;
      }
      
      // Rating filter
      if (shop.rating < filters.minRating) {
        return false;
      }
      
      // Distance filter
      const distanceValue = parseInt(shop.distance.replace('m', ''));
      if (distanceValue > filters.maxDistance) {
        return false;
      }
      
      return true;
    });
  }, [filters, shops]);

  const handleCategoryToggle = (category: string) => {
    if (category === "Tutti") {
      setFilters(prev => ({ ...prev, categories: [] }));
    } else {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      }));
    }
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      cities: [],
      priceRange: [10, 200],
      minRating: 0,
      maxDistance: 1000
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <CategoryFilter 
          selectedCategories={[]}
          onCategoryToggle={() => {}}
        />
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <div className="space-y-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-24"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
              </div>
              <ShopListSkeleton count={6} />
            </div>
          </div>
        </section>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoryFilter 
        selectedCategories={filters.categories}
        onCategoryToggle={handleCategoryToggle}
      />
      
      {/* Featured Shops Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Negozi in Evidenza
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scoprix i migliori negozi del tuo quartiere e sostieni la tua comunità locale 
            con le nostre gift card digitali
          </p>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col xl:flex-row gap-6 mb-8">
          <div className="xl:w-1/4">
            <ShopFilters 
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>
          
          <div className="xl:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <p className="text-muted-foreground">
                {filteredShops.length} negozi trovati
              </p>
              <ViewToggle view={view} onViewChange={setView} />
            </div>

            {/* Shop Display */}
            {view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
                {filteredShops.map((shop) => (
                  <div key={shop.id} className="animate-scale-in">
                    <ShopCard {...shop} />
                  </div>
                ))}
              </div>
            ) : (
              <ShopMap shops={filteredShops} />
            )}

            {/* Load More Button */}
            {filteredShops.length > 0 && view === 'grid' && (
              <div className="text-center mt-12">
                <button 
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
                  onClick={() => alert('Funzionalità in arrivo!')}
                >
                  Carica altri negozi
                </button>
              </div>
            )}

            {/* No results */}
            {filteredShops.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Nessun negozio trovato con i filtri selezionati
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancella filtri
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-local-green-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-display font-bold text-foreground mb-4">
            Hai un negozio?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Unisciti a GiftLocal e inizia a vendere le tue gift card online. 
            È semplice, veloce e gratuito.
          </p>
          <Link to="/register-shop">
            <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
              Registra il tuo negozio
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
