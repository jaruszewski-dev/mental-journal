import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { ErrorPath } from '../../common/consts/error-path.const';
import type { AppLocale } from '../../common/consts/locale.const';
import { IssueEmailVerificationResult } from '../../common/enums/issue-email-verification-result.enum';
import { VerifyEmailResult } from '../../common/enums/verify-email-result.enum';
import { UserNotFoundException } from '../../common/exceptions/custom/user-not-found.exception';
import { Prisma, UserStatus } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IssueEmailVerificationOutcome } from '../auth/ports/issue-email-verification.port';
import { UpdateUserResponseDto } from './dtos/update-user-response.dto';
import { UserAlreadyExistsException } from './exceptions/user-already-exists.exception';
import { FindUserByIdResult } from './ports/find-user-by-id.port';
import {
  RESOLVE_PASSWORD_CHANGE_PORT,
  ResolvePasswordChangePort,
} from './ports/resolve-password-change.port';
import { AnonName } from './value-objects/anon-name.vo';

interface RegisteredUser {
  id: string;
  anonName: string;
}

interface UserCredentials {
  id: string;
  email: string;
  anonName: string;
  passwordHash: string;
  status: UserStatus;
  emailVerified: boolean;
}

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(forwardRef(() => RESOLVE_PASSWORD_CHANGE_PORT))
    private readonly resolvePasswordChangePort: ResolvePasswordChangePort,
  ) {}

  async registerUser(input: {
    email: string;
    anonName: string;
    passwordHash: string;
    preferredLocale: AppLocale;
    emailVerificationTokenHash: string;
    emailVerificationTokenExpiresAt: Date;
  }): Promise<RegisteredUser> {
    const email = input.email.trim().toLowerCase();
    const anonName = AnonName.create(input.anonName);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          anonName: anonName.getValue(),
          passwordHash: input.passwordHash,
          preferredLocale: input.preferredLocale,
          emailVerificationTokenHash: input.emailVerificationTokenHash,
          emailVerificationTokenExpiresAt:
            input.emailVerificationTokenExpiresAt,
        },
      });

      return { id: user.id, anonName: user.anonName };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UserAlreadyExistsException();
      }

      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserCredentials | null> {
    const normalized = email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalized,
      },
      select: {
        id: true,
        email: true,
        anonName: true,
        passwordHash: true,
        status: true,
        emailVerified: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      anonName: user.anonName,
      passwordHash: user.passwordHash,
      status: user.status,
      emailVerified: user.emailVerified,
    };
  }

  async verifyEmail(tokenHash: string): Promise<VerifyEmailResult> {
    const normalized = tokenHash.trim();

    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationTokenHash: normalized,
      },
      select: {
        id: true,
        emailVerified: true,
        emailVerificationTokenExpiresAt: true,
      },
    });

    if (!user) return VerifyEmailResult.NOT_FOUND;

    if (user.emailVerified) return VerifyEmailResult.ALREADY_VERIFIED;

    if (
      !user.emailVerificationTokenExpiresAt ||
      Date.now() > user.emailVerificationTokenExpiresAt.getTime()
    ) {
      return VerifyEmailResult.EXPIRED;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationTokenHash: null,
        emailVerificationTokenExpiresAt: null,
      },
    });

    return VerifyEmailResult.VERIFIED;
  }

  async issueEmailVerification(input: {
    email: string;
    tokenHash: string;
    expiresAt: Date | null;
  }): Promise<IssueEmailVerificationOutcome> {
    const email = input.email.trim().toLowerCase();
    const { tokenHash, expiresAt } = input;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        emailVerified: true,
        preferredLocale: true,
      },
    });

    if (!user) return { result: IssueEmailVerificationResult.SKIPPED };

    if (user.emailVerified)
      return { result: IssueEmailVerificationResult.SKIPPED };

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationTokenHash: tokenHash,
        emailVerificationTokenExpiresAt: expiresAt,
      },
    });

    return {
      result: IssueEmailVerificationResult.ISSUED,
      preferredLocale: user.preferredLocale,
    };
  }

  async findById(id: string): Promise<FindUserByIdResult | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        emailVerified: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      emailVerified: user.emailVerified,
      status: user.status,
    };
  }

  async update(
    userId: string,
    input: {
      anonName?: string;
      avatarUrl?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ): Promise<UpdateUserResponseDto> {
    const data: Prisma.UserUpdateInput = {};

    if (input.newPassword !== undefined) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { passwordHash: true },
      });

      if (!user) throw new UserNotFoundException(ErrorPath.USER);

      const { passwordHash } = await this.resolvePasswordChangePort.execute({
        currentPassword: input.currentPassword ?? '',
        newPassword: input.newPassword,
        currentPasswordHash: user.passwordHash,
      });

      data.passwordHash = passwordHash;
    }

    if (input.anonName !== undefined) {
      data.anonName = AnonName.create(input.anonName).getValue();
    }

    if (input.avatarUrl !== undefined) {
      data.avatarUrl = input.avatarUrl;
    }

    const select = {
      id: true,
      anonName: true,
      avatarUrl: true,
    } as const;

    try {
      if (Object.keys(data).length === 0) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select,
        });

        if (!user) throw new UserNotFoundException(ErrorPath.USER);

        return user;
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data,
        select,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UserNotFoundException(ErrorPath.USER);
      }

      throw error;
    }
  }
}
