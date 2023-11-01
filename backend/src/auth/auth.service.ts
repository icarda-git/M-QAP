import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {...user};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
