import { IsString, IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'ID bài kiểm tra',
    example: 1,
  })
  @IsInt()
  examId: number;

  @ApiProperty({
    description: 'Nội dung câu hỏi',
    example: 'What is the correct form of the verb "to be" in this sentence?',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Loại câu hỏi',
    example: 'MultipleChoice',
  })
  @IsString()
  questionType: string;

  @ApiProperty({
    description: 'Thứ tự câu hỏi trong bài kiểm tra',
    example: 1,
  })
  @IsInt()
  @Min(1)
  orderIndex: number;

  @ApiProperty({
    description: 'Điểm số của câu hỏi',
    example: 1.0,
    default: 1.0,
  })
  @IsNumber()
  @Min(0)
  points?: number;
}
