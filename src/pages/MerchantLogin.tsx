
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Store, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useEffect } from "react";

const MerchantLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { login, signup, isLoading, user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Check if user is already logged in as customer and offer logout
  useEffect(() => {
    if (user && user.type === 'customer') {
      toast({
        title: t('merchant.login.customerAccountConnected'),
        description: t('merchant.login.mustLogoutCustomer'),
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              await logout();
              toast({
                title: t('merchant.login.disconnected'),
                description: t('merchant.login.canLoginMerchant'),
              });
            }}
          >
            {t('merchant.login.disconnect')}
          </Button>
        ),
      });
    }
  }, [user, logout, t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login(loginForm.email, loginForm.password, "merchant");
    if (result.success) {
      toast({
        title: t('login.loginSuccess'),
        description: t('login.welcomeMessage'),
      });
      // Use replace to avoid back button issues
      navigate("/merchant/dashboard", { replace: true });
    } else {
      toast({
        title: t('login.loginError'),
        description: result.error || t('login.invalidCredentials'),
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: t('common.error'),
        description: t('login.passwordMismatch'),
        variant: "destructive",
      });
      return;
    }

    const result = await signup(signupForm.email, signupForm.password, signupForm.name, "merchant");
    if (result.success) {
      toast({
        title: t('merchant.login.registrationComplete'),
        description: t('merchant.login.registrationWelcome'),
      });
      setSignupForm({ name: "", email: "", password: "", confirmPassword: "" });
    } else {
      toast({
        title: t('merchant.login.registrationError'),
        description: result.error || t('login.signupGenericError'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('merchant.login.backHome')}
          </Button>
        </Link>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('merchant.login.title')}</CardTitle>
                <p className="text-muted-foreground">
                  {t('merchant.login.description')}
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">{t('login.tab.login')}</TabsTrigger>
                  <TabsTrigger value="signup">{t('login.tab.signup')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">{t('login.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          placeholder={t('login.emailPlaceholder')}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password">{t('login.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10 pr-10"
                          placeholder={t('login.passwordPlaceholder')}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? t('merchant.login.loggingIn') : t('login.loginButton')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">{t('merchant.login.shopName')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10"
                          placeholder={t('merchant.login.shopNamePlaceholder')}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{t('login.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10"
                          placeholder={t('login.emailPlaceholder')}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{t('login.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={signupForm.password}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                          className="pl-10"
                          placeholder={t('login.passwordPlaceholder')}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm-password">{t('merchant.login.confirmPassword')}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-confirm-password"
                          type={showPassword ? "text" : "password"}
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="pl-10"
                          placeholder={t('login.passwordPlaceholder')}
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? t('merchant.login.registrationInProgress') : t('merchant.login.registerButton')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  {t('merchant.login.customerLogin')}{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    {t('merchant.login.loginAsCustomer')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MerchantLogin;
