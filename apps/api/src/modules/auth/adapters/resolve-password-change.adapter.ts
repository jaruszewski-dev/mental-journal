import { Inject, Injectable, forwardRef } from '@nestjs/common';

import {
  ResolvePasswordChangeInput,
  ResolvePasswordChangePort,
  ResolvePasswordChangeResult,
} from '../../user/ports/resolve-password-change.port';
import { AuthService } from '../auth.service';

@Injectable()
export class ResolvePasswordChangeAdapter implements ResolvePasswordChangePort {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  execute(
    input: ResolvePasswordChangeInput,
  ): Promise<ResolvePasswordChangeResult> {
    return this.authService.resolvePasswordChange(input);
  }
}
