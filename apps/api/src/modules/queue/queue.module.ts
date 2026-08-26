import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MODERATION_QUEUE } from './consts/queue.const';

const bullRootFactory = (configService: ConfigService) => {
  const redisUrl = new URL(configService.getOrThrow<string>('REDIS_URL'));

  return {
    connection: {
      host: redisUrl.hostname,
      port: Number(redisUrl.port || 6379),
      maxRetriesPerRequest: null,
    },
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: 'exponential' as const,
        delay: 1_000,
      },
      removeOnComplete: {
        age: 3_600,
        count: 1_000,
      },
      removeOnFail: {
        age: 86_400,
      },
    },
  };
};

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: bullRootFactory,
    }),
    BullModule.registerQueue({
      name: MODERATION_QUEUE,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
