import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bienvenido al Gestor de Vinos</h1>
        <p className="mb-4">Administra tus vinos fácilmente con nuestra herramienta.</p>
        <div className="space-x-4">
          <Link href="/wines">
            <Button>Ver mis vinos</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Iniciar sesión</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
