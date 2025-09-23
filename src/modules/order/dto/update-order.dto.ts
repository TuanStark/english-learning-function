import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsNumber()
  @IsOptional()
  paymentId?: number;
}
