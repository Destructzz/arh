import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-items.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Order, OrderChannel, OrderStatus } from '../orders/entities/orders.entity';
import { OrderItem } from '../orders/entities/order-items.entity';
import { InventoryItem } from '../inventory/entities/inventory-items.entity';

export interface CheckoutDto {
  channel?: OrderChannel;
}

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItem)
        private cartRepo: Repository<CartItem>,
        @InjectRepository(Order)
        private orderRepo: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepo: Repository<OrderItem>,
        @InjectRepository(InventoryItem)
        private inventoryItemRepo: Repository<InventoryItem>,
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

    async checkout(userId: string, dto: CheckoutDto = {}): Promise<Order> {
        const cartItems = await this.cartRepo.find({
            where: { user: { id: userId } },
            relations: ['product'],
        });

        if (cartItems.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Validate stock availability and pre-load inventory items
        const inventoryUpdates: { invItem: InventoryItem; qty: number }[] = [];
        for (const ci of cartItems) {
            const invItem = await this.inventoryItemRepo.findOne({
                where: { product: { id: ci.product.id } },
            });
            const available = invItem ? (invItem.quantityOnHand - invItem.reserved) : 0;
            if (available < ci.quantity) {
                throw new BadRequestException(
                    `Цветов "${ci.product.name}" недостаточно на складе (доступно: ${available}, требуется: ${ci.quantity})`
                );
            }
            if (invItem) {
                inventoryUpdates.push({ invItem, qty: ci.quantity });
            }
        }

        // Increment reserve for verified items
        for (const update of inventoryUpdates) {
            update.invItem.reserved += update.qty;
            await this.inventoryItemRepo.save(update.invItem);
        }

        const totalPrice = cartItems.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        // Create the order
        const order = this.orderRepo.create({
            userId,
            status: OrderStatus.New,
            channel: dto.channel ?? OrderChannel.Online,
            totalPrice,
            totalCost: 0,
            discountAmount: 0,
        });
        const savedOrder = await this.orderRepo.save(order);

        // Create order items from cart
        const orderItems = cartItems.map(ci => this.orderItemRepo.create({
            order: { id: savedOrder.id } as Order,
            product: { id: ci.product.id } as any,
            qty: ci.quantity,
            price: ci.product.price,
            costPrice: 0,
            nameSnapshot: ci.product.name,
        }));
        await this.orderItemRepo.save(orderItems);

        // Clear the cart
        await this.cartRepo.remove(cartItems);

        // Return order with items
        return this.orderRepo.findOne({
            where: { id: savedOrder.id },
            relations: { items: { product: true } },
        }) as Promise<Order>;
    }
}
