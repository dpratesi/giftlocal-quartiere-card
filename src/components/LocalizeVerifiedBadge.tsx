import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LocalizeVerifiedBadge = () => {
  return (
    <Badge className="bg-localize-sage text-white text-xs rounded-full flex items-center gap-1 px-2 py-1">
      <Eye className="w-3 h-3" />
      Commerciante Verificato
    </Badge>
  );
};

export default LocalizeVerifiedBadge;