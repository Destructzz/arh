import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-items.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItem)
        private cartRepo: Repository<CartItem>,
    ) { }

    async findMyCart(userId: string) {
        return this.cartRepo.find({
            where: { user: { id: userId } },
            relations: ['product'],
        });
    }

    async add(userId: string, target: AddToCartDto) {
        let item = await this.cartRepo.findOne({
            where: {
                user: { id: userId },
                product: { id: target.productId }
            },
            relations: ['product']
        });

        if (item) {
            item.quantity += target.quantity;
            return this.cartRepo.save(item);
        }

        item = this.cartRepo.create({
            user: { id: userId },
            product: { id: target.productId },
            quantity: target.quantity,
        });

        await this.cartRepo.save(item);

        // Fetch again to load relations for the response
        return this.cartRepo.findOne({
            where: { id: item.id },
            relations: ['product']
        });
    }

    async updateQuantity(id: string, userId: string, updateDto: UpdateCartDto) {
        const item = await this.cartRepo.findOne({
            where: { id, user: { id: userId } },
            relations: ['product']
        });
        if (!item) {
            throw new NotFoundException('Cart item not found');
        }
        item.quantity = updateDto.quantity;
        return this.cartRepo.save(item);
    }

    async remove(id: string, userId: string) {
        const item = await this.cartRepo.findOne({
            where: { id, user: { id: userId } },
        });
        if (!item) {
            throw new NotFoundException('Cart item not found');
        }
        await this.cartRepo.remove(item);
        return { success: true };
    }
}
