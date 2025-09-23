import { IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryCourseProgressDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  enrollmentId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  lessonId?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isCompleted?: boolean;
}
