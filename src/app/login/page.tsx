"use client";

import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center md:justify-start">
          <Image
            src="/icons/VinoVeo Logo.png"
            alt="VinoVeo Logo"
            width={120}
            height={48}
            priority
            className="h-8 w-auto"
          />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Bienvenido</h1>
                <p className="text-sm text-muted-foreground">Inicia sesión para gestionar tus etiquetas</p>
              </div>
              
              <Button onClick={handleSignIn} className="w-full">
                Continuar con Google
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1528823872057-9c018a7a7553?q=80&w=2940&auto=format&fit=crop"
          alt="Wine cellar with bottles"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute bottom-4 right-4 text-xs text-white/50">
          Photo by Unsplash
        </div>
      </div>
    </div>
  );
}
