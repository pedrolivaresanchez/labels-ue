'use client';

import { WineForm } from "@/components/WineForm"
import { Card, CardContent } from "@/components/ui/card";

export default function NewWinePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Nueva Etiqueta</h1>
            <p className="text-sm text-muted-foreground">Crea una nueva etiqueta con información nutricional, ingredientes y datos del operador.</p>
          </div>
        </CardContent>
      </Card>
      
      <WineForm />
    </div>
  )
}
