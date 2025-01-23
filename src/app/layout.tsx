import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/client-layout";
import { PublicFooter } from "@/components/public-footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vinoveo",
  description: "Gestión de etiquetado de vinos",
  icons: {
    icon: [
      {
        url: "/icons/vinoveo.png",
        href: "/icons/vinoveo.png",
      }
    ],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <ClientLayout>
            <main className="flex-1">
              {children}
            </main>
          </ClientLayout>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
