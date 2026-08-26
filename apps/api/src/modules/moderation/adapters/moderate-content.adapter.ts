import { Injectable } from '@nestjs/common';

import { ModerationService } from '../moderation.service';
import {
  ModerateContentInput,
  ModerateContentPort,
  ModerateContentResult,
} from '../ports/moderate-content.port';

@Injectable()
export class ModerateContentAdapter implements ModerateContentPort {
  constructor(private readonly moderationService: ModerationService) {}

  execute(input: ModerateContentInput): Promise<ModerateContentResult> {
    return this.moderationService.moderate(input);
  }
}
