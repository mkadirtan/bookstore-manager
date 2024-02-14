import { SetMetadata } from '@nestjs/common';
import { Request } from 'express';

export const MANAGER_KEY = 'manager';
export type ExtractBookstoreIdFn = (req: Request) => number;
export const Manager = (extractBookstoreId: ExtractBookstoreIdFn) =>
  SetMetadata(MANAGER_KEY, extractBookstoreId);
