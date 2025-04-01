import { IsString, IsNumber, IsDecimal, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  item!: string;

  @IsDecimal()
  price!: number;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  userId!: number;

  @IsOptional()  
  @IsString()
  status?: string;
}
