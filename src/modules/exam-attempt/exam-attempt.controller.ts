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
import { ExamAttemptService } from './exam-attempt.service';
import { CreateExamAttemptDto } from './dto/create-exam-attempt.dto';
import { UpdateExamAttemptDto } from './dto/update-exam-attempt.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { FindAllDto } from 'src/common/global/find-all.dto';

@ApiTags('Exam Attempts')
@Controller('exam-attempts')
export class ExamAttemptController {
  constructor(private readonly examAttemptService: ExamAttemptService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo lần làm bài mới' })
  @ApiResponse({
    status: 201,
    description: 'Lần làm bài đã được tạo thành công',
  })
  @ApiResponse({
    status: 409,
    description: 'User đang có bài làm InProgress',
  })
  async create(@Body() createExamAttemptDto: CreateExamAttemptDto) {
    try {
      const result = await this.examAttemptService.create(createExamAttemptDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }   
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách lần làm bài' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Lọc theo ID người dùng',
    type: Number,
  })
  @ApiQuery({
    name: 'examId',
    required: false,
    description: 'Lọc theo ID bài kiểm tra',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Lọc theo trạng thái',
    enum: ['InProgress', 'Completed', 'Cancelled'],
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lần làm bài',
  })
  async findAll(
    @Query() query: FindAllDto,
  ) {
    try {
      const result = await this.examAttemptService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy lần làm bài của một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lần làm bài của người dùng',
  })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.examAttemptService.findByUser(userId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('exam/:examId')
  @ApiOperation({ summary: 'Lấy lần làm bài của một bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lần làm bài của bài kiểm tra',
  })
  async findByExam(@Param('examId', ParseIntPipe) examId: number) {
    try {
      const result = await this.examAttemptService.findByExam(examId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: 'Lấy thống kê làm bài của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê làm bài của người dùng',
  })
  async getUserStats(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.examAttemptService.getUserExamStats(userId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết lần làm bài' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết lần làm bài',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy lần làm bài',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.examAttemptService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Post(':id/submit')
  @ApiOperation({ summary: 'Nộp bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Bài kiểm tra đã được nộp và chấm điểm',
  })
  @ApiResponse({
    status: 409,
    description: 'Bài kiểm tra không ở trạng thái InProgress',
  })
  async submitExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { answers: any[], timeSpent?: number },
  ) {
    try {
      const result = await this.examAttemptService.submitExam(id, body.answers, body.timeSpent);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật lần làm bài' })
  @ApiResponse({
    status: 200,
    description: 'Lần làm bài đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy lần làm bài',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamAttemptDto: UpdateExamAttemptDto,
  ) {
    try {
      const result = await this.examAttemptService.update(id, updateExamAttemptDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lần làm bài' })
  @ApiResponse({
    status: 200,
    description: 'Lần làm bài đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy lần làm bài',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.examAttemptService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
