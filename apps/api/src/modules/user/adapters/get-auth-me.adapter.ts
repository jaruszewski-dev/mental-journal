import { Injectable } from '@nestjs/common';

import {
  GetAuthMePort,
  GetAuthMeResult,
} from '../../auth/ports/get-auth-me.port';
import { UserService } from '../user.service';

@Injectable()
export class GetAuthMeAdapter implements GetAuthMePort {
  constructor(private readonly userService: UserService) {}

  execute(userId: string): Promise<GetAuthMeResult | null> {
    return this.userService.getAuthMe(userId);
  }
}
