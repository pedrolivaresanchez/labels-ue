'use client';

import { usePathname } from "next/navigation";
import LayoutContent from "./layout-content";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = pathname?.startsWith('/public') || pathname?.startsWith('/legal');
  const isLoginPage = pathname === '/login';

  if (isPublicRoute || isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return <LayoutContent>{children}</LayoutContent>;
} 