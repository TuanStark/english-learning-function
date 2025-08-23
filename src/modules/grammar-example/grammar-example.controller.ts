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
import { GrammarExampleService } from './grammar-example.service';
import { CreateGrammarExampleDto } from './dto/create-grammar-example.dto';
import { UpdateGrammarExampleDto } from './dto/update-grammar-example.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { FindAll } from './dto/find-all.dto';

@ApiTags('Grammar Examples')
@Controller('grammar-examples')
export class GrammarExampleController {
  constructor(private readonly grammarExampleService: GrammarExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ví dụ ngữ pháp mới' })
  @ApiResponse({
    status: 201,
    description: 'Ví dụ ngữ pháp đã được tạo thành công',
  })
  async create(@Body() createGrammarExampleDto: CreateGrammarExampleDto) {
    try {
      const result = await this.grammarExampleService.create(createGrammarExampleDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách ví dụ ngữ pháp' })
  @ApiQuery({
    name: 'grammarId',
    required: false,
    description: 'Lọc theo ID bài ngữ pháp',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách ví dụ ngữ pháp',
  })
  async findAll(@Query() query: FindAll) {
    try {
      const result = await this.grammarExampleService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm ví dụ ngữ pháp' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Từ khóa tìm kiếm',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Kết quả tìm kiếm ví dụ ngữ pháp',
  })
  async search(@Query('q') searchTerm: string) {
    try {
      const result = await this.grammarExampleService.searchExamples(searchTerm);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('grammar/:grammarId')
  @ApiOperation({ summary: 'Lấy tất cả ví dụ của một bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách ví dụ của bài ngữ pháp',
  })
  async findByGrammar(@Param('grammarId', ParseIntPipe) grammarId: number) {
    try {
      const result = await this.grammarExampleService.findByGrammar(grammarId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết ví dụ ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết ví dụ ngữ pháp',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ ngữ pháp',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.grammarExampleService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật ví dụ ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Ví dụ ngữ pháp đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ ngữ pháp',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrammarExampleDto: UpdateGrammarExampleDto,
  ) {
    try {
      const result = await this.grammarExampleService.update(id, updateGrammarExampleDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa ví dụ ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Ví dụ ngữ pháp đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ ngữ pháp',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.grammarExampleService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
