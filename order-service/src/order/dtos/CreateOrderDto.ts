import { IsString, IsNumber, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The name of the item being ordered',
    example: 'Laptop',
  })
  @IsString()
  item!: string;

  @ApiProperty({
    description: 'The price of the item being ordered',
    example: 799.99,
  })
  @IsDecimal()
  price!: number;

  @ApiProperty({
    description: 'The quantity of the item being ordered',
    example: 1,
  })
  @IsNumber()
  quantity!: number;

  @ApiProperty({
    description: 'The user ID of the person placing the order',
    example: 1,
  })
  @IsNumber()
  userId!: number;
}
