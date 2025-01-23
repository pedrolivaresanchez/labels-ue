'use client';

import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoginPage && <NavBar />}
      <main className={!isLoginPage ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        {children}
      </main>
    </div>
  );
} 