'use client';

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-semibold">Pago cancelado</h1>
          <p className="text-muted-foreground">
            El proceso de pago ha sido cancelado. Si tienes alguna pregunta, no dudes en contactarnos.
          </p>
        </div>
        <Button 
          className="w-full"
          onClick={() => router.push('/payment')}
        >
          Volver a intentar
        </Button>
      </Card>
    </div>
  );
} 