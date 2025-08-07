const HeroSection = () => {
  return (
    <section className="bg-gradient-hero text-white py-10 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/20"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/10"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-white/15"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Main headline */}
          <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
            Vedi locale,
            <span className="block text-localize-terracotta">vivi locale</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Gli occhi della tua comunità digitale. Scopri, sostieni e condividi 
            le gift card dei commercianti del tuo quartiere. Insieme facciamo 
            fiorire l'economia locale.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center py-4">
            <div>
              <div className="text-3xl font-bold text-localize-night">150+</div>
              <div className="text-sm text-white/80">Commercianti Locali</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-localize-night">5000+</div>
              <div className="text-sm text-white/80">Gift Card Attivate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-localize-night">12</div>
              <div className="text-sm text-white/80">Quartieri Connessi</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
