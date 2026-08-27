import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Literata, Source_Sans_3 } from "next/font/google";

import { QueryProvider } from "@/components/providers/query-provider";
import { routing } from "@/i18n/routing";

const sourceSans = Source_Sans_3({
  variable: "--font-ui",
  subsets: ["latin", "latin-ext"],
});

const literata = Literata({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${sourceSans.variable} ${literata.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
