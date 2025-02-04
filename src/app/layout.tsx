import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PublicFooter } from "@/components/public-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VinoVeo",
  description: "Etiquetado de vinos conforme a la normativa UE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {children}
        <PublicFooter />
      </body>
    </html>
  );
}
