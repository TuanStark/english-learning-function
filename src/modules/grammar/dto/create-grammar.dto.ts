import { IsString, IsOptional, IsBoolean, IsInt, IsIn, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGrammarDto {
  @ApiProperty({
    description: 'Tiêu đề bài ngữ pháp',
    example: 'Present Simple Tense',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Nội dung bài ngữ pháp',
    example: 'Present Simple is used to describe habits, general truths, and repeated actions.',
  })
  @IsString()
  content: string;

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
    description: 'Thứ tự hiển thị',
    example: 1,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
