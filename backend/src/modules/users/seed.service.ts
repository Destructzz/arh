import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const login = this.config.get<string>('ADMIN_LOGIN');
    const password = this.config.get<string>('ADMIN_PASSWORD');

    if (!login || !password) {
      this.logger.warn('ADMIN_LOGIN or ADMIN_PASSWORD not set. Skipping admin seeding.');
      return;
    }

    const existing = await this.usersRepo.findOne({ where: { login } });

    if (existing) {
      this.logger.log(`Admin user "${login}" already exists.`);
      return;
    }

    const passwordHash = await argon2.hash(password);
    const admin = this.usersRepo.create({
      login,
      passwordHash,
      role: UserRole.admin,
      isActive: true,
    });

    await this.usersRepo.save(admin);
    this.logger.log(`Admin user "${login}" successfully created.`);
  }
}
