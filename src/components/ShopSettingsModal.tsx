
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Settings2, Percent, Store, BarChart3, Edit } from 'lucide-react';
import { ShopDiscountsPanel } from '@/components/ShopDiscountsPanel';

interface Shop {
  id: string;
  name: string;
  category: string;
  description: string;
  neighborhood: string;
  city: string;
  min_gift_card_amount: number;
  status?: string;
}

interface ShopSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
  onEditShop?: () => void;
}

type SettingsTab = 'discounts' | 'general' | 'analytics';

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  isOpen,
  onClose,
  shop,
  onEditShop,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('discounts');

  if (!shop) return null;

  const menuItems = [
    { id: 'discounts' as const, label: 'Sconti Gift Card', icon: Percent },
    { id: 'general' as const, label: 'Configurazioni Negozio', icon: Store },
    { id: 'analytics' as const, label: 'Analytics & Report', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'discounts':
        return <ShopDiscountsPanel shop={shop} />;
      case 'general':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Informazioni Negozio</h3>
                <p className="text-sm text-muted-foreground">
                  Modifica le informazioni di base del negozio
                </p>
              </div>
              <Button onClick={onEditShop} variant="outline" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Modifica Info Negozio
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nome</p>
                <p className="text-base">{shop.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                <p className="text-base">{shop.category}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Descrizione</p>
                <p className="text-base">{shop.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quartiere</p>
                <p className="text-base">{shop.neighborhood}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Città</p>
                <p className="text-base">{shop.city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Importo Min. Gift Card</p>
                <p className="text-base">€{shop.min_gift_card_amount}</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Configurazioni Specifiche del Negozio
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Qui potrai presto configurare impostazioni specifiche che sovrascrivono quelle globali dell'account.
              </p>
              <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                <p>• Override delle configurazioni gift card globali</p>
                <p>• Impostazioni di pagamento specifiche</p>
                <p>• Configurazioni di notifica personalizzate</p>
                <p>• Gestione orari di apertura</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Analytics & Report</h3>
              <p className="text-sm text-muted-foreground">
                Statistiche e metriche specifiche per questo negozio
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Gift Card Vendute</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">0</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Ricavi Totali</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">€0</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Gift Card Attive</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">0</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Riscatti</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">0</p>
              </div>
            </div>
            
            <div className="p-6 bg-muted/20 rounded-lg text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Analytics dettagliati e grafici saranno disponibili presto
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              Impostazioni - {shop.name}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex min-h-[500px]">
          {/* Sidebar Menu */}
          <div className="w-64 border-r bg-muted/20">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
