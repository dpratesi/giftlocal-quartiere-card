import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Store, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";

const LoginSelect = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alla Home
            </Link>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Scegli il tipo di accesso
            </h1>
            <p className="text-muted-foreground">
              Seleziona come vuoi accedere a GiftLocal
            </p>
          </div>

          <div className="grid gap-4">
            <Link to="/login" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Cliente</CardTitle>
                  <CardDescription>
                    Accedi per acquistare gift card e scoprire i negozi del tuo quartiere
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="lg">
                    Accedi come Cliente
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link to="/merchant/login" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-2 hover:border-primary/50">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Merchant</CardTitle>
                  <CardDescription>
                    Gestisci il tuo negozio, le gift card e monitora le vendite
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full" size="lg">
                    Accedi come Merchant
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelect;