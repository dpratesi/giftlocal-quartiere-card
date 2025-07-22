import { Button } from "@/components/ui/button";
import { Gift, MapPin, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-hero text-white py-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/20"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/10"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/15"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Sostieni il commercio locale
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
            Regala il tuo
            <span className="block text-local-orange">quartiere</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Scopri, acquista e regala gift card dei migliori negozi vicino a te. 
            Un'unica piattaforma per sostenere la tua comunità locale.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center py-4">
            <div>
              <div className="text-3xl font-bold">150+</div>
              <div className="text-sm text-white/80">Negozi Partner</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5000+</div>
              <div className="text-sm text-white/80">Gift Card Vendute</div>
            </div>
            <div>
              <div className="text-3xl font-bold">12</div>
              <div className="text-sm text-white/80">Quartieri Coperti</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-white text-local-green hover:bg-white/90 font-semibold px-8 py-3"
            >
              <Gift className="w-5 h-5 mr-2" />
              Esplora Gift Card
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-local-green font-semibold px-8 py-3"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Il mio quartiere
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;