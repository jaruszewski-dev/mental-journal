export interface UploadAvatarInput {
  userId: string;
  buffer: Buffer;
  mimeType: string;
}

export interface UploadAvatarResult {
  key: string;
  url: string;
}

export interface UploadAvatarPort {
  execute(input: UploadAvatarInput): Promise<UploadAvatarResult>;
}

export const UPLOAD_AVATAR_PORT = Symbol('UPLOAD_AVATAR_PORT');
