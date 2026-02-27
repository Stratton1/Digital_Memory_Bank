"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  Share2,
  Users,
  X,
} from "lucide-react";

interface NavbarProps {
  user: {
    email: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/memories", label: "Memories", icon: BookOpen },
  { href: "/dashboard/prompts", label: "Prompts", icon: MessageCircle },
  { href: "/dashboard/vault", label: "Vault", icon: Share2 },
  { href: "/dashboard/family", label: "Family", icon: Users },
  { href: "/dashboard/search", label: "Search", icon: Search },
];

export function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="font-serif text-xl font-bold text-foreground"
          >
            Memory Bank
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={`gap-2 ${active ? "font-semibold" : ""}`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user.avatarUrl ?? undefined}
                    alt={user.fullName}
                  />
                  <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="cursor-pointer gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer gap-2 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="border-t border-border/50 bg-card px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${active ? "font-semibold" : ""}`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
