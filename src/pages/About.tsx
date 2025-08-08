import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-localize-cream">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-localize-night mb-8 text-center">
            {t('about.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-localize-night/80">
            <section className="mb-12">
              <h2 className="text-2xl font-display font-semibold text-localize-night mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg leading-relaxed mb-6">
                {t('about.mission.description')}
              </p>
              <p className="text-lg leading-relaxed">
                {t('about.mission.details')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-display font-semibold text-localize-night mb-6">
                {t('about.features.title')}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/50 p-6 rounded-lg border border-localize-sage/20">
                  <h3 className="text-xl font-semibold text-localize-night mb-3">
                    {t('about.features.discovery.title')}
                  </h3>
                  <p className="text-localize-night/70">
                    {t('about.features.discovery.description')}
                  </p>
                </div>
                <div className="bg-white/50 p-6 rounded-lg border border-localize-sage/20">
                  <h3 className="text-xl font-semibold text-localize-night mb-3">
                    {t('about.features.giftcards.title')}
                  </h3>
                  <p className="text-localize-night/70">
                    {t('about.features.giftcards.description')}
                  </p>
                </div>
                <div className="bg-white/50 p-6 rounded-lg border border-localize-sage/20">
                  <h3 className="text-xl font-semibold text-localize-night mb-3">
                    {t('about.features.community.title')}
                  </h3>
                  <p className="text-localize-night/70">
                    {t('about.features.community.description')}
                  </p>
                </div>
                <div className="bg-white/50 p-6 rounded-lg border border-localize-sage/20">
                  <h3 className="text-xl font-semibold text-localize-night mb-3">
                    {t('about.features.sustainability.title')}
                  </h3>
                  <p className="text-localize-night/70">
                    {t('about.features.sustainability.description')}
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-display font-semibold text-localize-night mb-6">
                {t('about.vision.title')}
              </h2>
              <p className="text-lg leading-relaxed">
                {t('about.vision.description')}
              </p>
            </section>

            <section className="text-center">
              <h2 className="text-2xl font-display font-semibold text-localize-night mb-6">
                {t('about.cta.title')}
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                {t('about.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/shops"
                  className="inline-flex items-center justify-center px-8 py-3 bg-localize-terracotta text-white font-medium rounded-lg hover:bg-localize-terracotta/90 transition-colors"
                >
                  {t('about.cta.exploreShops')}
                </a>
                <a
                  href="/register-shop"
                  className="inline-flex items-center justify-center px-8 py-3 bg-localize-sage text-white font-medium rounded-lg hover:bg-localize-sage/90 transition-colors"
                >
                  {t('about.cta.joinMerchants')}
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;