'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from "@supabase/auth-helpers-nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Obtener la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found');
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const navLinks = user ? [
    { href: "/wines", label: "Etiquetas" },
    { href: "/wines/new", label: "Crear Etiqueta" }
  ] : [];

  // Helper function to get display name
  const getDisplayName = (user: User | null) => {
    if (!user) return '';
    return user.user_metadata?.full_name || user.email;
  };

  return (
    <header className="flex h-16 w-full items-center px-4 md:px-6 bg-white border-b">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <VisuallyHidden>
            <DialogTitle>Menú de navegación</DialogTitle>
          </VisuallyHidden>
          <div className="p-6">
            <Link href="/" className="text-xl font-bold block" onClick={() => setIsOpen(false)}>
              Vinoveo
            </Link>
          </div>
          
          <nav className="border-t flex-1">
            <div className="grid gap-1 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center py-2 text-lg hover:bg-accent hover:text-accent-foreground rounded-md px-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {user && (
            <div className="mt-auto border-t p-6">
              <div className="flex flex-col gap-4">
                <div className="text-sm font-medium text-muted-foreground">
                  {getDisplayName(user)}
                </div>
                <Link 
                  href="/account" 
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-accent-foreground"
                >
                  Ajustes de cuenta
                </Link>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  disabled={isLoading}
                  variant="ghost"
                  className="justify-start px-2 text-red-600 hover:text-red-600 hover:bg-red-50"
                >
                  {isLoading ? 'Procesando...' : 'Cerrar Sesión'}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Link 
        href="/" 
        className="text-xl font-bold tracking-wider ml-4 lg:ml-0"
      >
        Vinoveo
      </Link>

      <nav className="ml-auto hidden lg:flex items-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
        {user && (
          <div className="pl-4 border-l border-gray-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  {getDisplayName(user)}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuItem disabled>
                  Ajustes de cuenta
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  disabled={isLoading}
                  className="text-red-600 focus:text-red-600"
                >
                  {isLoading ? 'Procesando...' : 'Cerrar Sesión'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar; 