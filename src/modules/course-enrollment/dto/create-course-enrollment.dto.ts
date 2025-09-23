import { IsNumber, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';

export class CreateCourseEnrollmentDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  courseId: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string = 'InProgress';

  @IsOptional()
  @IsDateString()
  enrolledAt?: Date;

  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}
