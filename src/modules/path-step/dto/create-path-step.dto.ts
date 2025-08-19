import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePathStepDto {
  @ApiProperty({
    description: 'ID của learning path',
    example: 1,
  })
  @IsInt()
  learningPathId: number;

  @ApiProperty({
    description: 'Tên của step',
    example: 'Học từ vựng cơ bản',
  })
  @IsString()
  stepName: string;

  @ApiPropertyOptional({
    description: 'Mô tả step',
    example: 'Học 50 từ vựng cơ bản nhất',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Loại nội dung',
    example: 'Vocabulary',
  })
  @IsString()
  contentType: string;

  @ApiPropertyOptional({
    description: 'ID của nội dung liên quan',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  contentId?: number;

  @ApiProperty({
    description: 'Thứ tự hiển thị',
    example: 1,
  })
  @IsInt()
  orderIndex: number;

  @ApiPropertyOptional({
    description: 'Step có bắt buộc không',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Số phút ước tính để hoàn thành',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  estimatedMinutes?: number;
}
