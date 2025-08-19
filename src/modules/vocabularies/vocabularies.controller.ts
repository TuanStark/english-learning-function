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
import { VocabulariesService } from './vocabularies.service';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { FindAllDto } from 'src/common/global/find-all.dto';

@ApiTags('Vocabularies')
@Controller('vocabularies')
export class VocabulariesController {
  constructor(private readonly vocabulariesService: VocabulariesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo từ vựng mới' })
  @ApiResponse({
    status: 201,
    description: 'Từ vựng đã được tạo thành công',
  })
  async create(@Body() createVocabularyDto: CreateVocabularyDto) {
    try {
      const result = await this.vocabulariesService.create(createVocabularyDto);
      return new ResponseData(result, HttpStatus.CREATED, HttpMessage.CREATED);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách từ vựng' })
  @ApiQuery({
    name: 'topicId',
    required: false,
    description: 'Lọc theo ID chủ đề',
    type: Number,
  })
  @ApiQuery({
    name: 'difficultyLevel',
    required: false,
    description: 'Lọc theo mức độ khó',
    enum: ['Easy', 'Medium', 'Hard'],
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Bao gồm từ vựng không hoạt động',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách từ vựng',
  })
  async findAll(
    @Query() query: FindAllDto,
  ) {
    try {
      const result = await this.vocabulariesService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('topic/:topicId')
  @ApiOperation({ summary: 'Lấy từ vựng theo chủ đề' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách từ vựng theo chủ đề',
  })
  async findByTopic(@Param('topicId', ParseIntPipe) topicId: number) {
    try {
      const result = await this.vocabulariesService.findByTopic(topicId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết từ vựng',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy từ vựng',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.vocabulariesService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Từ vựng đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy từ vựng',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabularyDto: UpdateVocabularyDto,
  ) {
    try {
      const result = await this.vocabulariesService.update(id, updateVocabularyDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Từ vựng đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy từ vựng',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.vocabulariesService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
