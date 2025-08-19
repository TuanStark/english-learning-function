import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLearningPathDto {
  @ApiProperty({
    description: 'Tên của learning path',
    example: 'Tiếng Anh Cơ Bản',
  })
  @IsString()
  pathName: string;

  @ApiPropertyOptional({
    description: 'Mô tả learning path',
    example: 'Khóa học tiếng Anh dành cho người mới bắt đầu',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Ảnh bìa learning path',
    example: 'https://example.com/cover.jpg',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({
    description: 'Mức độ mục tiêu',
    example: 'Beginner',
  })
  @IsString()
  targetLevel: string;

  @ApiPropertyOptional({
    description: 'Số tuần ước tính để hoàn thành',
    example: 12,
  })
  @IsOptional()
  @IsInt()
  estimatedWeeks?: number;

  @ApiPropertyOptional({
    description: 'Thứ tự hiển thị',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
