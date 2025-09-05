import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import ClientLayout from "@/components/ClientLayout";
import "../../styles/index.css";

export default async function LocaleLayout({ children }) {
  const messages = await getMessages();
  const store = await cookies();
  const initialTheme = store.get("theme")?.value === "dark" ? "dark" : "light";

  return (
    <NextIntlClientProvider messages={messages}>
      <ClientLayout initialTheme={initialTheme}>{children}</ClientLayout>
    </NextIntlClientProvider>
  );
}
