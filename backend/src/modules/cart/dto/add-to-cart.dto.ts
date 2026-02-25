import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class AddToCartDto {
    @ApiProperty({ description: 'ID товара', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ description: 'Количество', example: 1, default: 1 })
    @IsInt()
    @Min(1)
    quantity: number = 1;
}
