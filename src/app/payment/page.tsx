"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      
      if (!stripe) throw new Error('Stripe failed to initialize');

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { sessionId, error } = await response.json();

      if (error) throw new Error(error);

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('Error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="hidden sm:flex justify-center mb-8">
            <Image
              src="/icons/VinoVeo Logo.png"
              alt="VinoVeo Logo"
              width={150}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </div>

          <div className="text-center space-y-2 mb-8">
            <Badge variant="outline" className="border-primary bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3 mr-1" />
              Oferta de lanzamiento
            </Badge>
            <h1 className="text-2xl font-semibold text-foreground">
              Desbloquea todas las funciones
            </h1>
            <p className="text-sm text-muted-foreground">
              Todo lo que necesitas para gestionar tus etiquetas QR
            </p>
          </div>

          <Card className="border shadow-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-baseline gap-2 justify-center">
                      <div className="text-2xl line-through text-muted-foreground">60€</div>
                      <div className="flex items-baseline gap-1.5">
                        <div className="text-4xl font-bold text-primary">50€</div>
                        <div className="text-sm text-muted-foreground">/año</div>
                      </div>
                    </div>
                    <Button 
                      size="lg"
                      className="text-sm px-8 w-full"
                      onClick={handleCheckout}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Procesando...' : 'Comenzar ahora'}
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span className="text-sm">Creación ilimitada de etiquetas QR</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span className="text-sm">Personalización completa de etiquetas</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span className="text-sm">Gestión de ingredientes y alérgenos</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span className="text-sm">Soporte técnico prioritario</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span className="text-sm">Almacenamiento de imágenes en la nube</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-5 w-5 mr-3 text-green-500 shrink-0" />
                    <span className="text-sm">Acceso a estadísticas de escaneo</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>
              Pago seguro con Stripe. Cancela en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 