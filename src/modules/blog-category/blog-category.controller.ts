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
import { BlogCategoryService } from './blog-category.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { FindAllDto } from 'src/common/global/find-all.dto';

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
  async create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    try {
      const result = await this.blogCategoryService.create(createBlogCategoryDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách danh mục blog' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Trang hiện tại',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng bản ghi trên mỗi trang',
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Từ khóa tìm kiếm',
    type: String,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Trường sắp xếp',
    type: String,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Thứ tự sắp xếp',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách danh mục blog',
  })
  async findAll(@Query() query: FindAllDto) {
    try {
      const result = await this.blogCategoryService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async findBySlug(@Param('slug') slug: string) {
    try {
      const result = await this.blogCategoryService.findBySlug(slug);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.blogCategoryService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê danh mục blog' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê danh mục blog',
  })
  async getStats(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.blogCategoryService.getCategoryStats(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto,
  ) {
    try {
      const result = await this.blogCategoryService.update(id, updateBlogCategoryDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.blogCategoryService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
