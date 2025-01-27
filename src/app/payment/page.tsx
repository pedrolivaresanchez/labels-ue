"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Plan Premium</h1>
          <p className="text-muted-foreground">
            Accede a todas las funcionalidades de VinoVeo
          </p>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-primary mr-2" />
            <span>Etiquetas ilimitadas</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-primary mr-2" />
            <span>Códigos QR personalizados</span>
          </div>
          <div className="flex items-center">
            <Check className="h-5 w-5 text-primary mr-2" />
            <span>Soporte prioritario</span>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-center mb-4">
            <span className="text-3xl font-bold">9,99€</span>
            <Badge variant="secondary" className="ml-2">por mes</Badge>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Procesando</span>
                <Image
                  src="/spinner.gif"
                  alt="Loading"
                  width={20}
                  height={20}
                />
              </>
            ) : (
              'Suscribirse ahora'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}