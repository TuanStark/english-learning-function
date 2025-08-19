import { IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAIExplanationDto {
  @ApiProperty({
    description: 'ID lần làm bài',
    example: 1,
  })
  @IsInt()
  examAttemptId: number;

  @ApiProperty({
    description: 'ID câu hỏi',
    example: 1,
  })
  @IsInt()
  questionId: number;

  @ApiProperty({
    description: 'Giải thích từ AI',
    example: 'Đáp án đúng là A vì câu này sử dụng thì hiện tại đơn với chủ ngữ số ít "I", do đó động từ "to be" phải chia thành "am".',
  })
  @IsString()
  explanation: string;
}
