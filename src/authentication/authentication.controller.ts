import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import {
  IUserCheckExist,
  IUserDocument,
} from 'src/features/users/user.interface';
import { UserService } from 'src/features/users/service/user.service';
import { AuthService } from './service/auth.service';
import { AuthLoginSerialization } from './serialization/auth.login.serialization';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/features/users/user.constant';
import { AuthLoginDto } from './dto/auth.login.dto';
import { ENUM_AUTH_STATUS_CODE_ERROR } from './auth.constant';
import { HelperDateService } from 'src/utils/helper/service/helper.date.service';
import { SuccessException } from 'src/utils/error/exception/error.success.exception';
import { RoleService } from 'src/features/role/service/role.service';
import { RoleDocument } from 'src/features/role/schema/role.schema';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/features/role/role.constant';

@Controller({
  version: '1',
  path: '/auth',
})
export class AuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly helperDateService: HelperDateService,
    private readonly roleService: RoleService,
  ) {}

  @Post('/sign-up')
  async signUp(@Body() { email, ...body }) {
    const role: RoleDocument = await this.roleService.findOne<RoleDocument>({
      name: 'user',
    });

    if (!role) {
      throw new NotFoundException({
        statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
        message: 'role.error.notFound',
      });
    }

    const checkExist: IUserCheckExist = await this.userService.checkExist(
      email,
    );
    if (checkExist && checkExist.email) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EXISTS_ERROR,
        message: 'user.error.emailExist',
      });
    }

    try {
      const password = await this.authService.createPassword(body.password);
      const create = await this.userService.create({
        firstName: body.firstName,
        lastName: body.lastName,
        password: password.passwordHash,
        passwordExpired: password.passwordExpired,
        salt: password.salt,
        email,
        role: role._id,
      });

      const user: IUserDocument =
        await this.userService.findOneById<IUserDocument>(create._id);
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
    } catch (error: any) {
      throw new InternalServerErrorException({
        message: 'http.serverError.internalServerError',
      });
    }
  }
  @Post('/login')
  async login(@Body() body: AuthLoginDto) {
    const rememberMe: boolean = body.rememberMe ? true : false;
    const user: IUserDocument = await this.userService.findOne({
      email: body.email,
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }

    const validate = await this.authService.validateUser(
      body.password,
      user.password,
    );

    if (!validate) {
      throw new NotFoundException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_NOT_MATCH_ERROR,
        message: 'auth.error.passwordNotMatch',
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
    const checkPasswordExpired: boolean =
      await this.authService.checkPasswordExpired(user.passwordExpired);

    if (checkPasswordExpired) {
      throw new SuccessException({
        statusCode: ENUM_AUTH_STATUS_CODE_ERROR.AUTH_PASSWORD_EXPIRED_ERROR,
        message: 'auth.error.passwordExpired',
        data: {
          accessToken,
          refreshToken,
        },
      });
    }

    return {
      accessToken,
      refreshToken,
    };
  }
}
