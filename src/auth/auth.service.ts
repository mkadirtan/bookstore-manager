import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmailAndPassword(
      dto.email,
      dto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = instanceToPlain(user);
    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }

  verifyToken(token: string): UserPayload {
    return this.jwtService.verify(token);
  }
}
