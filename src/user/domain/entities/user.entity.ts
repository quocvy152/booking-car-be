import { BaseEntity } from '../../../common/entities';
import { Gender, Role } from '../enums';

export interface User extends BaseEntity {
  id: string;
  email: string;
  phone: string | null;
  gender: Gender;
  role: Role;
  avatar: string | null;
  date_of_birth: Date | null;
  referral_code: string | null;
}
