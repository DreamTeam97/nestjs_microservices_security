import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';

@Injectable()
export class GoogleAuthenticationService {
  oauthClient: Auth.OAuth2Client;
  private readonly clientID: string;
  private readonly clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.clientID = this.configService.get<string>('auth.google.clientId');
    this.clientSecret = this.configService.get<string>(
      'auth.google.clientSecret',
    );
    this.oauthClient = new google.auth.OAuth2(this.clientID, this.clientSecret);
  }

  async authenticate(token: string) {
    try {
      const tokenInfo = await this.oauthClient.getTokenInfo(token);
      return tokenInfo;
    } catch (error) {
      throw new HttpException(
        'auth-google.error.tokenInvalid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }
}
