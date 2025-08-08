import { Badge } from "@/components/ui/badge";
import { icons } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}
const CategoryFilter = ({
  selectedCategories,
  onCategoryToggle
}: CategoryFilterProps) => {
  const {
    categories,
    isLoading,
    getCategoryName
  } = useCategories();
  if (isLoading) {
    return <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({
          length: 7
        }).map((_, i) => <div key={i} className="h-10 w-24 bg-gray-200 animate-pulse rounded-full" />)}
        </div>
      </div>;
  }
  return;
};
export default CategoryFilter;