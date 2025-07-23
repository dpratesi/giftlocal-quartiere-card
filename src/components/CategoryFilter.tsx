import { Badge } from "@/components/ui/badge";
import { Coffee, UtensilsCrossed, Book, Scissors, Shirt, Gift } from "lucide-react";

const categories = [
  { name: "Tutti", icon: Gift, active: true },
  { name: "Bar & Caffè", icon: Coffee, active: false },
  { name: "Ristoranti", icon: UtensilsCrossed, active: false },
  { name: "Librerie", icon: Book, active: false },
  { name: "Bellezza", icon: Scissors, active: false },
  { name: "Abbigliamento", icon: Shirt, active: false },
];

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

const CategoryFilter = ({ selectedCategories, onCategoryToggle }: CategoryFilterProps) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = category.name === "Tutti" 
            ? selectedCategories.length === 0 
            : selectedCategories.includes(category.name);
          
          return (
            <Badge
              key={category.name}
              variant={isSelected ? "default" : "secondary"}
              className={`
                px-4 py-2 cursor-pointer transition-all duration-200 hover:scale-105
                ${isSelected 
                  ? "bg-primary text-primary-foreground shadow-warm" 
                  : "bg-muted text-muted-foreground hover:bg-primary/10"
                }
              `}
              onClick={() => onCategoryToggle(category.name)}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {category.name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;