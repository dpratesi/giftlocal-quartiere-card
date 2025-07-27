import { Search, MapPin, Heart, User, ShoppingBag, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card shadow-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-display font-bold text-foreground">GiftLocal</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Il tuo quartiere</p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cerca negozi, categorie..."
                className="pl-10 pr-10 bg-muted border-muted-foreground/20 focus:border-primary"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
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
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden xl:block">
                  Ciao, {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden xl:inline">Esci</span>
                </Button>
              </div>
            ) : (
              <Link to="/login-select">
                <Button variant="default" size="sm" className="bg-primary hover:bg-primary-hover">
                  Accedi
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border">
            {/* Mobile Search */}
            <div className="relative mt-4 mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cerca negozi, categorie..."
                className="pl-10 pr-10 bg-muted border-muted-foreground/20 focus:border-primary"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
            </div>

            {/* Mobile Actions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>Preferiti</span>
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profilo</span>
                  </Button>
                </Link>
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground text-center">
                    Ciao, {user?.name}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Esci
                  </Button>
                </div>
              ) : (
                <Link to="/login-select" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full bg-primary hover:bg-primary-hover">
                    Accedi
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;