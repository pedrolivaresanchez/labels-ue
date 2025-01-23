'use client';

import { usePathname } from "next/navigation";
import LayoutContent from "./layout-content";
import { PublicFooter } from "./public-footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublicRoute = pathname?.startsWith('/public') || pathname?.startsWith('/legal');

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
        <PublicFooter />
      </div>
    );
  }

  return <LayoutContent>{children}</LayoutContent>;
} 