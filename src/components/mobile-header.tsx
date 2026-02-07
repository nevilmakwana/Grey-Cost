"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function MobileHeader() {
  const { toggleSidebar } = useSidebar();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <header className="sticky top-0 z-10 flex h-[45px] items-center justify-between border-b bg-background px-4">
        <div className="h-6 w-6" />
        <div className="h-5 w-16" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 flex h-[45px] items-center justify-between border-b bg-background px-4">
      
      {/* ☰ LEFT MENU */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="h-8 w-8 rounded-full"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="8" x2="21" y2="8" />
          <line x1="3" y1="16" x2="15" y2="16" />
        </svg>
      </Button>

      {/* ✅ RIGHT LOGO (EXACT GreyCost TEXT SIZE & POSITION) */}
      <Link href="/" className="flex items-center">
        <Image
          src={
            resolvedTheme === "dark"
              ? "/GreyCost_Logo_White.png"
              : "/GreyCost_Logo_Black.png"
          }
          alt="GreyCost"
          width={78}     // 👈 matches text-lg width
          height={18}    // 👈 matches h1 text height
          priority
          className="object-contain"
        />
      </Link>
    </header>
  );
}
