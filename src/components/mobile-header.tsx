
"use client";

import Link from "next/link";
import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function MobileHeader() {
    const { toggleSidebar } = useSidebar();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <header className="sticky top-0 z-10 flex h-[45px] items-center justify-between border-b bg-background px-4">
                <div className="h-8 w-8" />
                <div className="h-6 w-20" />
            </header>
        );
    }


    return (
        <header className="sticky top-0 z-10 flex h-[45px] items-center justify-between border-b bg-background px-4">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-transparent"
                onClick={toggleSidebar}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                >
                    <line x1="3" y1="8" x2="21" y2="8"></line>
                    <line x1="3" y1="16" x2="15" y2="16"></line>
                </svg>
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
            <Link href="/">
                <h1 className="text-lg font-bold text-foreground">GreyCost</h1>
            </Link>
        </header>
    );
}
