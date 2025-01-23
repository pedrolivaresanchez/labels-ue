'use client';

import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center gap-4 md:h-16 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} Vinoveo. Todos los derechos reservados.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/legal/terminos-y-condiciones" 
            className="text-sm text-muted-foreground hover:underline"
          >
            Términos y Condiciones
          </Link>
        </div>
      </div>
    </footer>
  );
} 