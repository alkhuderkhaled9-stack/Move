import { useTranslations } from "next-intl";
import { Navbar } from "@/components/layout/navbar";

export default function HomePage() {
  const t = useTranslations("nav");

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Movies Discovery Platform
        </h1>
        <p className="text-muted-foreground">
          {t("home")} - Ready to explore movies!
        </p>
      </main>
    </>
  );
}
