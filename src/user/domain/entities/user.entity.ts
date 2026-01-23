import { BaseEntity } from '../../../common/entities';
import { Gender, Role } from '../enums';
import { AuthProvider } from '../../../auth/domain/enums';

export interface User extends BaseEntity {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  password?: string; // Optional for security (excluded when returning users) and for social auth users
  provider: AuthProvider;
  provider_id: string | null;
  gender: Gender;
  role: Role;
  avatar: string | null;
  date_of_birth: Date | null;
  referral_code: string | null;
}
