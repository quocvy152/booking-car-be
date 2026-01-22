import { Injectable, Inject } from '@nestjs/common';
import { User } from '../domain/entities';
import type { IUserRepository } from '../domain/repositories';
import { USER_REPOSITORY } from '../infrastructure/user.constants';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async create(
    data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>,
  ): Promise<User> {
    return this.userRepository.create(data);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
