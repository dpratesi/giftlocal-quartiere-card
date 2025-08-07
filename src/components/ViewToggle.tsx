import { LayoutGrid, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ViewToggleProps {
  view: 'grid' | 'map';
  onViewChange: (view: 'grid' | 'map') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex bg-muted rounded-lg p-1">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="w-4 h-4" />
        {t('view.list')}
      </Button>
      <Button
        variant={view === 'map' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('map')}
        className="flex items-center gap-2"
      >
        <Map className="w-4 h-4" />
        {t('view.map')}
      </Button>
    </div>
  );
};

export default ViewToggle;