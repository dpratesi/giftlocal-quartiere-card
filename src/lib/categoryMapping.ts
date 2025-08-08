// Centralized category mapping and translation system

// Database category keys (technical values stored in DB)
export const DB_CATEGORIES = {
  BAR_CAFFE: 'bar-caffe',
  RISTORANTI: 'ristoranti', 
  LIBRERIE: 'librerie',
  BELLEZZA: 'bellezza',
  ABBIGLIAMENTO: 'abbigliamento',
  ALIMENTARI: 'alimentari',
  GELATERIA: 'gelateria',
} as const;

// Display category keys (for translations)
export const DISPLAY_CATEGORIES = {
  ALL: 'all',
  BAR: 'bar',
  RESTAURANT: 'restaurant',
  BOOKSTORE: 'bookstore', 
  BEAUTY: 'beauty',
  CLOTHING: 'clothing',
  GROCERY: 'grocery',
  GELATO: 'gelato',
} as const;

// Mapping from DB categories to display categories
const DB_TO_DISPLAY_MAP: Record<string, string> = {
  [DB_CATEGORIES.BAR_CAFFE]: DISPLAY_CATEGORIES.BAR,
  [DB_CATEGORIES.RISTORANTI]: DISPLAY_CATEGORIES.RESTAURANT,
  [DB_CATEGORIES.LIBRERIE]: DISPLAY_CATEGORIES.BOOKSTORE,
  [DB_CATEGORIES.BELLEZZA]: DISPLAY_CATEGORIES.BEAUTY,
  [DB_CATEGORIES.ABBIGLIAMENTO]: DISPLAY_CATEGORIES.CLOTHING,
  [DB_CATEGORIES.ALIMENTARI]: DISPLAY_CATEGORIES.GROCERY,
  [DB_CATEGORIES.GELATERIA]: DISPLAY_CATEGORIES.GELATO,
  // Legacy mappings for backwards compatibility
  'Caffetteria': DISPLAY_CATEGORIES.BAR,
  'Ristorante': DISPLAY_CATEGORIES.RESTAURANT,
  'Libreria': DISPLAY_CATEGORIES.BOOKSTORE,
  'Moda': DISPLAY_CATEGORIES.BEAUTY,
  'Gelateria': DISPLAY_CATEGORIES.GELATO,
};

// Mapping from display categories to DB categories  
const DISPLAY_TO_DB_MAP: Record<string, string> = {
  [DISPLAY_CATEGORIES.BAR]: DB_CATEGORIES.BAR_CAFFE,
  [DISPLAY_CATEGORIES.RESTAURANT]: DB_CATEGORIES.RISTORANTI,
  [DISPLAY_CATEGORIES.BOOKSTORE]: DB_CATEGORIES.LIBRERIE,
  [DISPLAY_CATEGORIES.BEAUTY]: DB_CATEGORIES.BELLEZZA,
  [DISPLAY_CATEGORIES.CLOTHING]: DB_CATEGORIES.ABBIGLIAMENTO,
  [DISPLAY_CATEGORIES.GROCERY]: DB_CATEGORIES.ALIMENTARI,
  [DISPLAY_CATEGORIES.GELATO]: DB_CATEGORIES.GELATERIA,
};

/**
 * Convert a database category value to a display category key for translation
 */
export function getDisplayCategoryKey(dbCategory: string): string {
  return DB_TO_DISPLAY_MAP[dbCategory] || dbCategory;
}

/**
 * Convert a display category key to a database category value
 */
export function getDbCategoryValue(displayCategory: string): string {
  return DISPLAY_TO_DB_MAP[displayCategory] || displayCategory;
}

/**
 * Get the translated category name for display
 */
export function getCategoryDisplayName(dbCategory: string, t: (key: string) => string): string {
  const displayKey = getDisplayCategoryKey(dbCategory);
  return t(`categories.${displayKey}`);
}

/**
 * Get all available categories for forms/filters
 */
export function getAllCategories() {
  return [
    { dbValue: DB_CATEGORIES.BAR_CAFFE, displayKey: DISPLAY_CATEGORIES.BAR },
    { dbValue: DB_CATEGORIES.RISTORANTI, displayKey: DISPLAY_CATEGORIES.RESTAURANT },
    { dbValue: DB_CATEGORIES.LIBRERIE, displayKey: DISPLAY_CATEGORIES.BOOKSTORE },
    { dbValue: DB_CATEGORIES.BELLEZZA, displayKey: DISPLAY_CATEGORIES.BEAUTY },
    { dbValue: DB_CATEGORIES.ABBIGLIAMENTO, displayKey: DISPLAY_CATEGORIES.CLOTHING },
    { dbValue: DB_CATEGORIES.ALIMENTARI, displayKey: DISPLAY_CATEGORIES.GROCERY },
    { dbValue: DB_CATEGORIES.GELATERIA, displayKey: DISPLAY_CATEGORIES.GELATO },
  ];
}