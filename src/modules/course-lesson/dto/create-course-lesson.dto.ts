import { IsString, IsNumber, IsOptional, IsBoolean, MaxLength, Min } from 'class-validator';

export class CreateCourseLessonDto {
  @IsNumber()
  sectionId: number;

  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  @MaxLength(50)
  contentType: string; // Video, PDF, Quiz

  @IsOptional()
  @IsString()
  @MaxLength(500)
  contentUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number; // minutes

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderIndex?: number = 0;

  @IsOptional()
  @IsBoolean()
  isPreview?: boolean = false;
}
