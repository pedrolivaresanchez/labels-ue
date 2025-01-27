'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Wait a bit to allow webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if subscription exists
        const response = await fetch('/api/check-subscription');
        const data = await response.json();
        
        if (data.hasSubscription) {
          router.push('/wines');
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    if (sessionId) {
      checkSession();
    } else {
      router.push('/payment');
    }
  }, [sessionId, router]);

  return (
    <Card className="w-full max-w-md p-8 space-y-6">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-2xl font-semibold">¡Pago completado!</h1>
        <p className="text-muted-foreground">
          Gracias por tu suscripción. Estamos procesando tu pago...
        </p>
      </div>
    </Card>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 animate-pulse" />
            <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-64 bg-gray-100 animate-pulse rounded" />
          </div>
        </Card>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}