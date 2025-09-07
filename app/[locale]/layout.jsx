import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import ClientLayout from "@/components/ClientLayout";
import "../../styles/index.css";

export default async function LocaleLayout({ children, params }) {
  const locale = params?.locale || "en";
  let messages = {};

  try {
    messages.common = (await import(`../../messages/${locale}/common.json`)).default;
  } catch (err) {
    console.error("Failed to load common messages for", locale, err);
  }

  // add more namespaces later if needed:
  // messages.footer = (await import(`../../messages/${locale}/footer.json`)).default;

  const store = await cookies();
  const initialTheme = store.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ClientLayout initialTheme={initialTheme}>{children}</ClientLayout>
    </NextIntlClientProvider>
  );
}
