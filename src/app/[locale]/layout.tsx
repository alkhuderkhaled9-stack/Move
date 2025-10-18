import { Inter } from "next/font/google";
import { Cairo } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await the params to access locale
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  // Determine the text direction based on locale
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Select the appropriate font based on locale
  const fontClass = locale === "ar" ? cairo.variable : inter.variable;

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${fontClass} font-sans antialiased`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="min-h-screen">{children}</main>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
