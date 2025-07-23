import { Link } from "react-router-dom";
import { ArrowLeft, Store, Mail, Phone, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";

const RegisterShop = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Home
            </Button>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Registra il tuo negozio
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Unisciti a GiftLocal e inizia a vendere le tue gift card online. 
              È semplice, veloce e gratuito.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="w-5 h-5 mr-2 text-primary" />
                Informazioni del negozio
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form className="space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Nome del negozio *</Label>
                    <Input 
                      id="shopName"
                      placeholder="es. Caffè del Borgo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar-caffe">Bar & Caffè</SelectItem>
                        <SelectItem value="ristoranti">Ristoranti</SelectItem>
                        <SelectItem value="librerie">Librerie</SelectItem>
                        <SelectItem value="bellezza">Bellezza</SelectItem>
                        <SelectItem value="abbigliamento">Abbigliamento</SelectItem>
                        <SelectItem value="alimentari">Alimentari</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione *</Label>
                  <Textarea 
                    id="description"
                    placeholder="Descrivi il tuo negozio, i tuoi prodotti e cosa rende speciale la tua attività..."
                    rows={4}
                    required
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="negozio@esempio.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefono *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input 
                        id="phone"
                        type="tel" 
                        placeholder="+39 123 456 7890"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo completo *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      id="address"
                      placeholder="Via Roma 123, 00100 Roma RM"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Quartiere *</Label>
                    <Input 
                      id="neighborhood"
                      placeholder="es. Centro Storico"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">CAP *</Label>
                    <Input 
                      id="postalCode"
                      placeholder="00100"
                      maxLength={5}
                      required
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo del negozio</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Clicca per caricare il logo o trascina qui
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG fino a 2MB
                    </p>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>

                {/* Business Info */}
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Informazioni legali</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vat">Partita IVA *</Label>
                      <Input 
                        id="vat"
                        placeholder="IT12345678901"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="iban">IBAN per i pagamenti *</Label>
                      <Input 
                        id="iban"
                        placeholder="IT60 X054 2811 1010 0000 0123 456"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 mt-1" required />
                    <span className="text-sm text-muted-foreground">
                      Accetto i <a href="#" className="text-primary hover:underline">Termini di Servizio</a> e 
                      la <a href="#" className="text-primary hover:underline">Privacy Policy</a> di GiftLocal *
                    </span>
                  </label>
                  
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 mt-1" />
                    <span className="text-sm text-muted-foreground">
                      Voglio ricevere aggiornamenti e consigli via email per far crescere il mio business
                    </span>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" size="lg">
                  Registra il negozio
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  La tua richiesta verrà verificata dal nostro team entro 24-48 ore. 
                  Ti contatteremo via email per confermare l'attivazione.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterShop;