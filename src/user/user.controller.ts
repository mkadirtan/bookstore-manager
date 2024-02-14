import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Role, Roles } from '../auth/roles';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Owner)
  @Post('/')
  addUser(@Body(new ValidationPipe()) body: CreateUserDto) {
    return this.userService.addUser(body);
  }
}
