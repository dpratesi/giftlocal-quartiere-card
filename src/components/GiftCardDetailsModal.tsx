import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchGiftCardTransactions } from "@/lib/api";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CreditCard, Receipt, X, Calendar, Euro } from "lucide-react";
import type { PurchasedGiftCard } from "@/lib/types";

interface GiftCardDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftCard: PurchasedGiftCard;
}

export default function GiftCardDetailsModal({
  isOpen,
  onClose,
  giftCard
}: GiftCardDetailsModalProps) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['gift-card-transactions', giftCard.id],
    queryFn: () => fetchGiftCardTransactions(giftCard.id),
    enabled: isOpen
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (card: PurchasedGiftCard) => {
    if (card.status !== 'active') return card.status;
    if (card.remaining_value === 0) return 'estinta';
    if (new Date(card.expiry_date) <= new Date()) return 'scaduta';
    return 'attiva';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-xl">
              <CreditCard className="w-6 h-6 mr-2" />
              Dettagli Gift Card
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Gift Card Summary */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">{giftCard.shop?.name || 'Negozio'}</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Acquistata il {format(new Date(giftCard.purchase_date), 'dd MMMM yyyy', { locale: it })}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Codice: {giftCard.gift_card_code}
                  </div>
                  <Badge className={getStatusColor(getStatusText(giftCard))}>
                    {getStatusText(giftCard).charAt(0).toUpperCase() + getStatusText(giftCard).slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Valore iniziale:</span>
                  <span className="font-semibold text-lg">€{giftCard.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Valore rimanente:</span>
                  <span className="font-semibold text-lg text-primary">€{giftCard.remaining_value}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Scade il:</span>
                  <span className={`font-semibold ${new Date(giftCard.expiry_date) <= new Date() ? 'text-red-600' : ''}`}>
                    {format(new Date(giftCard.expiry_date), 'dd MMMM yyyy', { locale: it })}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all" 
                      style={{ width: `${(giftCard.remaining_value / giftCard.amount) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>€0</span>
                    <span>€{giftCard.amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {giftCard.message && (
              <div className="mt-4 p-3 bg-background/50 rounded text-sm">
                <strong>Messaggio:</strong> {giftCard.message}
              </div>
            )}

            {(giftCard.recipient_name || giftCard.recipient_email) && (
              <div className="mt-4 p-3 bg-background/50 rounded text-sm">
                <strong>Destinatario:</strong> {giftCard.recipient_name} 
                {giftCard.recipient_email && ` (${giftCard.recipient_email})`}
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Storico Transazioni ({transactions.length})
            </h3>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Caricamento transazioni...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-lg">
                <Receipt className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nessuna transazione effettuata con questa gift card
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Negozio</TableHead>
                      <TableHead>Descrizione</TableHead>
                      <TableHead className="text-right">Importo Utilizzato</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.transaction_date), 'dd/MM/yyyy HH:mm', { locale: it })}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {transaction.shop?.image && (
                              <img 
                                src={transaction.shop.image} 
                                alt={transaction.shop.name}
                                className="w-8 h-8 rounded object-cover mr-2"
                              />
                            )}
                            {transaction.shop?.name || 'Negozio'}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {transaction.description || 'Utilizzo gift card'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <Euro className="w-4 h-4 mr-1 text-red-600" />
                            <span className="font-semibold text-red-600">
                              -{transaction.amount_used}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}