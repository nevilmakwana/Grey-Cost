
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { Calculator, FileText, Moon, Sun, Scissors, Gift, Layers, Truck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useEffect, useState } from 'react';

export function AppSidebar() {
  const pathname = usePathname();
  const { setTheme } = useTheme();
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
        <div className="flex-1 overflow-y-auto p-2 pt-12">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Cost Calculator" isActive={pathname === '/'}>
                <Link href="/" onClick={handleLinkClick}>
                  <Calculator />
                  <span>Cost Calculator</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Fabric Consumption" isActive={pathname === '/fabric-consumption'}>
                <Link href="/fabric-consumption" onClick={handleLinkClick}>
                  <Layers />
                  <span>Fabric Consumption</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sewing Threads" isActive={pathname === '/sewing-threads'}>
                <Link href="/sewing-threads" onClick={handleLinkClick}>
                  <Scissors />
                  <span>Sewing Threads</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Shrinkage Report" isActive={pathname === '/shrinkage-report'}>
                <Link href="/shrinkage-report" onClick={handleLinkClick}>
                  <FileText />
                  <span>Shrinkage Report</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Combo Offer" isActive={pathname === '/combo-offer'}>
                <Link href="/combo-offer" onClick={handleLinkClick}>
                  <Gift />
                  <span>Combo Offer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Fabric Logistics" isActive={pathname === '/fabric-logistics'}>
                <Link href="/fabric-logistics" onClick={handleLinkClick}>
                  <Truck />
                  <span>Fabric Logistics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <div className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="ml-2">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </Sidebar>
  );
}
