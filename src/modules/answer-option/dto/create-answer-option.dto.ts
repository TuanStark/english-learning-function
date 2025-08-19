import { IsString, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerOptionDto {
  @ApiProperty({
    description: 'ID câu hỏi',
    example: 1,
  })
  @IsInt()
  questionId: number;

  @ApiProperty({
    description: 'Nội dung đáp án',
    example: 'am',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Đáp án có đúng không',
    example: true,
    default: false,
  })
  @IsBoolean()
  isCorrect?: boolean;

  @ApiProperty({
    description: 'Nhãn đáp án (A, B, C, D)',
    example: 'A',
  })
  @IsString()
  optionLabel: string;
}
