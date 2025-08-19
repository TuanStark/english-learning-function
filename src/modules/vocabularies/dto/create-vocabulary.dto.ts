import { IsString, IsOptional, IsBoolean, IsInt, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVocabularyDto {
  @ApiProperty({
    description: 'ID chủ đề từ vựng',
    example: 1,
  })
  @IsInt()
  topicId: number;

  @ApiProperty({
    description: 'Từ tiếng Anh',
    example: 'family',
  })
  @IsString()
  englishWord: string;

  @ApiPropertyOptional({
    description: 'Phiên âm',
    example: '/ˈfæməli/',
  })
  @IsOptional()
  @IsString()
  pronunciation?: string;

  @ApiProperty({
    description: 'Nghĩa tiếng Việt',
    example: 'gia đình',
  })
  @IsString()
  vietnameseMeaning: string;

  @ApiPropertyOptional({
    description: 'Loại từ',
    example: 'Noun',
  })
  @IsOptional()
  @IsString()
  wordType?: string;

  @ApiPropertyOptional({
    description: 'Mức độ khó',
    example: 'Easy',
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Easy',
  })
  @IsOptional()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficultyLevel?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn hình ảnh',
    example: 'https://example.com/family.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn file âm thanh',
    example: 'https://example.com/family.mp3',
  })
  @IsOptional()
  @IsString()
  audioFile?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
