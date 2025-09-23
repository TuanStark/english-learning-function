import { IsNumber, IsOptional, IsString, IsDateString, Min, MaxLength } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  courseId: number;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string = 'Pending';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  transactionId?: string;

  @IsOptional()
  @IsDateString()
  paidAt?: Date;
}
