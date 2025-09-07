import { IsString, IsOptional, IsBoolean, IsInt, IsIn, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({
    description: 'Tiêu đề bài kiểm tra',
    example: 'English Grammar Test - Level 1',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Mô tả bài kiểm tra',
    example: 'Bài kiểm tra ngữ pháp tiếng Anh cơ bản',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Thời gian làm bài (phút)',
    example: 60,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiPropertyOptional({
    description: 'Mức độ khó',
    example: 'Easy',
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  })
  @IsOptional()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Loại bài kiểm tra',
    example: 'TOEIC',
    enum: ['TOEIC', 'IELTS', 'GRAMMAR', 'VOCABULARYQUIZ'],
    default: 'TOEIC',
  })
  @IsOptional()
  @IsIn(['TOEIC', 'IELTS', 'GRAMMAR', 'VOCABULARYQUIZ'])
  type?: string;
}
