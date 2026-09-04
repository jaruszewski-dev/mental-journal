export interface ResolvePasswordChangeInput {
  currentPassword: string;
  newPassword: string;
  currentPasswordHash: string;
}

export interface ResolvePasswordChangeResult {
  passwordHash: string;
}

export interface ResolvePasswordChangePort {
  execute(
    input: ResolvePasswordChangeInput,
  ): Promise<ResolvePasswordChangeResult>;
}

export const RESOLVE_PASSWORD_CHANGE_PORT = Symbol(
  'RESOLVE_PASSWORD_CHANGE_PORT',
);
