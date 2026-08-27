import type { AppLocale } from '../../../common/consts/locale.const';
import { IssueEmailVerificationResult } from '../../../common/enums/issue-email-verification-result.enum';

export interface IssueEmailVerificationInput {
  email: string;
  tokenHash: string;
  expiresAt: Date | null;
}

export type IssueEmailVerificationOutcome =
  | { result: IssueEmailVerificationResult.SKIPPED }
  | {
      result: IssueEmailVerificationResult.ISSUED;
      preferredLocale: AppLocale;
    };

export interface IssueEmailVerificationPort {
  execute(
    input: IssueEmailVerificationInput,
  ): Promise<IssueEmailVerificationOutcome>;
}

export const ISSUE_EMAIL_VERIFICATION_PORT = Symbol(
  'ISSUE_EMAIL_VERIFICATION_PORT',
);
