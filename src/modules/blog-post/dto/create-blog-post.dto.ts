import { IsString, IsOptional, IsInt, IsIn, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({
    description: 'Tiêu đề bài viết',
    example: '10 Tips to Improve Your English Speaking Skills',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Slug URL của bài viết',
    example: '10-tips-improve-english-speaking-skills',
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'Tóm tắt bài viết',
    example: 'Discover effective techniques to enhance your English speaking abilities...',
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    description: 'Nội dung bài viết',
    example: 'Speaking English fluently is a goal for many language learners...',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'ID tác giả',
    example: 1,
  })
  @IsInt()
  authorId: number;

  @ApiProperty({
    description: 'ID danh mục blog',
    example: 1,
  })
  @IsInt()
  categoryId: number;

  @ApiPropertyOptional({
    description: 'Ảnh đại diện bài viết',
    example: 'https://example.com/blog-image.jpg',
  })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái bài viết',
    example: 'Draft',
    enum: ['Draft', 'Published', 'Archived'],
    default: 'Draft',
  })
  @IsOptional()
  @IsIn(['Draft', 'Published', 'Archived'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Thời gian xuất bản',
    example: '2024-01-01T10:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: Date;
}
