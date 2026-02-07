"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import Link from "next/link";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Calculator,
  FileText,
  Moon,
  Sun,
  Scissors,
  Gift,
  Layers,
  Truck,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
 const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar, isMobile } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Sidebar>
      <div className="flex flex-col h-full">

        {/* 🔴 TOP BAR WITH CANCEL BUTTON (MOBILE ONLY) */}
        {isMobile && (
        <div className="fixed top-0 left-0 z-50 flex w-[280px] items-center justify-start h-[45px] px-4 border-b border-white/10 bg-background">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-white/10 transition"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
      )}

        {/* MENU */}
<div className="flex-1 overflow-y-auto px-2 pt-6">

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Cost Calculator" isActive={pathname === "/"}>
                <Link href="/" onClick={handleLinkClick}>
                  <Calculator />
                  <span>Cost Calculator</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Fabric Consumption" isActive={pathname === "/fabric-consumption"}>
                <Link href="/fabric-consumption" onClick={handleLinkClick}>
                  <Layers />
                  <span>Fabric Consumption</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sewing Threads" isActive={pathname === "/sewing-threads"}>
                <Link href="/sewing-threads" onClick={handleLinkClick}>
                  <Scissors />
                  <span>Sewing Threads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Shrinkage Report" isActive={pathname === "/shrinkage-report"}>
                <Link href="/shrinkage-report" onClick={handleLinkClick}>
                  <FileText />
                  <span>Shrinkage Report</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Combo Offer" isActive={pathname === "/combo-offer"}>
                <Link href="/combo-offer" onClick={handleLinkClick}>
                  <Gift />
                  <span>Combo Offer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Fabric Logistics" isActive={pathname === "/fabric-logistics"}>
                <Link href="/fabric-logistics" onClick={handleLinkClick}>
                  <Truck />
                  <span>Fabric Logistics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

       {/* THEME SWITCHER – iOS STYLE */}
    {/* THEME SWITCHER (iOS-style haptic) */}
      <div className="border-t border-white/10 p-3 sticky bottom-0 bg-background">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="
            group flex items-center gap-3
            w-full rounded-xl px-3 py-2
            transition-all duration-200
            active:scale-[0.92]
            hover:bg-white/5
          "
        >
          {/* ICON */}
          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full bg-white/10
              transition-transform duration-200
              group-active:scale-90
            "
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5 text-white" />
            ) : (
              <Sun className="h-5 w-5 text-white" />
            )}
          </div>

          {/* TEXT */}
          <span className="text-sm font-medium">
            {theme === "dark" ? "Dark mode" : "Light mode"}
          </span>
        </button>
      </div>
      </div>
    </Sidebar>
  );
}
