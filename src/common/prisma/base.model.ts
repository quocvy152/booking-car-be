import { BaseEntity } from '../entities';

export type BasePrismaModel = BaseEntity;

export const BASE_MODEL_FIELDS = `
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  is_deleted Boolean @default(false)
`;
