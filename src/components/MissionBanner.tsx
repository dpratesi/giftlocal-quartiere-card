import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const MissionBanner = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-hero py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/10"></div>
        <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white/15"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 rounded-full bg-white/10"></div>
        <div className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full bg-white/20"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white">
            {t('mission.title')}
          </h3>
          <div className="flex justify-center w-full">
            <p className="text-xl text-white/90 leading-relaxed italic font-serif whitespace-nowrap">
              "{t('mission.quote')}"
            </p>
          </div>
          <Link to="/login?tab=signup">
            <Button 
              size="lg" 
              className="bg-localize-cream text-localize-night hover:bg-localize-cream/90 font-semibold px-8 py-6 text-lg"
            >
              {t('mission.button')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MissionBanner;