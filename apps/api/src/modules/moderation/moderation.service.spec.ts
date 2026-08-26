import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { OPENAI_MODERATION_MODEL } from './consts/moderation.const';
import { ModerationFailedException } from './exceptions/moderation-failed.exception';
import { ModerationService } from './moderation.service';

const createMock = jest.fn();

jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    moderations: { create: createMock },
  })),
}));

const makeModerationResult = (
  overrides: {
    flagged?: boolean;
    categories?: Record<string, boolean>;
    category_scores?: Record<string, number>;
  } = {},
) => ({
  flagged: overrides.flagged ?? false,
  categories: overrides.categories ?? {
    hate: false,
    harassment: false,
  },
  category_scores: overrides.category_scores ?? {
    hate: 0.1,
    harassment: 0.1,
  },
});

describe('ModerationService', () => {
  let moderationService: ModerationService;

  const configService = {
    getOrThrow: jest.fn((key: string) => {
      const map: Record<string, string> = {
        OPENAI_API_KEY: 'test-api-key',
      };
      return map[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModerationService,
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    moderationService = module.get(ModerationService);
  });

  describe('moderate', () => {
    it('should allow content when not flagged', async () => {
      createMock.mockResolvedValue({
        results: [makeModerationResult({ flagged: false })],
      });

      const result = await moderationService.moderate({
        content: 'I feel okay today',
        type: 'journal_entry',
      });

      expect(createMock).toHaveBeenCalledWith({
        model: OPENAI_MODERATION_MODEL,
        input: 'I feel okay today',
      });
      expect(result).toEqual({ allow: true, severity: 'low' });
    });

    it('should block flagged content with reason and high severity', async () => {
      createMock.mockResolvedValue({
        results: [
          makeModerationResult({
            flagged: true,
            categories: { hate: true, harassment: false },
            category_scores: { hate: 0.9, harassment: 0.1 },
          }),
        ],
      });

      const result = await moderationService.moderate({
        content: 'bad content',
        type: 'comment',
      });

      expect(result).toEqual({
        allow: false,
        reason: 'hate',
        severity: 'high',
      });
    });

    it('should use medium severity for mid-range scores', async () => {
      createMock.mockResolvedValue({
        results: [
          makeModerationResult({
            flagged: true,
            categories: { harassment: true },
            category_scores: { harassment: 0.6 },
          }),
        ],
      });

      const result = await moderationService.moderate({
        content: 'borderline',
        type: 'comment',
      });

      expect(result).toEqual({
        allow: false,
        reason: 'harassment',
        severity: 'medium',
      });
    });

    it('should throw when response has no results', async () => {
      createMock.mockResolvedValue({ results: [] });

      await expect(
        moderationService.moderate({
          content: 'x',
          type: 'journal_entry',
        }),
      ).rejects.toThrow(ModerationFailedException);
    });

    it('should throw ModerationFailedException when OpenAI fails', async () => {
      createMock.mockRejectedValue(new Error('network'));

      await expect(
        moderationService.moderate({
          content: 'x',
          type: 'journal_entry',
        }),
      ).rejects.toThrow(ModerationFailedException);
    });
  });
});
