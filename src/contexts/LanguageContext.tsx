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
    'header.tagline': 'Local-Eyes',
    
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
    'common.or': 'oppure',
    
    // Shop listing
    'shops.featuredTitle': 'I volti del tuo quartiere',
    'shops.featuredDescription': 'Ogni acquisto è uno sguardo di fiducia. Conosci le storie dei commercianti che rendono unico il tuo quartiere.',
    'shops.shopsFound': 'negozi trovati',
    'shops.loadMore': 'Carica altri negozi',
    'shops.noResults': 'Nessun negozio trovato con i filtri selezionati',
    'shops.clearFilters': 'Cancella filtri',
    'shops.unableToLoad': 'Impossibile caricare i negozi',
    'shops.discoverGiftCards': 'Scopri Gift Card',
    'shops.giftCards': 'gift card',
    
    // View toggle
    'view.list': 'Lista',
    'view.map': 'Mappa',
    
    // CTA Section
    'cta.title': 'Hai un negozio?',
    'cta.description': 'Unisciti a Localize e inizia a vendere le tue gift card online. È semplice, veloce e gratuito.',
    'cta.registerShop': 'Registra il tuo negozio',
    
    // Gift cards
    'giftCard.useNow': 'Usa ora',
    'giftCard.expired': 'Scaduta',
    'giftCard.active': 'Attiva',
    'giftCard.qrCodeTitle': 'QR Code Gift Card',
    'giftCard.showToMerchant': 'Mostra questo QR code al commerciante per utilizzare la tua gift card',
    'giftCard.code': 'Codice',
    'giftCard.details': 'Dettagli',
    'giftCard.value': 'Valore',
    'giftCard.remaining': 'Rimangono',
    'giftCard.expiresOn': 'Scade il',
    'giftCard.message': 'Messaggio',
    'giftCard.purchasedOn': 'Acquistata il',
    'giftCard.status': {
      'active': 'Attiva',
      'used': 'Utilizzata',
      'expired': 'Scaduta',
      'cancelled': 'Annullata',
      'estinta': 'Estinta',
      'scaduta': 'Scaduta',
      'inactive': 'Inattiva'
    },
    
    // Profile
    'profile.title': 'Il mio profilo',
    'profile.giftCards': 'Le mie Gift Card',
    'profile.activeGiftCards': 'Gift Card Attive',
    'profile.inactiveGiftCards': 'Gift Card Disattive',
    'profile.quickActions': 'Azioni rapide',
    'profile.favoriteShops': 'Negozi preferiti',
    'profile.settings': 'Impostazioni',
    'profile.notifications': 'Notifiche',
    'profile.myLocations': 'Le mie posizioni',
    'profile.logout': 'Esci',
    'profile.visit': 'Visita',
    'profile.noGiftCards': 'Non hai ancora acquistato nessuna gift card',
    'profile.exploreShops': 'Esplora negozi',
    'profile.loadingGiftCards': 'Caricamento gift card...',
    'profile.accessRequired': 'Accesso richiesto',
    'profile.loginToAccess': 'Effettua il login per accedere al tuo profilo',
    'profile.login': 'Accedi',
    'profile.backToHome': 'Torna alla Home',
    'profile.merchantDashboard': 'Dashboard Merchant',
    'profile.merchantDescription': 'Accedi alla tua dashboard per gestire le gift card e monitorare le vendite',
    'profile.goToDashboard': 'Vai alla Dashboard',
    
    // Login Select
    'loginSelect.title': 'Scegli il tipo di accesso',
    'loginSelect.description': 'Seleziona come vuoi accedere a Localize',
    'loginSelect.customer': 'Cliente',
    'loginSelect.customerDescription': 'Accedi per acquistare gift card e scoprire i negozi del tuo quartiere',
    'loginSelect.loginAsCustomer': 'Accedi come Cliente',
    'loginSelect.merchant': 'Merchant',
    'loginSelect.merchantDescription': 'Gestisci il tuo negozio, le gift card e monitora le vendite',
    'loginSelect.loginAsMerchant': 'Accedi come Merchant',
    
    // Login
    'login.title': 'Localize',
    'login.description': 'Accedi o registrati per gestire le tue gift card',
    'login.tab.login': 'Accedi',
    'login.tab.signup': 'Registrati',
    'login.email': 'Email',
    'login.emailPlaceholder': 'la-tua-email@esempio.com',
    'login.password': 'Password',
    'login.passwordPlaceholder': '••••••••',
    'login.confirmPassword': 'Conferma Password',
    'login.fullName': 'Nome completo',
    'login.namePlaceholder': 'Il tuo nome',
    'login.rememberMe': 'Ricordami',
    'login.loginButton': 'Accedi',
    'login.signupButton': 'Registrati',
    'login.loggingIn': 'Accesso in corso...',
    'login.signingUp': 'Registrazione in corso...',
    'login.continueWithGoogle': 'Continua con Google',
    'login.loginSuccess': 'Login effettuato',
    'login.welcomeMessage': 'Benvenuto in Localize!',
    'login.loginError': 'Errore di login',
    'login.invalidCredentials': 'Email o password non corretti',
    'login.signupSuccess': 'Registrazione completata',
    'login.signupWelcome': 'Benvenuto in Localize! Effettua il login per continuare.',
    'login.signupError': 'Errore di registrazione',
    'login.signupGenericError': 'Si è verificato un errore durante la registrazione',
    'login.passwordMismatch': 'Le password non coincidono',
    
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
    'header.tagline': 'Local-Eyes',
    
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
    'common.or': 'or',
    
    // Shop listing
    'shops.featuredTitle': 'The faces of your neighborhood',
    'shops.featuredDescription': 'Every purchase is a look of trust. Get to know the stories of the merchants that make your neighborhood unique.',
    'shops.shopsFound': 'shops found',
    'shops.loadMore': 'Load more shops',
    'shops.noResults': 'No shops found with selected filters',
    'shops.clearFilters': 'Clear filters',
    'shops.unableToLoad': 'Unable to load shops',
    'shops.discoverGiftCards': 'Discover Gift Cards',
    'shops.giftCards': 'gift cards',
    
    // View toggle
    'view.list': 'List',
    'view.map': 'Map',
    
    // CTA Section
    'cta.title': 'Do you have a shop?',
    'cta.description': 'Join Localize and start selling your gift cards online. It\'s simple, fast and free.',
    'cta.registerShop': 'Register your shop',
    
    // Gift cards
    'giftCard.useNow': 'Use now',
    'giftCard.expired': 'Expired',
    'giftCard.active': 'Active',
    'giftCard.qrCodeTitle': 'Gift Card QR Code',
    'giftCard.showToMerchant': 'Show this QR code to the merchant to use your gift card',
    'giftCard.code': 'Code',
    'giftCard.details': 'Details',
    'giftCard.value': 'Value',
    'giftCard.remaining': 'Remaining',
    'giftCard.expiresOn': 'Expires on',
    'giftCard.message': 'Message',
    'giftCard.purchasedOn': 'Purchased on',
    'giftCard.status': {
      'active': 'Active',
      'used': 'Used',
      'expired': 'Expired',
      'cancelled': 'Cancelled',
      'estinta': 'Depleted',
      'scaduta': 'Expired',
      'inactive': 'Inactive'
    },
    
    // Profile
    'profile.title': 'My profile',
    'profile.giftCards': 'My Gift Cards',
    'profile.activeGiftCards': 'Active Gift Cards',
    'profile.inactiveGiftCards': 'Inactive Gift Cards',
    'profile.quickActions': 'Quick Actions',
    'profile.favoriteShops': 'Favorite Shops',
    'profile.settings': 'Settings',
    'profile.notifications': 'Notifications',
    'profile.myLocations': 'My Locations',
    'profile.logout': 'Logout',
    'profile.visit': 'Visit',
    'profile.noGiftCards': 'You haven\'t purchased any gift cards yet',
    'profile.exploreShops': 'Explore Shops',
    'profile.loadingGiftCards': 'Loading gift cards...',
    'profile.accessRequired': 'Access Required',
    'profile.loginToAccess': 'Please log in to access your profile',
    'profile.login': 'Login',
    'profile.backToHome': 'Back to Home',
    'profile.merchantDashboard': 'Merchant Dashboard',
    'profile.merchantDescription': 'Access your dashboard to manage gift cards and monitor sales',
    'profile.goToDashboard': 'Go to Dashboard',
    
    // Login Select
    'loginSelect.title': 'Choose your access type',
    'loginSelect.description': 'Select how you want to access Localize',
    'loginSelect.customer': 'Customer',
    'loginSelect.customerDescription': 'Log in to buy gift cards and discover shops in your neighborhood',
    'loginSelect.loginAsCustomer': 'Login as Customer',
    'loginSelect.merchant': 'Merchant',
    'loginSelect.merchantDescription': 'Manage your shop, gift cards and monitor sales',
    'loginSelect.loginAsMerchant': 'Login as Merchant',
    
    // Login
    'login.title': 'Localize',
    'login.description': 'Login or register to manage your gift cards',
    'login.tab.login': 'Login',
    'login.tab.signup': 'Sign Up',
    'login.email': 'Email',
    'login.emailPlaceholder': 'your-email@example.com',
    'login.password': 'Password',
    'login.passwordPlaceholder': '••••••••',
    'login.confirmPassword': 'Confirm Password',
    'login.fullName': 'Full Name',
    'login.namePlaceholder': 'Your name',
    'login.rememberMe': 'Remember me',
    'login.loginButton': 'Login',
    'login.signupButton': 'Sign Up',
    'login.loggingIn': 'Logging in...',
    'login.signingUp': 'Signing up...',
    'login.continueWithGoogle': 'Continue with Google',
    'login.loginSuccess': 'Login successful',
    'login.welcomeMessage': 'Welcome to Localize!',
    'login.loginError': 'Login error',
    'login.invalidCredentials': 'Invalid email or password',
    'login.signupSuccess': 'Registration completed',
    'login.signupWelcome': 'Welcome to Localize! Please log in to continue.',
    'login.signupError': 'Registration error',
    'login.signupGenericError': 'An error occurred during registration',
    'login.passwordMismatch': 'Passwords do not match',
    
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
    // First try to get the translation directly (flat structure)
    const translation = translations[language][key];
    if (translation) {
      return translation;
    }
    
    // Fallback: try nested structure
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if path doesn't exist
      }
    }
    
    return typeof value === 'string' ? value : key;
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