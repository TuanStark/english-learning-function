import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVocabularyTopicDto {
  @ApiProperty({
    description: 'Tên chủ đề từ vựng',
    example: 'Family & Relationships',
  })
  @IsString()
  topicName: string;

  @ApiPropertyOptional({
    description: 'Mô tả chủ đề',
    example: 'Từ vựng về gia đình và các mối quan hệ',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Đường dẫn hình ảnh minh họa',
    example: 'https://example.com/family-image.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;

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
