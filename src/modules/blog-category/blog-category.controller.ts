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
import { BlogCategoryService } from './blog-category.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

@ApiTags('Blog Categories')
@Controller('blog-categories')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh mục blog mới' })
  @ApiResponse({
    status: 201,
    description: 'Danh mục blog đã được tạo thành công',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug đã tồn tại',
  })
  create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    return this.blogCategoryService.create(createBlogCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách danh mục blog' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Bao gồm danh mục không hoạt động',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách danh mục blog',
  })
  findAll(@Query('includeInactive') includeInactive?: string) {
    const includeInactiveBoolean = includeInactive === 'true';
    return this.blogCategoryService.findAll(includeInactiveBoolean);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy danh mục blog theo slug' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin danh mục blog',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy danh mục blog',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.blogCategoryService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết danh mục blog' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết danh mục blog',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy danh mục blog',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogCategoryService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê danh mục blog' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê danh mục blog',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.blogCategoryService.getCategoryStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục blog' })
  @ApiResponse({
    status: 200,
    description: 'Danh mục blog đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy danh mục blog',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug đã tồn tại',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto,
  ) {
    return this.blogCategoryService.update(id, updateBlogCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa danh mục blog' })
  @ApiResponse({
    status: 200,
    description: 'Danh mục blog đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy danh mục blog',
  })
  @ApiResponse({
    status: 409,
    description: 'Không thể xóa danh mục đang có bài viết',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogCategoryService.remove(id);
  }
}
