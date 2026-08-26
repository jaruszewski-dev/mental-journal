import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import {
  HIGH_SEVERITY_SCORE,
  MEDIUM_SEVERITY_SCORE,
  OPENAI_MODERATION_MODEL,
} from './consts/moderation.const';
import { ModerationFailedException } from './exceptions/moderation-failed.exception';
import {
  ModerateContentInput,
  ModerateContentResult,
  ModerationSeverity,
} from './ports/moderate-content.port';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.getOrThrow<string>('OPENAI_API_KEY'),
    });
  }

  async moderate(input: ModerateContentInput): Promise<ModerateContentResult> {
    try {
      const response = await this.openai.moderations.create({
        model: OPENAI_MODERATION_MODEL,
        input: input.content,
      });

      const result = response.results[0];

      if (!result) {
        this.logger.error('Moderation response contained no results');
        throw new ModerationFailedException();
      }

      if (!result.flagged) {
        return { allow: true, severity: 'low' };
      }

      const flaggedCategories = Object.entries(result.categories)
        .filter(([, flagged]) => flagged)
        .map(([category]) => category);

      const maxScore = Math.max(...Object.values(result.category_scores), 0);

      return {
        allow: false,
        reason: flaggedCategories.length
          ? flaggedCategories.join(', ')
          : 'flagged',
        severity: this.toSeverity(maxScore),
      };
    } catch (error) {
      if (error instanceof ModerationFailedException) throw error;
      this.logger.error('OpenAI moderation request failed', error);
      throw new ModerationFailedException();
    }
  }

  private toSeverity(maxScore: number): ModerationSeverity {
    if (maxScore >= HIGH_SEVERITY_SCORE) return 'high';
    if (maxScore >= MEDIUM_SEVERITY_SCORE) return 'medium';
    return 'medium';
  }
}
