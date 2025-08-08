import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Category {
  id: string;
  key: string;
  name_it: string;
  name_en: string;
  icon: string;
  color: string | null;
  sort_order: number;
  is_active: boolean;
}

export function useCategories() {
  const { language } = useLanguage();
  
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Category[];
    },
  });

  // Helper function to get category display name
  const getCategoryName = (category: Category) => {
    return language === 'en' ? category.name_en : category.name_it;
  };

  // Helper function to find category by key
  const getCategoryByKey = (key: string) => {
    return categories.find(cat => cat.key === key);
  };

  // Helper function to get category name by key
  const getCategoryNameByKey = (key: string) => {
    const category = getCategoryByKey(key);
    return category ? getCategoryName(category) : key;
  };

  return {
    categories,
    isLoading,
    error,
    getCategoryName,
    getCategoryByKey,
    getCategoryNameByKey,
  };
}