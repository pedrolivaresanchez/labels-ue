'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signInWithOtp, signInWithOAuth } from '@/lib/auth';

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithOtp(email);
      if (error) throw error;
      setMagicLinkSent(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al enviar el enlace mágico');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signInWithOAuth('google');
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleMagicLinkLogin} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Ingresa tu email para acceder a tu cuenta
        </p>
      </div>
      
      {!magicLinkSent ? (
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Enviando enlace...' : 'Enviar enlace mágico'}
          </Button>

          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              O continuar con
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Continuar con Google
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-700">
              ¡Enlace mágico enviado! Revisa tu email para continuar con el inicio de sesión.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setMagicLinkSent(false);
              setEmail('');
            }}
          >
            Usar otro email
          </Button>
        </div>
      )}
    </form>
  );
}
