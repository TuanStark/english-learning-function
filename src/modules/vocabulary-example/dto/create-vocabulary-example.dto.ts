import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVocabularyExampleDto {
  @ApiProperty({
    description: 'ID của từ vựng',
    example: 1,
  })
  @IsInt()
  vocabularyId: number;

  @ApiProperty({
    description: 'Câu ví dụ tiếng Anh',
    example: 'My family is very important to me.',
  })
  @IsString()
  englishSentence: string;

  @ApiProperty({
    description: 'Câu ví dụ tiếng Việt',
    example: 'Gia đình tôi rất quan trọng với tôi.',
  })
  @IsString()
  vietnameseSentence: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn file âm thanh',
    example: 'https://example.com/family-example.mp3',
  })
  @IsOptional()
  @IsString()
  audioFile?: string;
}
