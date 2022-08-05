import {
  Body,
  Controller,
  Post,
  Req,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthenticationService } from './google-authentication.service';
import { Request } from 'express';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { ENUM_AUTH_GOOGLE_STATUS_CODE_ERROR } from './google-authentication.constant';
import { UserService } from 'src/features/users/service/user.service';
import {
  IUserCheckExist,
  IUserDocument,
} from 'src/features/users/user.interface';
import { RoleService } from 'src/features/role/service/role.service';
import { RoleDocument } from 'src/features/role/schema/role.schema';
import { AuthLoginSerialization } from 'src/authentication/serialization/auth.login.serialization';
import { AuthService } from 'src/authentication/service/auth.service';

@Controller('google-authentication')
@ApiTags('authentication')
export class GoogleAuthenticationController {
  constructor(
    private readonly googleAuthenticationService: GoogleAuthenticationService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async authenticate(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: Request,
  ) {
    const { email } = await this.googleAuthenticationService.authenticate(
      tokenData.token,
    );
    if (!email) {
      throw new HttpException(
        'auth-google.error.emailNotFound',
        HttpStatus.NOT_FOUND,
      );
    }
    const role: RoleDocument = await this.roleService.findOne<RoleDocument>({
      name: 'user',
    });

    if (!role) {
      throw new HttpException('role.error.notFound', HttpStatus.NOT_FOUND);
    }

    let user: IUserDocument = await this.userService.getByEmail(email);

    if (!user && !user.isRegisteredWithGoogle) {
      const { email, family_name, given_name, picture } =
        await this.googleAuthenticationService.getUserData(tokenData.token);
      user = await this.userService.createWithGoogle({
        firstName: given_name,
        lastName: family_name,
        email,
        role: role._id,
        avatar: picture,
      });
    }

    const safe: AuthLoginSerialization =
      await this.authService.serializationLogin(user);
    const payloadAccessToken: Record<string, any> =
      await this.authService.createPayloadAccessToken(safe, false);
    const payloadRefreshToken: Record<string, any> =
      await this.authService.createPayloadRefreshToken(safe, false, {
        loginDate: payloadAccessToken.loginDate,
      });

    const accessToken: string = await this.authService.createAccessToken(
      payloadAccessToken,
    );

    const refreshToken: string = await this.authService.createRefreshToken(
      payloadRefreshToken,
      false,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
