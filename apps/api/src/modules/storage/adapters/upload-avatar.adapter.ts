import { Injectable } from '@nestjs/common';

import {
  UploadAvatarInput,
  UploadAvatarPort,
  UploadAvatarResult,
} from '../../user/ports/upload-avatar.port';
import { StorageService } from '../storage.service';

@Injectable()
export class UploadAvatarAdapter implements UploadAvatarPort {
  constructor(private readonly storageService: StorageService) {}

  execute(input: UploadAvatarInput): Promise<UploadAvatarResult> {
    return this.storageService.uploadAvatar(input);
  }
}
