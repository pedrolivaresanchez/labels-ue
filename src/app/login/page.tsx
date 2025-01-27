"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronLeft } from "lucide-react";

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb className="mb-4 sm:mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink href="/wines">
            <ChevronLeft className="h-4 w-4" />
            Volver a la lista
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Card className="max-w-sm mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Bienvenido</h1>
              <p className="text-sm text-muted-foreground">Inicia sesión para gestionar tus etiquetas</p>
            </div>
            
            <Button onClick={handleSignIn} className="w-full">
              Continuar con Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
