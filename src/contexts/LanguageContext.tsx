import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation object
const translations = {
  it: {
    // Header
    'header.searchPlaceholder': 'Cerca negozi, categorie...',
    'header.favorites': 'Preferiti',
    'header.profile': 'Profilo',
    'header.hello': 'Ciao',
    'header.logout': 'Esci',
    'header.login': 'Accedi',
    'header.tagline': 'Il tuo quartiere',
    
    // Common
    'common.loading': 'Caricamento...',
    'common.error': 'Errore',
    'common.save': 'Salva',
    'common.cancel': 'Annulla',
    'common.close': 'Chiudi',
    'common.delete': 'Elimina',
    'common.edit': 'Modifica',
    'common.view': 'Visualizza',
    'common.all': 'Tutti',
    
    // Shop listing
    'shops.featuredTitle': 'Negozi in Evidenza',
    'shops.featuredDescription': 'Scopri i migliori negozi del tuo quartiere e sostieni la tua comunità locale con le nostre gift card digitali',
    'shops.shopsFound': 'negozi trovati',
    'shops.loadMore': 'Carica altri negozi',
    'shops.noResults': 'Nessun negozio trovato con i filtri selezionati',
    'shops.clearFilters': 'Cancella filtri',
    'shops.unableToLoad': 'Impossibile caricare i negozi',
    
    // View toggle
    'view.list': 'Lista',
    'view.map': 'Mappa',
    
    // CTA Section
    'cta.title': 'Hai un negozio?',
    'cta.description': 'Unisciti a GiftLocal e inizia a vendere le tue gift card online. È semplice, veloce e gratuito.',
    'cta.registerShop': 'Registra il tuo negozio',
    
    // Gift cards
    'giftCard.useNow': 'Usa ora',
    'giftCard.expired': 'Scaduta',
    'giftCard.active': 'Attiva',
    'giftCard.qrCodeTitle': 'QR Code Gift Card',
    'giftCard.showToMerchant': 'Mostra questo QR code al commerciante per utilizzare la tua gift card',
    'giftCard.code': 'Codice',
    
    // Profile
    'profile.title': 'Il mio profilo',
    'profile.giftCards': 'Le mie Gift Card',
    
    // 404
    'notFound.title': '404',
    'notFound.description': 'Oops! Pagina non trovata',
    'notFound.returnHome': 'Torna alla Home'
  },
  en: {
    // Header
    'header.searchPlaceholder': 'Search shops, categories...',
    'header.favorites': 'Favorites',
    'header.profile': 'Profile',
    'header.hello': 'Hello',
    'header.logout': 'Logout',
    'header.login': 'Login',
    'header.tagline': 'Your neighborhood',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.all': 'All',
    
    // Shop listing
    'shops.featuredTitle': 'Featured Shops',
    'shops.featuredDescription': 'Discover the best shops in your neighborhood and support your local community with our digital gift cards',
    'shops.shopsFound': 'shops found',
    'shops.loadMore': 'Load more shops',
    'shops.noResults': 'No shops found with selected filters',
    'shops.clearFilters': 'Clear filters',
    'shops.unableToLoad': 'Unable to load shops',
    
    // View toggle
    'view.list': 'List',
    'view.map': 'Map',
    
    // CTA Section
    'cta.title': 'Do you have a shop?',
    'cta.description': 'Join GiftLocal and start selling your gift cards online. It\'s simple, fast and free.',
    'cta.registerShop': 'Register your shop',
    
    // Gift cards
    'giftCard.useNow': 'Use now',
    'giftCard.expired': 'Expired',
    'giftCard.active': 'Active',
    'giftCard.qrCodeTitle': 'Gift Card QR Code',
    'giftCard.showToMerchant': 'Show this QR code to the merchant to use your gift card',
    'giftCard.code': 'Code',
    
    // Profile
    'profile.title': 'My profile',
    'profile.giftCards': 'My Gift Cards',
    
    // 404
    'notFound.title': '404',
    'notFound.description': 'Oops! Page not found',
    'notFound.returnHome': 'Return to Home'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'it';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};