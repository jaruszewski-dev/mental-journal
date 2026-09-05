import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import {
  AVATAR_ALLOWED_MIME_TYPES,
  AVATAR_KEY_PREFIX,
  AVATAR_MAX_BYTES,
  AVATAR_MIME_TO_EXTENSION,
  type AvatarMimeType,
} from './consts/avatar.const';
import {
  R2_S3_CLIENT,
  R2_STORAGE_CONFIG,
  type R2StorageConfig,
} from './consts/r2.const';
import { AvatarTooLargeException } from './exceptions/avatar-too-large.exception';
import { InvalidAvatarException } from './exceptions/invalid-avatar.exception';

export type UploadAvatarInput = {
  userId: string;
  buffer: Buffer;
  mimeType: string;
};

export type UploadAvatarResult = {
  key: string;
  url: string;
};

@Injectable()
export class StorageService {
  constructor(
    @Inject(R2_S3_CLIENT)
    private readonly s3: S3Client,
    @Inject(R2_STORAGE_CONFIG)
    private readonly config: R2StorageConfig,
  ) {}

  async uploadAvatar(input: UploadAvatarInput): Promise<UploadAvatarResult> {
    this.assertAvatarValid(input);

    const extension =
      AVATAR_MIME_TO_EXTENSION[input.mimeType as AvatarMimeType];
    const key = `${AVATAR_KEY_PREFIX}/${input.userId}/${randomUUID()}.${extension}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: input.buffer,
        ContentType: input.mimeType,
        ContentLength: input.buffer.byteLength,
      }),
    );

    return {
      key,
      url: `${this.config.publicUrl}/${key}`,
    };
  }

  private assertAvatarValid(input: UploadAvatarInput): void {
    if (!input.buffer?.byteLength) {
      throw new InvalidAvatarException('avatar file is empty');
    }

    if (input.buffer.byteLength > AVATAR_MAX_BYTES) {
      throw new AvatarTooLargeException();
    }

    if (
      !AVATAR_ALLOWED_MIME_TYPES.includes(input.mimeType as AvatarMimeType)
    ) {
      throw new InvalidAvatarException(
        'avatar must be jpg, jpeg, png or webp',
      );
    }
  }
}
