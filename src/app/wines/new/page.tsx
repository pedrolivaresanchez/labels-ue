'use client';

import { WineForm } from "@/components/WineForm"

export default function NewWinePage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Nueva Etiqueta</h1>
        <p className="text-sm text-muted-foreground">Crea una nueva etiqueta con información nutricional, ingredientes y datos del operador.</p>
      </div>
      
      <WineForm />
    </div>
  )
}
