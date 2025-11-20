"use client";

import LoginForm from "@/components/login-form";
import Image from "next/image";
import { Suspense } from "react";

export default function LoginPage() {
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
            <Suspense fallback={<div className="text-center">Cargando...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/images/vinoveo-bottle.webp"
          alt="Botella de vino VinoVeo"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
