import { User } from '../entities';

export interface IUserRepository {
  create(
    data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>,
  ): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
