import { Badge } from "@/components/ui/badge";
import { icons } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const CategoryFilter = ({ selectedCategories, onCategoryToggle }: CategoryFilterProps) => {
  const { categories, isLoading, getCategoryName } = useCategories();
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => {
          const IconComponent = icons[category.icon as keyof typeof icons];
          const categoryName = getCategoryName(category);
          const isSelected = category.key === "all" 
            ? selectedCategories.length === 0 
            : selectedCategories.includes(category.key);
          
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
              onClick={() => onCategoryToggle(category.key === "all" ? "" : category.key)}
            >
              {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
              {categoryName}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;