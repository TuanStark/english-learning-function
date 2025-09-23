import { IsString, IsNumber, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateCourseSectionDto {
  @IsNumber()
  courseId: number;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderIndex?: number = 0;
}
