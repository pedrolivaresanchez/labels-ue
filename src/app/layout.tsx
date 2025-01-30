import "./globals.css";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VinoVeo - Etiquetado de vinos conforme a la UE",
  description: "Crea y gestiona etiquetas de vino conformes con la normativa de la UE",
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
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
