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
      <div className="container mx-auto px-4 py-6 text-center space-y-4">
        {!city ? (
          <>
            <h2 className="text-2xl font-display font-bold mb-4">
              Scegli la tua città
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {["Torino", "Milano", "Roma"].map((c) => (
                <Button
                  key={c}
                  variant="outline"
                  onClick={() => setCity(c)}
                  className="px-6 py-3 text-lg"
                >
                  {c}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-display font-bold mb-4">
              Scegli una categoria
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <LoadingButton
                variant="outline"
                className="px-6 py-3 text-lg"
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
                  className="px-6 py-3 text-lg"
                  onClick={() => goToShops(cat)}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {cat}
                </LoadingButton>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
