import { Badge } from "@/components/ui/badge";
import { Coffee, UtensilsCrossed, Book, Scissors, Shirt, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const categories = [
  { key: "all", icon: Gift, dbName: "" },
  { key: "bar", icon: Coffee, dbName: "Caffetteria" },
  { key: "restaurant", icon: UtensilsCrossed, dbName: "Ristorante" },
  { key: "bookstore", icon: Book, dbName: "Libreria" },
  { key: "beauty", icon: Scissors, dbName: "Moda" },
  { key: "clothing", icon: Shirt, dbName: "abbigliamento" },
];

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const CategoryFilter = ({ selectedCategories, onCategoryToggle }: CategoryFilterProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const categoryName = t(`categories.${category.key}`);
          const isSelected = category.key === "all" 
            ? selectedCategories.length === 0 
            : selectedCategories.includes(category.dbName);
          
          return (
            <Badge
              key={category.key}
              variant={isSelected ? "default" : "secondary"}
              className={`
                px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-105 rounded-full border
                ${isSelected 
                  ? "bg-localize-terracotta text-white border-localize-terracotta" 
                  : "bg-white text-localize-sage border-localize-sage hover:bg-localize-terracotta hover:text-white hover:border-localize-terracotta"
                }
              `}
              onClick={() => onCategoryToggle(category.dbName)}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {categoryName}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;