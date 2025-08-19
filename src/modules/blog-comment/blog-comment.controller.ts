import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BlogCommentService } from './blog-comment.service';
import { CreateBlogCommentDto } from './dto/create-blog-comment.dto';
import { UpdateBlogCommentDto } from './dto/update-blog-comment.dto';

@ApiTags('Blog Comments')
@Controller('blog-comments')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bình luận blog mới' })
  @ApiResponse({
    status: 201,
    description: 'Bình luận blog đã được tạo thành công',
  })
  create(@Body() createBlogCommentDto: CreateBlogCommentDto) {
    return this.blogCommentService.create(createBlogCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bình luận blog' })
  @ApiQuery({
    name: 'blogPostId',
    required: false,
    description: 'Lọc theo ID bài viết',
    type: Number,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Lọc theo ID người dùng',
    type: Number,
  })
  @ApiQuery({
    name: 'parentCommentId',
    required: false,
    description: 'Lọc theo ID bình luận cha (null cho comment gốc)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bình luận blog',
  })
  findAll(
    @Query('blogPostId') blogPostId?: string,
    @Query('userId') userId?: string,
    @Query('parentCommentId') parentCommentId?: string,
  ) {
    const blogPostIdNumber = blogPostId ? parseInt(blogPostId, 10) : undefined;
    const userIdNumber = userId ? parseInt(userId, 10) : undefined;
    const parentCommentIdNumber = parentCommentId ? parseInt(parentCommentId, 10) : undefined;
    return this.blogCommentService.findAll(blogPostIdNumber, userIdNumber, parentCommentIdNumber);
  }

  @Get('post/:blogPostId')
  @ApiOperation({ summary: 'Lấy tất cả bình luận của một bài viết' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bình luận của bài viết',
  })
  findByPost(@Param('blogPostId', ParseIntPipe) blogPostId: number) {
    return this.blogCommentService.findByPost(blogPostId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy tất cả bình luận của một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bình luận của người dùng',
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.blogCommentService.findByUser(userId);
  }

  @Get('post/:blogPostId/stats')
  @ApiOperation({ summary: 'Lấy thống kê bình luận của bài viết' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê bình luận',
  })
  getCommentStats(@Param('blogPostId', ParseIntPipe) blogPostId: number) {
    return this.blogCommentService.getCommentStats(blogPostId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết bình luận' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết bình luận',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bình luận',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogCommentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bình luận blog' })
  @ApiResponse({
    status: 200,
    description: 'Bình luận blog đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bình luận',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogCommentDto: UpdateBlogCommentDto,
  ) {
    return this.blogCommentService.update(id, updateBlogCommentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bình luận blog' })
  @ApiResponse({
    status: 200,
    description: 'Bình luận blog đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bình luận',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogCommentService.remove(id);
  }
}
