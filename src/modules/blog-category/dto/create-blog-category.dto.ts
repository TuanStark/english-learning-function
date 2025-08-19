import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogCategoryDto {
  @ApiProperty({
    description: 'Tên danh mục blog',
    example: 'English Tips',
  })
  @IsString()
  categoryName: string;

  @ApiPropertyOptional({
    description: 'Mô tả danh mục',
    example: 'Các mẹo học tiếng Anh hiệu quả',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Slug URL của danh mục',
    example: 'english-tips',
  })
  @IsString()
  slug: string;

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
