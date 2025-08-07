import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
      className="text-muted-foreground hover:text-foreground"
    >
      <Globe className="w-4 h-4 mr-2" />
      {language === 'it' ? 'EN' : 'IT'}
    </Button>
  );
};

export default LanguageToggle;