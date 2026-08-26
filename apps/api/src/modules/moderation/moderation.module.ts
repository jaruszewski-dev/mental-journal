import { Module } from '@nestjs/common';

import { ModerateContentAdapter } from './adapters/moderate-content.adapter';
import { ModerationService } from './moderation.service';
import { MODERATE_CONTENT_PORT } from './ports/moderate-content.port';
import { ModerationProcessor } from './processors/moderation.processor';

@Module({
  providers: [
    ModerationService,
    ModerationProcessor,
    {
      provide: MODERATE_CONTENT_PORT,
      useClass: ModerateContentAdapter,
    },
  ],
  exports: [MODERATE_CONTENT_PORT],
})
export class ModerationModule {}
