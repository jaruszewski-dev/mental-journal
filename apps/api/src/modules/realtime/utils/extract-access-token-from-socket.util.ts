import type { Socket } from 'socket.io';

const ACCESS_TOKEN_COOKIE = 'access_token';

function getCookieValue(
  cookieHeader: string | undefined,
  name: string,
): string | null {
  if (!cookieHeader) return null;

  for (const part of cookieHeader.split(';')) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = part.slice(0, separatorIndex).trim();
    if (key !== name) continue;

    return decodeURIComponent(part.slice(separatorIndex + 1).trim());
  }

  return null;
}

export function extractAccessTokenFromSocket(client: Socket): string | null {
  const fromAuth = client.handshake.auth?.token;
  if (typeof fromAuth === 'string' && fromAuth.length > 0) {
    return fromAuth;
  }

  return getCookieValue(client.handshake.headers.cookie, ACCESS_TOKEN_COOKIE);
}
