import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const PUBLIC_PATHS = ["/login", "/register", "/verify-email"] as const;
const AUTH_COOKIE = "access_token";

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) {
      return "/";
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
  }
  return pathname;
}

function resolveLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return locale;
    }
  }
  return routing.defaultLocale;
}

function localizedPath(locale: string, path: string): string {
  if (locale === routing.defaultLocale) {
    return path;
  }
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

function isPublicPath(pathnameWithoutLocale: string): boolean {
  return PUBLIC_PATHS.some(
    (path) =>
      pathnameWithoutLocale === path ||
      pathnameWithoutLocale.startsWith(`${path}/`),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameWithoutLocale = stripLocalePrefix(pathname);
  const locale = resolveLocale(pathname);
  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (!hasSession && !isPublicPath(pathnameWithoutLocale)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = localizedPath(locale, "/login");
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  if (
    hasSession &&
    (pathnameWithoutLocale === "/login" ||
      pathnameWithoutLocale === "/register")
  ) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = localizedPath(locale, "/");
    homeUrl.search = "";
    return NextResponse.redirect(homeUrl);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|v1|trpc|_next|_vercel|.*\\..*).*)"],
};
