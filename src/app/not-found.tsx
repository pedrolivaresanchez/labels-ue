import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        <Image
          src="/icons/VinoVeo Logo.png"
          alt="VinoVeo Logo"
          width={150}
          height={60}
          priority
          className="h-12 w-auto mx-auto"
        />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-xl text-muted-foreground">
            Página no encontrada
          </h2>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <Button asChild>
          <Link href="/">
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  )
} 