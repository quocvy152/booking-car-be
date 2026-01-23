import { User } from '../entities';
import { AuthProvider } from '../../../auth/domain/enums';

export interface IUserRepository {
  create(
    data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>,
  ): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByProvider(
    provider: AuthProvider,
    providerId: string,
  ): Promise<User | null>;
}
