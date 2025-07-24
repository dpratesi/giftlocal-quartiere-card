import { Search, MapPin, Heart, User, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-card shadow-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">GiftLocal</h1>
              <p className="text-xs text-muted-foreground">Il tuo quartiere</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cerca negozi, categorie..."
                className="pl-10 pr-10 bg-muted border-muted-foreground/20 focus:border-primary"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary-hover">
                Accedi
              </Button>
            </Link>
            <Link to="/merchant/login">
              <Button variant="outline" size="sm">
                Merchant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;