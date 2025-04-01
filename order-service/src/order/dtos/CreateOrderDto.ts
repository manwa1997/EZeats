import { IsString, IsNumber, IsDecimal } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  item!: string;

  @IsDecimal()
  price!: number;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  userId!: number; 
}
