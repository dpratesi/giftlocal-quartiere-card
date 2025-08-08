import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Edit, Settings, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMerchantShops } from '@/hooks/useMerchantShops';
import { ShopEditModal } from '@/components/ShopEditModal';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { updateShopStatus } from '@/lib/merchantApi';

interface ExtendedShop {
  id: string;
  name: string;
  category: string;
  image: string;
  neighborhood: string;
  city: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  rating: number;
  review_count: number;
  min_gift_card_amount: number;
  gift_card_prices?: number[];
  status?: string;
}

const MerchantShops = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { shops, isLoading, error, refetch } = useMerchantShops(user?.id);
  const [selectedShop, setSelectedShop] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatingShopId, setUpdatingShopId] = useState<string | null>(null);

  const handleEditShop = (shop: any) => {
    setSelectedShop(shop);
    setIsEditModalOpen(true);
  };

  const handleShopUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedShop(null);
    refetch();
    toast({
      title: t('merchant.shops.shopUpdated'),
      description: t('merchant.shops.updatedSuccess'),
    });
  };

  const handleStatusToggle = async (shop: ExtendedShop) => {
    try {
      setUpdatingShopId(shop.id);
      const newStatus = shop.status === 'active' ? 'inactive' : 'active';
      await updateShopStatus(shop.id, newStatus);
      
      refetch();
      toast({
        title: t('merchant.shops.statusUpdated'),
        description: newStatus === 'active' 
          ? t('merchant.shops.shopActivated')
          : t('merchant.shops.shopDeactivated'),
      });
    } catch (error) {
      console.error('Error updating shop status:', error);
      toast({
        title: t('merchant.shops.updateError'),
        description: t('merchant.shops.statusUpdateError'),
        variant: 'destructive',
      });
    } finally {
      setUpdatingShopId(null);
    }
  };

  const getStatusToggle = (shop: ExtendedShop) => {
    const status = shop.status || 'active';
    const isActive = status === 'active';
    const isUpdating = updatingShopId === shop.id;
    
    return (
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium transition-colors ${
          isActive ? 'text-green-600' : 'text-gray-500'
        }`}>
          {isActive ? t('merchant.shops.statusActive') : t('merchant.shops.statusInactive')}
        </span>
        <Switch
          checked={isActive}
          onCheckedChange={() => handleStatusToggle(shop)}
          disabled={isUpdating}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-destructive">{t('merchant.shops.loadingError')}</p>
            <Button onClick={() => refetch()} className="mt-4">
              {t('merchant.shops.retry')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/merchant/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('merchant.shops.backToDashboard')}
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {t('merchant.shops.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('merchant.shops.description')}
            </p>
          </div>
          
          <Button onClick={() => navigate('/register-shop')}>
            <Plus className="w-4 h-4 mr-2" />
            {t('merchant.shops.addShop')}
          </Button>
        </div>

        {/* Shops Grid */}
        {shops && shops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Card key={shop.id} className="group hover:shadow-hover transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Store className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{shop.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{shop.category}</p>
                      </div>
                    </div>
                    {getStatusToggle(shop)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {shop.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {shop.neighborhood}, {shop.city}
                    </span>
                    <span className="text-muted-foreground">
                      ⭐ {shop.rating?.toFixed(1) || '0.0'} ({shop.review_count || 0})
                    </span>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditShop(shop)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      {t('merchant.shops.modify')}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        // TODO: Implementare configurazioni avanzate
                        toast({
                          title: t('merchant.shops.featureComingSoon'),
                          description: t('merchant.shops.advancedSettings'),
                        });
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('merchant.shops.noShops')}</h3>
              <p className="text-muted-foreground mb-6">
                {t('merchant.shops.registerFirst')}
              </p>
              <Button onClick={() => navigate('/register-shop')}>
                <Plus className="w-4 h-4 mr-2" />
                {t('merchant.shops.registerFirstShop')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      <ShopEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedShop(null);
        }}
        shop={selectedShop}
        onShopUpdated={handleShopUpdated}
      />
    </div>
  );
};

export default MerchantShops;