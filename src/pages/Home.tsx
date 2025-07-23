import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
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
  const navigate = useNavigate();

  const goToShops = (category: string | null) => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (category && category !== "Tutti") params.append("category", category);
    navigate(`/shops?${params.toString()}`);
  };

  return (
    <div className="bg-background">
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
              <Button
                variant="outline"
                className="px-6 py-3 text-lg"
                onClick={() => goToShops(null)}
              >
                Tutti i negozi
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant="outline"
                  className="px-6 py-3 text-lg"
                  onClick={() => goToShops(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
