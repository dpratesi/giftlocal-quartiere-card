import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface MerchantSettingsModalProps {
  merchantData: any;
  onSettingsUpdate?: (settings: any) => void;
}

const MerchantSettingsModal = ({ merchantData, onSettingsUpdate }: MerchantSettingsModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [profileSettings, setProfileSettings] = useState({
    firstName: merchantData?.firstName || "",
    lastName: merchantData?.lastName || "",
    email: merchantData?.email || "",
    phone: merchantData?.phone || "",
    businessLicense: merchantData?.businessLicense || "",
    vatNumber: merchantData?.vatNumber || ""
  });


  const [notificationSettings, setNotificationSettings] = useState({
    emailOrders: true,
    emailRedemptions: true,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90
  });

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSettings = {
        profile: profileSettings,
        notifications: notificationSettings,
        security: securitySettings
      };

      onSettingsUpdate?.(updatedSettings);
      
      toast({
        title: t('merchant.settings.saved'),
        description: t('merchant.settings.savedDesc'),
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: t('merchant.settings.error'),
        description: t('merchant.settings.errorDesc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          {t('merchant.settings.title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Impostazioni Account
          </DialogTitle>
          <DialogDescription>
            Gestisci le tue impostazioni globali dell'account merchant
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profilo</TabsTrigger>
            <TabsTrigger value="notifications">Notifiche</TabsTrigger>
            <TabsTrigger value="security">Sicurezza</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profilo Merchant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={profileSettings.firstName}
                      onChange={(e) => setProfileSettings({ ...profileSettings, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Cognome</Label>
                    <Input
                      id="lastName"
                      value={profileSettings.lastName}
                      onChange={(e) => setProfileSettings({ ...profileSettings, lastName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileSettings.email}
                      onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      value={profileSettings.phone}
                      onChange={(e) => setProfileSettings({ ...profileSettings, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessLicense">Licenza Commerciale</Label>
                    <Input
                      id="businessLicense"
                      value={profileSettings.businessLicense}
                      onChange={(e) => setProfileSettings({ ...profileSettings, businessLicense: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">Partita IVA</Label>
                    <Input
                      id="vatNumber"
                      value={profileSettings.vatNumber}
                      onChange={(e) => setProfileSettings({ ...profileSettings, vatNumber: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  {t('merchant.settings.notificationPrefs')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('merchant.settings.emailOrders')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('merchant.settings.emailOrdersDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailOrders}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailOrders: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('merchant.settings.emailRedemptions')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('merchant.settings.emailRedemptionsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailRedemptions}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailRedemptions: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('merchant.settings.smsNotifications')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('merchant.settings.smsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('merchant.settings.weeklyReports')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('merchant.settings.weeklyReportsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklyReports: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('merchant.settings.monthlyReports')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('merchant.settings.monthlyReportsDesc')}
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.monthlyReports}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, monthlyReports: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {t('merchant.settings.securitySettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{t('merchant.settings.twoFactorAuth')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('merchant.settings.twoFactorDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">{t('merchant.settings.sessionTimeout')}</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">{t('merchant.settings.passwordExpiry')}</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                  />
                </div>
                
                <Button variant="outline" className="w-full">
                  {t('merchant.settings.changePassword')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            {t('merchant.settings.cancel')}
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? t('merchant.settings.saving') : t('merchant.settings.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantSettingsModal;