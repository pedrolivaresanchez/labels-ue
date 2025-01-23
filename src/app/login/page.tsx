"use client";

import LoginForm from "@/components/login-form";
import Image from "next/image";

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
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.unsplash.com/photo-1528823872057-9c018a7a7553?q=80&w=2940&auto=format&fit=crop"
          alt="Wine cellar with bottles"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute bottom-4 right-4 text-xs text-white/50">
          Photo by Unsplash
        </div>
      </div>
    </div>
  );
}
