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
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BlogPostService } from './blog-post.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { FindAllDto } from 'src/common/global/find-all.dto';

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
  async create(@Body() createBlogPostDto: CreateBlogPostDto) {
    try {
      const result = await this.blogPostService.create(createBlogPostDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async findAll(@Query() query: FindAllDto) {
    try {
      const result = await this.blogPostService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('published')
  @ApiOperation({ summary: 'Lấy danh sách bài viết đã xuất bản' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài viết đã xuất bản',
  })
  async findPublished() {
    try {
      const result = await this.blogPostService.findPublished();
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async search(@Query('q') searchTerm: string) {
    try {
      const result = await this.blogPostService.searchPosts(searchTerm);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async findBySlug(@Param('slug') slug: string) {
    try {
      const result = await this.blogPostService.findBySlug(slug);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.blogPostService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê bài viết' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê bài viết',
  })
  async getStats(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.blogPostService.getPostStats(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ) {
    try {
      const result = await this.blogPostService.update(id, updateBlogPostDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.blogPostService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
