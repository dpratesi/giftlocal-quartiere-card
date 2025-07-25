import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Settings, Store, Bell, Shield, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MerchantSettingsModalProps {
  merchantData: any;
  onSettingsUpdate?: (settings: any) => void;
}

const MerchantSettingsModal = ({ merchantData, onSettingsUpdate }: MerchantSettingsModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [shopSettings, setShopSettings] = useState({
    shopName: merchantData?.shopName || "",
    description: "Specializzati in prodotti di alta qualità con un servizio clienti eccezionale.",
    address: "Via Roma 123, 20121 Milano",
    phone: "+39 02 123 456 789",
    email: merchantData?.email || "",
    website: "www.negozio.it",
    openingHours: "Lun-Sab: 9:00-19:00, Dom: 10:00-18:00"
  });

  const [giftCardSettings, setGiftCardSettings] = useState({
    defaultAmounts: [25, 50, 100, 150],
    maxAmount: 500,
    minAmount: 10,
    validityMonths: 12,
    customDesign: true
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
        shop: shopSettings,
        giftCards: giftCardSettings,
        notifications: notificationSettings,
        security: securitySettings
      };

      onSettingsUpdate?.(updatedSettings);
      
      toast({
        title: "Impostazioni Salvate",
        description: "Le tue impostazioni sono state aggiornate con successo",
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio delle impostazioni",
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
          Impostazioni
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Impostazioni Merchant
          </DialogTitle>
          <DialogDescription>
            Gestisci le impostazioni del tuo negozio e delle gift card
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="shop" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shop">Negozio</TabsTrigger>
            <TabsTrigger value="giftcards">Gift Card</TabsTrigger>
            <TabsTrigger value="notifications">Notifiche</TabsTrigger>
            <TabsTrigger value="security">Sicurezza</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shop" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  Informazioni Negozio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Nome Negozio</Label>
                    <Input
                      id="shopName"
                      value={shopSettings.shopName}
                      onChange={(e) => setShopSettings({ ...shopSettings, shopName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      value={shopSettings.phone}
                      onChange={(e) => setShopSettings({ ...shopSettings, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={shopSettings.description}
                    onChange={(e) => setShopSettings({ ...shopSettings, description: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input
                    id="address"
                    value={shopSettings.address}
                    onChange={(e) => setShopSettings({ ...shopSettings, address: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shopSettings.email}
                      onChange={(e) => setShopSettings({ ...shopSettings, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Sito Web</Label>
                    <Input
                      id="website"
                      value={shopSettings.website}
                      onChange={(e) => setShopSettings({ ...shopSettings, website: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="openingHours">Orari di Apertura</Label>
                  <Input
                    id="openingHours"
                    value={shopSettings.openingHours}
                    onChange={(e) => setShopSettings({ ...shopSettings, openingHours: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="giftcards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Configurazione Gift Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minAmount">Importo Minimo (€)</Label>
                    <Input
                      id="minAmount"
                      type="number"
                      value={giftCardSettings.minAmount}
                      onChange={(e) => setGiftCardSettings({ ...giftCardSettings, minAmount: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAmount">Importo Massimo (€)</Label>
                    <Input
                      id="maxAmount"
                      type="number"
                      value={giftCardSettings.maxAmount}
                      onChange={(e) => setGiftCardSettings({ ...giftCardSettings, maxAmount: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validityMonths">Validità Default (mesi)</Label>
                  <Input
                    id="validityMonths"
                    type="number"
                    value={giftCardSettings.validityMonths}
                    onChange={(e) => setGiftCardSettings({ ...giftCardSettings, validityMonths: parseInt(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Importi Predefiniti (€)</Label>
                  <div className="flex flex-wrap gap-2">
                    {giftCardSettings.defaultAmounts.map((amount, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            const newAmounts = [...giftCardSettings.defaultAmounts];
                            newAmounts[index] = parseInt(e.target.value);
                            setGiftCardSettings({ ...giftCardSettings, defaultAmounts: newAmounts });
                          }}
                          className="w-20"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Design Personalizzato</Label>
                    <p className="text-sm text-muted-foreground">
                      Abilita design personalizzato per le gift card
                    </p>
                  </div>
                  <Switch
                    checked={giftCardSettings.customDesign}
                    onCheckedChange={(checked) => setGiftCardSettings({ ...giftCardSettings, customDesign: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Preferenze Notifiche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifiche Ordini Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Ricevi email per ogni nuovo ordine
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailOrders}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailOrders: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifiche Utilizzo Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Ricevi email quando una gift card viene utilizzata
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailRedemptions}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailRedemptions: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifiche SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Ricevi SMS per eventi importanti
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Report Settimanali</Label>
                      <p className="text-sm text-muted-foreground">
                        Ricevi report delle vendite ogni settimana
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, weeklyReports: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Report Mensili</Label>
                      <p className="text-sm text-muted-foreground">
                        Ricevi report dettagliati ogni mese
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
                  Impostazioni Sicurezza
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticazione a Due Fattori</Label>
                    <p className="text-sm text-muted-foreground">
                      Aggiungi un livello extra di sicurezza al tuo account
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Timeout Sessione (minuti)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Scadenza Password (giorni)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                  />
                </div>
                
                <Button variant="outline" className="w-full">
                  Cambia Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Annulla
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? "Salvataggio..." : "Salva Impostazioni"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantSettingsModal;