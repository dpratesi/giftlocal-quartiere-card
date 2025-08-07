import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

const LocalizeVerifiedBadge = () => {
  const { t } = useLanguage();
  
  return (
    <Badge className="bg-localize-sage text-white text-xs rounded-full flex items-center gap-1 px-2 py-1">
      <Eye className="w-3 h-3" />
      {t('merchant.verified')}
    </Badge>
  );
};

export default LocalizeVerifiedBadge;