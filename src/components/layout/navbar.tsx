"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Film, Menu, Home, Clapperboard, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { SearchDropdown } from "@/components/shared/SearchDropdown";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <Film className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              MovieHub
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href={`/${locale}`}>
              <Button variant="ghost">{t("home")}</Button>
            </Link>
            <Link href={`/${locale}/movies`}>
              <Button variant="ghost">{t("movies")}</Button>
            </Link>
            <Link href={`/${locale}/favorites`}>
              <Button variant="ghost">{t("favorites")}</Button>
            </Link>
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          <div className="hidden sm:flex items-center gap-2">
            <SearchDropdown />
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-primary" />
                  MovieHub
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-4">
                {/* Mobile Search */}
                <div className="sm:hidden">
                  <SearchDropdown />
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  <Link
                    href={`/${locale}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <Home className="h-5 w-5" />
                    {t("home")}
                  </Link>
                  <Link
                    href={`/${locale}/movies`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <Clapperboard className="h-5 w-5" />
                    {t("movies")}
                  </Link>
                  <Link
                    href={`/${locale}/favorites`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <Heart className="h-5 w-5" />
                    {t("favorites")}
                  </Link>
                </nav>

                {/* Settings */}
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium">Language</span>
                    <LanguageToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
