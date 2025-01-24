'use client';

import { WineForm } from "@/components/WineForm"

export default function NewWinePage() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Nueva Etiqueta</h1>
      </div>
      
      <WineForm />
    </div>
  )
}
