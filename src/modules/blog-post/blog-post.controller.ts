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
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@ApiTags('Blog Posts')
@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bài viết blog mới' })
  @ApiResponse({
    status: 201,
    description: 'Bài viết blog đã được tạo thành công',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug đã tồn tại',
  })
  create(@Body() createBlogPostDto: CreateBlogPostDto) {
    return this.blogPostService.create(createBlogPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài viết blog' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Lọc theo ID danh mục',
    type: Number,
  })
  @ApiQuery({
    name: 'authorId',
    required: false,
    description: 'Lọc theo ID tác giả',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Lọc theo trạng thái',
    enum: ['Draft', 'Published', 'Archived'],
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài viết blog',
  })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('authorId') authorId?: string,
    @Query('status') status?: string,
  ) {
    const categoryIdNumber = categoryId ? parseInt(categoryId, 10) : undefined;
    const authorIdNumber = authorId ? parseInt(authorId, 10) : undefined;
    return this.blogPostService.findAll(categoryIdNumber, authorIdNumber, status);
  }

  @Get('published')
  @ApiOperation({ summary: 'Lấy danh sách bài viết đã xuất bản' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài viết đã xuất bản',
  })
  findPublished() {
    return this.blogPostService.findPublished();
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm bài viết blog' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Từ khóa tìm kiếm',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Kết quả tìm kiếm bài viết',
  })
  search(@Query('q') searchTerm: string) {
    return this.blogPostService.searchPosts(searchTerm);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy bài viết theo slug' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin bài viết',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.blogPostService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết bài viết' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết bài viết',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogPostService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê bài viết' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê bài viết',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.blogPostService.getPostStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bài viết blog' })
  @ApiResponse({
    status: 200,
    description: 'Bài viết blog đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug đã tồn tại',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    return this.blogPostService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài viết blog' })
  @ApiResponse({
    status: 200,
    description: 'Bài viết blog đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogPostService.remove(id);
  }
}
