import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { catchError, firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
var querystring = require('querystring');
@Injectable()
export class AwsStrategy extends PassportStrategy(Strategy, 'AWS') {
  constructor(
    private readonly jwtService: JwtService,
    private http: HttpService,
    private userService: UsersService,
  ) {
    super();
  }

  async validate(@Request() req) {
    const client_id = process.env.Gognito_client_id;
    const client_secret = process.env.Gognito_client_secret;
    const redirect_uri = process.env.Gognito_client_redirect_uri;
    const code = req.body.code;
    const access_token = await firstValueFrom(
      this.http
        .post(
          `${process.env.Cognito_API}/oauth2/token`,
          querystring.stringify({
            grant_type: 'authorization_code',
            client_id,
            client_secret,
            code,
            redirect_uri,
          }),
          {
            auth: {
              username: client_id,
              password: client_secret,
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(map((d) => d.data.access_token)),
    ).catch((e) => false);

    if (!access_token)
      throw new UnauthorizedException(
        'Authorization Code does not exist or expired',
      );

    const profile = await firstValueFrom(
      this.http
        .get(`${process.env.Cognito_API}/oauth2/userInfo`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .pipe(map((d) => d.data)),
    ).catch((e) => false);

    if (!profile) throw new UnauthorizedException();
    let userInfo = null;
    let newinfo: any = null;
    const user = await this.userService.findByEmail(
      (<string>profile.email || '').toLowerCase(),
    );
    newinfo = {
      email: profile.email.toLowerCase(),
      first_name: profile?.given_name,
      last_name: profile?.family_name,
    };
    if (user) {
      if (
        user.email.toLowerCase() == (<string>profile.email || '').toLowerCase() &&
        (user?.first_name != profile?.given_name ||
          user?.last_name != profile?.family_name)
      ) {
        user.first_name = profile.given_name;
        user.last_name = profile.family_name;
        userInfo = await this.userService.userRepository.save(user, {
          reload: true,
        });
      }
      userInfo = user;
    } else
      userInfo = await this.userService.userRepository.save(newinfo, {
        reload: true,
      });

    if (userInfo) {
      let access_token = this.jwtService.sign({...userInfo}, {
        expiresIn: 10 * 365 * 24 * 60 * 60,
      });
      return {
        expires_in: (this.jwtService.decode(access_token) as any).exp,
        access_token,
      };
    } else throw new UnauthorizedException();
  }
}
