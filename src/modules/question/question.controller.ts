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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FindAllQuestionDto } from './dto/find-all-question.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';

@ApiTags('Questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo câu hỏi mới' })
  @ApiResponse({
    status: 201,
    description: 'Câu hỏi đã được tạo thành công',
  })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      const result = await this.questionService.create(createQuestionDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách câu hỏi' })
  @ApiQuery({
    name: 'examId',
    required: false,
    description: 'Lọc theo ID bài kiểm tra',
    type: Number,
  })
  @ApiQuery({
    name: 'questionType',
    required: false,
    description: 'Lọc theo loại câu hỏi',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách câu hỏi',
  })
  findAll(@Query() query: FindAllQuestionDto) {
    return this.questionService.findAll(query);
  }

  @Get('exam/:examId')
  @ApiOperation({ summary: 'Lấy tất cả câu hỏi của một bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách câu hỏi của bài kiểm tra',
  })
  async findByExam(@Param('examId', ParseIntPipe) examId: number) {
    try {
      const result = await this.questionService.findByExam(examId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết câu hỏi',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.questionService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê câu hỏi',
  })
  async getStats(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.questionService.getQuestionStats(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Câu hỏi đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    try {
      const result = await this.questionService.update(id, updateQuestionDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Câu hỏi đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy câu hỏi',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.questionService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
