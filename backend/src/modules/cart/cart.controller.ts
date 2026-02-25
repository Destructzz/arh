import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import type { Request } from 'express';
import { MethodJwtAuthGuard } from '../auth/guards/method-jwt-auth.guard';

interface RequestWithUser extends Request {
    user: {
        id: string;
        login: string;
        role: string;
    };
}

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(MethodJwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @ApiOperation({ summary: 'Получить корзину текущего пользователя' })
    @Get()
    getCart(@Req() req: RequestWithUser) {
        return this.cartService.findMyCart(req.user.id);
    }

    @ApiOperation({ summary: 'Добавить товар в корзину' })
    @Post()
    addToCart(@Body() body: AddToCartDto, @Req() req: RequestWithUser) {
        return this.cartService.add(req.user.id, body);
    }

    @ApiOperation({ summary: 'Изменить количество товара' })
    @Patch(':id')
    updateQuantity(@Param('id') id: string, @Body() body: UpdateCartDto, @Req() req: RequestWithUser) {
        return this.cartService.updateQuantity(id, req.user.id, body);
    }

    @ApiOperation({ summary: 'Удалить товар из корзины' })
    @Delete(':id')
    removeItem(@Param('id') id: string, @Req() req: RequestWithUser) {
        return this.cartService.remove(id, req.user.id);
    }
}
