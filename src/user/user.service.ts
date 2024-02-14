import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserPayload } from './user.entity';
import { createHash } from 'crypto';
import { Role } from '../auth/roles';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const ownerEmail = this.configService.get('OWNER_EMAIL');
    const ownerPassword = this.configService.get('OWNER_PASSWORD');

    const owner = await this.findByEmailAndPassword(ownerEmail, ownerPassword);
    if (!owner) {
      await this.addUser({
        email: ownerEmail,
        role: Role.Owner,
        password: ownerPassword,
      });
    }
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserPayload> {
    const passwordHash = this.hashPassword(password);
    return this.userRepository.findOne({
      where: { email, password_hash: passwordHash },
      select: { email: true, role: true },
    });
  }

  async addUser(dto: CreateUserDto) {
    const passwordHash = this.hashPassword(dto.password);
    await this.userRepository.insert({
      role: dto.role,
      email: dto.email,
      password_hash: passwordHash,
    });
  }

  hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
