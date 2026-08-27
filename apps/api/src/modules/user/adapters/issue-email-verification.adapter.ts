import { Injectable } from '@nestjs/common';

import {
  IssueEmailVerificationInput,
  IssueEmailVerificationOutcome,
  IssueEmailVerificationPort,
} from '../../auth/ports/issue-email-verification.port';
import { UserService } from '../user.service';

@Injectable()
export class IssueEmailVerificationAdapter implements IssueEmailVerificationPort {
  constructor(private readonly userService: UserService) {}

  async execute(
    input: IssueEmailVerificationInput,
  ): Promise<IssueEmailVerificationOutcome> {
    return await this.userService.issueEmailVerification(input);
  }
}
