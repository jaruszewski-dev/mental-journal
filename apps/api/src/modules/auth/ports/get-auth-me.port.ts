export interface GetAuthMeResult {
  userId: string;
  anonName: string;
  avatarUrl: string | null;
}

export interface GetAuthMePort {
  execute(userId: string): Promise<GetAuthMeResult | null>;
}

export const GET_AUTH_ME_PORT = Symbol('GET_AUTH_ME_PORT');
