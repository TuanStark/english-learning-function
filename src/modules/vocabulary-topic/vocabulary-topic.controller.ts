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
import { VocabularyTopicService } from './vocabulary-topic.service';
import { CreateVocabularyTopicDto } from './dto/create-vocabulary-topic.dto';
import { UpdateVocabularyTopicDto } from './dto/update-vocabulary-topic.dto';
import { FindAllDto } from 'src/common/global/find-all.dto';
import { HttpMessage } from 'src/common/global/globalEnum';
import { ResponseData } from 'src/common/global/globalClass';
import { FindAllTopicsDto } from './dto/find-all-topics.dto';

@ApiTags('Vocabulary Topics')
@Controller('vocabulary-topics')
export class VocabularyTopicController {
  constructor(private readonly vocabularyTopicService: VocabularyTopicService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo chủ đề từ vựng mới' })
  @ApiResponse({
    status: 201,
    description: 'Chủ đề từ vựng đã được tạo thành công',
  })
  async create(@Body() createVocabularyTopicDto: CreateVocabularyTopicDto) {
    try {
      const result = await this.vocabularyTopicService.create(createVocabularyTopicDto);
      return new ResponseData(result, HttpStatus.CREATED, HttpMessage.CREATED);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả chủ đề từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách chủ đề từ vựng',
  })
  async findAll(@Query() query: FindAllTopicsDto) {
    try {
      const result = await this.vocabularyTopicService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết chủ đề từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết chủ đề từ vựng',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vocabularyTopicService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê chủ đề từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê chủ đề từ vựng',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.vocabularyTopicService.getTopicStats(id);
  }

  @Post(':id/vocabularies/bulk')
  @ApiOperation({ summary: 'Thêm hàng loạt từ vựng vào chủ đề' })
  @ApiResponse({
    status: 201,
    description: 'Từ vựng đã được thêm thành công',
  })
  async addBulkVocabularies(
    @Param('id', ParseIntPipe) topicId: number,
    @Body() bulkVocabulariesDto: { vocabularies: any[] }
  ) {
    try {
      const result = await this.vocabularyTopicService.addBulkVocabularies(topicId, bulkVocabulariesDto.vocabularies);
      return new ResponseData(result, HttpStatus.CREATED, HttpMessage.CREATED);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật chủ đề từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Chủ đề từ vựng đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVocabularyTopicDto: UpdateVocabularyTopicDto,
  ) {
    return this.vocabularyTopicService.update(id, updateVocabularyTopicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa chủ đề từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Chủ đề từ vựng đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy chủ đề từ vựng',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vocabularyTopicService.remove(id);
  }
}
