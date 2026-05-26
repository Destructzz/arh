import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStats } from './interfaces/user-stats';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){}

  async getUserStats(id: string): Promise<UserStats> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const stats = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.orders', 'orders')
      .select('user.createdAt', 'registeredAt')
      .addSelect('COUNT(orders.id)', 'totalPurchases')
      .addSelect('SUM(orders.totalPrice)', 'totalSpent')
      .where('user.id = :id', { id })
      .groupBy('user.id')
      .groupBy('user.createdAt')
      .getRawOne();

    if (!stats || !stats.registeredAt) {
      return {
        registeredAt: user.createdAt.toISOString(),
        totalPurchases: 0,
        totalSpent: 0,
      };
    }

    return {
      registeredAt: new Date(stats.registeredAt).toISOString(),
      totalPurchases: Number(stats.totalPurchases) || 0,
      totalSpent: Number(stats.totalSpent) || 0,
    };
  }

  async updateProfile(id: string, updateData: { phone?: string | null; email?: string | null }): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (updateData.phone !== undefined) {
      user.phone = updateData.phone;
    }
    if (updateData.email !== undefined) {
      user.email = updateData.email;
    }

    return this.userRepository.save(user);
  }
}
