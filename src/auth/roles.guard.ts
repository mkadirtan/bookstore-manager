import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Role, ROLES_KEY } from './roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    try {
      const req = context.switchToHttp().getRequest<Request>();

      const token = this.extractToken(req);
      if (!token) {
        return false;
      }

      const user = this.authService.verifyToken(token);
      if (!user) {
        return false;
      }

      req.user = user;

      return requiredRoles.some((role) => user.role === role);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  extractToken(request: Request): string {
    if (!request.headers.authorization) {
      return null;
    }

    const [, token] = request.headers.authorization.split(' ');
    if (!token) {
      return null;
    }

    return token;
  }
}
