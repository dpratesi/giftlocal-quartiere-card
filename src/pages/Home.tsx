import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/LoadingButton";
import { useNavigate } from "react-router-dom";

const categories = [
  "Bar & Caffè",
  "Ristoranti",
  "Librerie",
  "Bellezza",
  "Abbigliamento",
];

const Home = () => {
  const [city, setCity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const goToShops = async (category: string | null) => {
    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (category && category !== "Tutti") params.append("category", category);
    navigate(`/shops?${params.toString()}`);
    setIsLoading(false);
  };

  return (
    <div className="bg-background">
      <Header />
      <HeroSection />
      <div className="container mx-auto px-4 py-6 text-center space-y-6">
        {!city ? (
          <>
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
              Scegli la tua città
            </h2>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              {["Torino", "Milano", "Roma"].map((c) => (
                <Button
                  key={c}
                  variant="outline"
                  onClick={() => setCity(c)}
                  className="w-full sm:w-auto px-8 py-3 text-base md:text-lg font-medium hover:scale-105 transition-transform"
                >
                  {c}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-display font-bold mb-4">
              Scegli una categoria
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-4xl mx-auto">
              <LoadingButton
                variant="outline"
                className="w-full px-6 py-4 text-base md:text-lg font-medium hover:scale-105 transition-transform"
                onClick={() => goToShops(null)}
                loading={isLoading}
                disabled={isLoading}
              >
                Tutti i negozi
              </LoadingButton>
              {categories.map((cat) => (
                <LoadingButton
                  key={cat}
                  variant="outline"
                  className="w-full px-6 py-4 text-base md:text-lg font-medium hover:scale-105 transition-transform"
                  onClick={() => goToShops(cat)}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {cat}
                </LoadingButton>
              ))}
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setCity(null)}
              className="mt-6 text-muted-foreground hover:text-foreground"
            >
              ← Cambia città
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
