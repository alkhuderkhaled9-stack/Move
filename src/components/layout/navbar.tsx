"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Film } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { SearchDropdown } from "@/components/shared/SearchDropdown";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("nav");

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
          <div className="hidden sm:flex items-center gap-2">
            <SearchDropdown />
          </div>

          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
