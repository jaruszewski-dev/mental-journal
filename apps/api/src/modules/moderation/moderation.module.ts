import { Module } from '@nestjs/common';

import { RealtimeModule } from '../realtime/realtime.module';
import { ModerateContentAdapter } from './adapters/moderate-content.adapter';
import { ShadowbanExpiryJob } from './jobs/shadowban-expiry.job';
import { ModerationService } from './moderation.service';
import { MODERATE_CONTENT_PORT } from './ports/moderate-content.port';
import { ModerationProcessor } from './processors/moderation.processor';

@Module({
  imports: [RealtimeModule],
  providers: [
    ModerationService,
    ModerationProcessor,
    ShadowbanExpiryJob,
    {
      provide: MODERATE_CONTENT_PORT,
      useClass: ModerateContentAdapter,
    },
  ],
  exports: [MODERATE_CONTENT_PORT],
})
export class ModerationModule {}
