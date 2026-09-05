import { setRequestLocale } from "next-intl/server";

import { AccountView } from "@/features/account/components/account-view";

type AccountPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AccountPage({ params }: AccountPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col pb-16 md:pb-0">
      <AccountView />
    </main>
  );
}
