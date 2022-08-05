import { Controller, Get } from '@nestjs/common';
import { UserProfileGuard, GetUser } from '../user.decorator';
import { IUserDocument } from '../user.interface';
import { UserService } from '../service/user.service';
import { UserProfileSerialization } from '../serialization/user.profile.serialization';

@Controller({
  version: '1',
  path: 'user',
})
export class UserPublicController {
  constructor(private readonly userService: UserService) {}
  @UserProfileGuard()
  @Get('/profile')
  async profile(
    @GetUser() user: IUserDocument,
  ): Promise<UserProfileSerialization> {
    return this.userService.serializationProfile(user);
  }
}
