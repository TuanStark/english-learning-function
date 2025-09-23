import { IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateCourseProgressDto {
  @IsNumber()
  enrollmentId: number;

  @IsNumber()
  lessonId: number;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean = false;

  @IsOptional()
  @IsDateString()
  completedAt?: Date;
}
