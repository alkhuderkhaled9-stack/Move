import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that the incoming `locale` is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = "en"; // Fallback to default locale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
