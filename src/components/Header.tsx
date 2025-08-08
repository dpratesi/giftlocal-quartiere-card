import { Search, MapPin, Heart, User, ShoppingBag, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import CitySelector from "@/components/CitySelector";
import LanguageToggle from "@/components/LanguageToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-localize-cream shadow-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-6">
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
            
            {/* About Link */}
            <Link 
              to="/about" 
              className="hidden md:block px-4 py-2 text-sm font-medium text-localize-sage bg-white/20 border border-localize-sage/30 rounded-full hover:bg-localize-sage hover:text-white hover:border-localize-sage hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {t('header.about')}
            </Link>
          </div>

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
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground flex items-center space-x-1">
                    <User className="w-5 h-5" />
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg z-[60]">
                  <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border">
                    {t('profile.greeting')}, {user?.name || t('profile.defaultUser')}
                  </div>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('profile.dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('profile.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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