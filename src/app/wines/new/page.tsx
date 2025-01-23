'use client';

import { WineForm } from "@/components/WineForm"

export default function NewWinePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Nueva Etiqueta</h1>
      </div>
      
      <WineForm />
    </div>
  )
}
