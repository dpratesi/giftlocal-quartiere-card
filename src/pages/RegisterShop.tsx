import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Store, Mail, Phone, MapPin, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingButton } from "@/components/LoadingButton";
import { toast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import Header from "@/components/Header";
import { createShop } from "@/lib/merchantApi";
import { useAuth } from "@/contexts/AuthContext";

// Validation schema
const shopSchema = z.object({
  shopName: z.string().min(2, "Il nome deve contenere almeno 2 caratteri").max(50, "Massimo 50 caratteri"),
  category: z.string().min(1, "Seleziona una categoria"),
  description: z.string().min(20, "La descrizione deve contenere almeno 20 caratteri").max(500, "Massimo 500 caratteri"),
  email: z.string().email("Inserisci un email valida"),
  phone: z.string().regex(/^(\+39\s?)?[0-9\s]{10,}$/, "Inserisci un numero di telefono valido"),
  address: z.string().min(10, "Inserisci un indirizzo completo"),
  neighborhood: z.string().min(2, "Inserisci il quartiere"),
  city: z.string().min(2, "Inserisci la città").default("Roma"),
  postalCode: z.string().regex(/^[0-9]{5}$/, "Il CAP deve contenere 5 cifre"),
  vat: z.string().optional(),
  iban: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "Devi accettare i termini di servizio"),
  acceptMarketing: z.boolean().optional(),
});

type ShopFormData = z.infer<typeof shopSchema>;

const RegisterShop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const form = useForm<ShopFormData>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      shopName: '',
      category: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      neighborhood: '',
      city: '',
      postalCode: '',
      vat: '',
      iban: '',
      acceptTerms: false,
      acceptMarketing: false,
    },
  });

  const onSubmit = async (data: ShopFormData) => {
    try {
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per registrare un negozio.",
          variant: "destructive",
        });
        navigate('/merchant/login');
        return;
      }

      await createShop({
        name: data.shopName,
        category: data.category,
        description: data.description,
        email: data.email,
        phone: data.phone,
        address: data.address,
        neighborhood: data.neighborhood,
        city: data.city,
        postalCode: data.postalCode,
        vat: data.vat,
        iban: data.iban,
        ownerId: user.id,
      });
      
      toast({
        title: "Negozio registrato!",
        description: "Il tuo negozio è stato registrato con successo e è ora attivo.",
      });
      
      navigate('/merchant/shops');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Errore di registrazione",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    }
  };
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="shopName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome del negozio *</FormLabel>
                          <FormControl>
                            <Input placeholder="es. Caffè del Borgo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bar-caffe">Bar & Caffè</SelectItem>
                              <SelectItem value="ristoranti">Ristoranti</SelectItem>
                              <SelectItem value="librerie">Librerie</SelectItem>
                              <SelectItem value="bellezza">Bellezza</SelectItem>
                              <SelectItem value="abbigliamento">Abbigliamento</SelectItem>
                              <SelectItem value="alimentari">Alimentari</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrizione *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrivi il tuo negozio, i tuoi prodotti e cosa rende speciale la tua attività..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <Input 
                                type="email" 
                                placeholder="negozio@esempio.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefono *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                              <Input 
                                type="tel" 
                                placeholder="+39 123 456 7890"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indirizzo completo *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input 
                              placeholder="Via Roma 123, 00100 Roma RM"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quartiere *</FormLabel>
                          <FormControl>
                            <Input placeholder="es. Centro Storico" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Città *</FormLabel>
                          <FormControl>
                            <Input placeholder="es. Roma" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CAP *</FormLabel>
                          <FormControl>
                            <Input placeholder="00100" maxLength={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                      <FormField
                        control={form.control}
                        name="vat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Partita IVA</FormLabel>
                            <FormControl>
                              <Input placeholder="IT12345678901" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="iban"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>IBAN per i pagamenti</FormLabel>
                            <FormControl>
                              <Input placeholder="IT60 X054 2811 1010 0000 0123 456" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <span className="text-sm text-muted-foreground">
                              Accetto i <a href="#" className="text-primary hover:underline">Termini di Servizio</a> e 
                              la <a href="#" className="text-primary hover:underline">Privacy Policy</a> di GiftLocal *
                            </span>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="acceptMarketing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <span className="text-sm text-muted-foreground">
                              Voglio ricevere aggiornamenti e consigli via email per far crescere il mio business
                            </span>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <LoadingButton 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    loading={form.formState.isSubmitting}
                    loadingText="Registrazione in corso..."
                  >
                    Registra il negozio
                  </LoadingButton>
                
                  <p className="text-xs text-muted-foreground text-center">
                    Il tuo negozio sarà immediatamente attivo e disponibile per le vendite.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterShop;