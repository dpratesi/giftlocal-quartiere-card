import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import ShopCard from "@/components/ShopCard";
import { mockShops } from "@/data/mockShops";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoryFilter />
      
      {/* Featured Shops Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Negozi in Evidenza
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scopri i migliori negozi del tuo quartiere e sostieni la tua comunità locale 
            con le nostre gift card digitali
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {mockShops.map((shop) => (
            <div key={shop.id} className="animate-scale-in">
              <ShopCard {...shop} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
            Carica altri negozi
          </button>
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
          <button className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
            Registra il tuo negozio
          </button>
        </div>
      </section>
    </div>
  );
};

export default Index;
