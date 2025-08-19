import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGrammarExampleDto {
  @ApiProperty({
    description: 'ID bài ngữ pháp',
    example: 1,
  })
  @IsInt()
  grammarId: number;

  @ApiProperty({
    description: 'Câu ví dụ tiếng Anh',
    example: 'I go to school every day.',
  })
  @IsString()
  englishSentence: string;

  @ApiProperty({
    description: 'Câu ví dụ tiếng Việt',
    example: 'Tôi đi học mỗi ngày.',
  })
  @IsString()
  vietnameseSentence: string;

  @ApiPropertyOptional({
    description: 'Giải thích chi tiết',
    example: 'Câu này sử dụng thì hiện tại đơn để diễn tả thói quen hàng ngày.',
  })
  @IsOptional()
  @IsString()
  explanation?: string;
}
