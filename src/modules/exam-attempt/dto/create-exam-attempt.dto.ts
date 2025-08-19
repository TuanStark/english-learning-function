import { IsInt, IsOptional, IsNumber, IsString, IsIn, IsJSON, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExamAttemptDto {
  @ApiProperty({
    description: 'ID người dùng',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID bài kiểm tra',
    example: 1,
  })
  @IsInt()
  examId: number;

  @ApiPropertyOptional({
    description: 'Điểm số',
    example: 85.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiProperty({
    description: 'Tổng số câu hỏi',
    example: 20,
  })
  @IsInt()
  @Min(1)
  totalQuestions: number;

  @ApiPropertyOptional({
    description: 'Số câu trả lời đúng',
    example: 17,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  correctAnswers?: number;

  @ApiPropertyOptional({
    description: 'Thời gian làm bài (giây)',
    example: 1800,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái làm bài',
    example: 'InProgress',
    enum: ['InProgress', 'Completed', 'Cancelled'],
    default: 'InProgress',
  })
  @IsOptional()
  @IsIn(['InProgress', 'Completed', 'Cancelled'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Kết quả chi tiết (JSON)',
    example: '{"answers": [{"questionId": 1, "selectedOption": "A", "isCorrect": true}]}',
  })
  @IsOptional()
  @IsJSON()
  detailedResult?: any;
}
