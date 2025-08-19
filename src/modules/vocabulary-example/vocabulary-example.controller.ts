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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VocabularyExampleService } from './vocabulary-example.service';
import { CreateVocabularyExampleDto } from './dto/create-vocabulary-example.dto';
import { UpdateVocabularyExampleDto } from './dto/update-vocabulary-example.dto';
import { FindAllDto } from 'src/common/global/find-all.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';

@ApiTags('Vocabulary Examples')
@Controller('vocabulary-examples')
export class VocabularyExampleController {
  constructor(private readonly vocabularyExampleService: VocabularyExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ví dụ từ vựng mới' })
  @ApiResponse({
    status: 201,
    description: 'Ví dụ từ vựng đã được tạo thành công',
  })
  async create(@Body() createVocabularyExampleDto: CreateVocabularyExampleDto) {
    try {
      const result = await this.vocabularyExampleService.create(createVocabularyExampleDto);
      return new ResponseData(result, HttpStatus.CREATED, HttpMessage.CREATED);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả ví dụ từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách ví dụ từ vựng',
  })
  async findAll(@Query() query: FindAllDto) {
    try {
      const result = await this.vocabularyExampleService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết ví dụ từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết ví dụ từ vựng',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ từ vựng',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.vocabularyExampleService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('vocabulary/:vocabularyId')
  @ApiOperation({ summary: 'Lấy tất cả ví dụ của một từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách ví dụ của từ vựng',
  })
  async findByVocabulary(@Param('vocabularyId', ParseIntPipe) vocabularyId: number) {
    try {
      const result = await this.vocabularyExampleService.findByVocabulary(vocabularyId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật ví dụ từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Ví dụ từ vựng đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ từ vựng',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabularyExampleDto: UpdateVocabularyExampleDto,
  ) {
    try {
      const result = await this.vocabularyExampleService.update(id, updateVocabularyExampleDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa ví dụ từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Ví dụ từ vựng đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ từ vựng',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.vocabularyExampleService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
