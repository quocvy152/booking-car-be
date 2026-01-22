import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

interface PrismaClientConstructor {
  new (args?: { adapter: PrismaPg }): PrismaClient;
}

interface PrismaClientWithMethods extends PrismaClient {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClientWithMethods;

  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    // Check if URL is a Prisma Accelerate/Postgres URL (starts with prisma:// or prisma+postgres://)
    // These URLs cannot be used with driver adapters
    const isPrismaUrl =
      connectionString.startsWith('prisma://') ||
      connectionString.startsWith('prisma+postgres://');

    if (isPrismaUrl) {
      // Use PrismaClient directly without adapter for Prisma URLs
      // PrismaClient will automatically read DATABASE_URL from environment
      // PrismaClient implements $connect() and $disconnect() methods, so the type assertion is safe
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.client = new PrismaClient() as PrismaClientWithMethods;
    } else {
      // Use adapter for direct PostgreSQL URLs
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      const ClientConstructor =
        PrismaClient as unknown as PrismaClientConstructor;
      this.client = new ClientConstructor({
        adapter,
      }) as PrismaClientWithMethods;
    }
  }

  async onModuleInit(): Promise<void> {
    await this.client.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.$disconnect();
  }

  get prisma(): PrismaClient {
    return this.client;
  }
}
