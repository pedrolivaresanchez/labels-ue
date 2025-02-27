"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const stripe = await stripePromise;
      
      if (!stripe) throw new Error('Stripe failed to initialize');

      const response = await fetch('/api/create-checkout', {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating checkout session');
      }

      const { sessionId } = await response.json();

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-2xl font-semibold">Plan Premium</h1>
          <p className="text-muted-foreground">
            Gestiona tus etiquetas de vino de forma profesional
          </p>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl font-bold">50€</span>
            <Badge variant="secondary" className="ml-2">/año</Badge>
          </div>
          <p className="text-center text-sm text-muted-foreground mb-6">
            Menos de 5€ al mes - Facturación anual
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 mt-0.5" />
            <div>
              <span className="font-medium">Etiquetas ilimitadas</span>
              <p className="text-sm text-muted-foreground">Crea y gestiona todas las etiquetas que necesites</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 mt-0.5" />
            <div>
              <span className="font-medium">Códigos QR personalizados</span>
              <p className="text-sm text-muted-foreground">Genera códigos QR únicos para cada producto</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 mt-0.5" />
            <div>
              <span className="font-medium">Actualizaciones en tiempo real</span>
              <p className="text-sm text-muted-foreground">Modifica la información cuando lo necesites</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 mt-0.5" />
            <div>
              <span className="font-medium">Cumplimiento normativo</span>
              <p className="text-sm text-muted-foreground">Etiquetas conformes con la normativa UE</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 mt-0.5" />
            <div>
              <span className="font-medium">Soporte prioritario</span>
              <p className="text-sm text-muted-foreground">Asistencia personalizada cuando la necesites</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 mt-0.5" />
            <div>
              <span className="font-medium">Sin compromiso</span>
              <p className="text-sm text-muted-foreground">Cancela en cualquier momento</p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCheckout}
          className="w-full h-12 text-lg mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Procesando
            </>
          ) : (
            'Comenzar ahora'
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Pago seguro con Stripe.
        </p>
      </Card>
    </div>
  );
}