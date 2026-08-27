import { getTranslations } from "next-intl/server";

import { LoginPanel } from "@/features/auth/login/components/login-panel";
import { AuthVideo } from "@/features/auth/shared/auth-video";
import { LocaleSwitcher } from "@/features/auth/shared/locale-switcher";

export async function LoginView() {
  const t = await getTranslations("auth.login");

  return (
    <>
      <section className="flex flex-1 items-center justify-center p-6 md:w-1/2 md:p-10 lg:p-14">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card/95 p-6 shadow-sm backdrop-blur-sm md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="font-heading text-3xl font-medium tracking-tight">
                {t("title")}
              </p>
              <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
            </div>
            <LocaleSwitcher />
          </div>

          <LoginPanel />
        </div>
      </section>

      <aside className="hidden md:flex md:w-1/2 md:items-stretch md:p-8 lg:p-10">
        <div
          className="relative min-h-[32rem] w-full overflow-hidden rounded-2xl border border-border bg-cover bg-center"
          style={{
            backgroundImage: "url(/auth/mental-journal-auth-poster.webp)",
          }}
        >
          <AuthVideo className="motion-reduce:hidden" />
        </div>
      </aside>
    </>
  );
}
