import { Search, MapPin, Heart, User, ShoppingBag, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import CitySelector from "@/components/CitySelector";
import LanguageToggle from "@/components/LanguageToggle";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-localize-cream shadow-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-localize-sage rounded-full flex items-center justify-center relative overflow-hidden">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-localize-terracotta rounded-full flex items-center justify-center">
                <MapPin className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-display font-bold text-localize-night">Localize</h1>
              <p className="text-xs text-localize-sage hidden sm:block font-serif italic">{t('header.tagline')}</p>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('header.searchPlaceholder')}
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
            <LanguageToggle />
            <CitySelector />
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
                  {t('header.hello')}, {user?.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden xl:inline">{t('header.logout')}</span>
                </Button>
              </div>
            ) : (
              <Link to="/login-select">
                <Button variant="default" size="sm" className="bg-localize-terracotta hover:bg-localize-terracotta/90 text-white">
                  {t('header.login')}
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
                placeholder={t('header.searchPlaceholder')}
                className="pl-10 pr-10 bg-muted border-muted-foreground/20 focus:border-primary"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 cursor-pointer hover:text-primary transition-colors" />
            </div>

            {/* Mobile Actions */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <LanguageToggle />
                <CitySelector />
              </div>
              <div className="flex items-center justify-between">
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Heart className="w-5 h-5" />
                    <span>{t('header.favorites')}</span>
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>{t('header.profile')}</span>
                  </Button>
                </Link>
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground text-center">
                    {t('header.hello')}, {user?.name}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('header.logout')}
                  </Button>
                </div>
              ) : (
                <Link to="/login-select" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full bg-localize-terracotta hover:bg-localize-terracotta/90 text-white">
                    {t('header.login')}
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