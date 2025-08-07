import { useState } from "react";
import { MapPin, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserPreferredCity } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

const cities = [
  "Roma",
  "Milano",
  "Napoli",
  "Torino",
  "Palermo",
  "Genova",
  "Bologna",
  "Firenze",
  "Bari",
  "Catania",
  "Venezia",
  "Verona",
  "Messina",
  "Padova",
  "Trieste"
];

const CitySelector = () => {
  const { user, updateUserCity } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentCity = user?.preferred_city || 'Roma';

  const handleCityChange = async (city: string) => {
    if (city === currentCity || !user) return;
    
    setIsUpdating(true);
    try {
      await updateUserPreferredCity(city);
      updateUserCity?.(city);
      
      toast({
        title: "Città aggiornata",
        description: `La tua città preferita è ora ${city}`,
      });

      // Se siamo sulla pagina shops, ricarichiamo con la nuova città
      if (location.pathname === '/shops') {
        navigate(`/shops?city=${city}`, { replace: true });
        // Piccolo delay per permettere al cambio di città di propagarsi
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error('Error updating city:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la città",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Only show for regular users, not merchants
  if (!user || user.type === 'merchant') {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          disabled={isUpdating}
        >
          <MapPin className="w-4 h-4" />
          <span className="hidden sm:inline">{currentCity}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {cities.map((city) => (
          <DropdownMenuItem
            key={city}
            onClick={() => handleCityChange(city)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{city}</span>
            {city === currentCity && <Check className="w-4 h-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CitySelector;