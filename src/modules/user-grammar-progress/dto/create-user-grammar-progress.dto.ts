import { IsString, IsOptional, IsInt, IsIn, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserGrammarProgressDto {
  @ApiProperty({
    description: 'ID người dùng',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'ID bài ngữ pháp',
    example: 1,
  })
  @IsInt()
  grammarId: number;

  @ApiPropertyOptional({
    description: 'Trạng thái học tập',
    example: 'Learning',
    enum: ['Learning', 'Mastered', 'NeedsReview'],
    default: 'Learning',
  })
  @IsOptional()
  @IsIn(['Learning', 'Mastered', 'NeedsReview'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Mức độ thành thạo (0-100)',
    example: 75,
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  masteryLevel?: number;

  @ApiPropertyOptional({
    description: 'Số lần đã luyện tập',
    example: 5,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  timesPracticed?: number;
}
