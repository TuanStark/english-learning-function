import { IsString, IsOptional, IsInt, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserLearningPathDto {
  @ApiProperty({
    description: 'ID của người dùng',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID của learning path',
    example: 1,
  })
  @IsInt()
  learningPathId: number;

  @ApiPropertyOptional({
    description: 'Trạng thái học tập',
    example: 'InProgress',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Tiến độ học tập (JSON)',
    example: { step1: 'completed', step2: 'in_progress' },
  })
  @IsOptional()
  @IsObject()
  progress?: any;
}
