'use client';

import Link from "next/link";

export function PublicNavbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className="text-xl font-bold">
          Vinoveo
        </Link>
      </div>
    </div>
  );
} 