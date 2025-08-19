import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogCommentDto {
  @ApiProperty({
    description: 'ID bài viết blog',
    example: 1,
  })
  @IsInt()
  blogPostId: number;

  @ApiProperty({
    description: 'ID người dùng',
    example: 1,
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Bài viết rất hữu ích! Cảm ơn tác giả đã chia sẻ.',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'ID bình luận cha (nếu là reply)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  parentCommentId?: number;
}
