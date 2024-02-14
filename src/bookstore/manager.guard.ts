import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerBookstore } from './entities';
import { Repository } from 'typeorm';
import { ExtractBookstoreIdFn, MANAGER_KEY } from './manager';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from '../auth/roles';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(
    @InjectRepository(ManagerBookstore)
    private readonly managerBookstoreRepository: Repository<ManagerBookstore>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const extractBookstoreId =
      this.reflector.getAllAndOverride<ExtractBookstoreIdFn>(MANAGER_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

    // not decorated with @Manager
    if (!extractBookstoreId) {
      return true;
    }

    const user = req.user;
    if (!user) {
      return false;
    }
    // other cases don't concern this guard.
    if (user.role !== Role.Manager) {
      return true;
    }

    const bookstoreId = extractBookstoreId(req);

    try {
      const isManagerOfBookstore = await this.managerBookstoreRepository.exists(
        {
          where: {
            manager_id: user.id,
            bookstore_id: bookstoreId,
          },
        },
      );

      return isManagerOfBookstore;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
