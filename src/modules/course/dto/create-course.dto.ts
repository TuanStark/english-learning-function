import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min, MaxLength } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(250)
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  level?: string = 'Beginner';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  language?: string = 'English';

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean = false;

  @IsOptional()
  @IsDateString()
  publishedAt?: Date;
}
