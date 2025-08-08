
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Settings2, Percent } from 'lucide-react';
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
}

type SettingsTab = 'discounts' | 'general' | 'analytics';

export const ShopSettingsModal: React.FC<ShopSettingsModalProps> = ({
  isOpen,
  onClose,
  shop,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('discounts');

  if (!shop) return null;

  const menuItems = [
    { id: 'discounts' as const, label: 'Sconti Gift Card', icon: Percent },
    { id: 'general' as const, label: 'Impostazioni Generali', icon: Settings2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'discounts':
        return <ShopDiscountsPanel shop={shop} />;
      case 'general':
        return (
          <div className="p-6 text-center text-muted-foreground">
            <Settings2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Impostazioni generali - In arrivo</p>
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
