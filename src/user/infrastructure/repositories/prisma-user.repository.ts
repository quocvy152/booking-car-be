import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User } from '../../domain/entities';
import { IUserRepository } from '../../domain/repositories';
import {
  Gender,
  Role,
  AuthProvider,
  type User as PrismaUser,
} from '@prisma/client';
import { AuthProvider as DomainAuthProvider } from '../../../auth/domain/enums';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>,
  ): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        password: data.password || null,
        phone: data.phone ?? null,
        provider: (data.provider ?? DomainAuthProvider.EMAIL) as AuthProvider,
        provider_id: data.provider_id ?? null,
        gender: data.gender as Gender,
        role: (data.role ?? Role.USER) as Role,
        avatar: data.avatar ?? null,
        date_of_birth: data.date_of_birth ?? null,
        referral_code: data.referral_code ?? null,
      },
    });

    return this.mapToDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        is_deleted: false,
      },
    });

    return user ? this.mapToDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        is_deleted: false,
      },
    });

    return user ? this.mapToDomain(user) : null;
  }

  async findByProvider(
    provider: DomainAuthProvider,
    providerId: string,
  ): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        provider: provider as AuthProvider,
        provider_id: providerId,
        is_deleted: false,
      },
    });

    return user ? this.mapToDomain(user) : null;
  }

  private mapToDomain(prismaUser: PrismaUser): User {
    return {
      id: prismaUser.id,
      full_name: prismaUser.full_name,
      email: prismaUser.email,
      phone: prismaUser.phone,
      // password is excluded for security reasons
      provider:
        (prismaUser.provider as DomainAuthProvider) || DomainAuthProvider.EMAIL,
      provider_id: prismaUser.provider_id,
      gender: prismaUser.gender as User['gender'],
      role: prismaUser.role as User['role'],
      avatar: prismaUser.avatar,
      date_of_birth: prismaUser.date_of_birth,
      referral_code: prismaUser.referral_code,
      created_at: prismaUser.created_at,
      updated_at: prismaUser.updated_at,
      is_deleted: prismaUser.is_deleted,
    };
  }
}
