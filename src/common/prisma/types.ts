import { BaseEntity } from '../entities';

export type PrismaModelWithBase<T> = T & BaseEntity;
