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
import { GrammarService } from './grammar.service';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';
import { FindAllGrammarDto } from './dto/find-all-grammar.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';

@ApiTags('Grammar')
@Controller('grammar')
export class GrammarController {
  constructor(private readonly grammarService: GrammarService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bài ngữ pháp mới' })
  @ApiResponse({
    status: 201,
    description: 'Bài ngữ pháp đã được tạo thành công',
  })
  async create(@Body() createGrammarDto: CreateGrammarDto) {
    try {
      const result = await this.grammarService.create(createGrammarDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài ngữ pháp' })
  @ApiQuery({
    name: 'difficultyLevel',
    required: false,
    description: 'Lọc theo mức độ khó',
    enum: ['Easy', 'Medium', 'Hard'],
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Bao gồm bài ngữ pháp không hoạt động',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài ngữ pháp',
  })
  async findAll(@Query() query: FindAllGrammarDto) {
    try {
      const result = await this.grammarService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm bài ngữ pháp' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Từ khóa tìm kiếm',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Kết quả tìm kiếm bài ngữ pháp',
  })
  async search(@Query('q') searchTerm: string) {
    try {
      const result = await this.grammarService.searchGrammar(searchTerm);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết bài ngữ pháp',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài ngữ pháp',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.grammarService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê bài ngữ pháp',
  })
  async getStats(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.grammarService.getGrammarStats(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Bài ngữ pháp đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài ngữ pháp',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrammarDto: UpdateGrammarDto,
  ) {
    try {
      const result = await this.grammarService.update(id, updateGrammarDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Bài ngữ pháp đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài ngữ pháp',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.grammarService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
