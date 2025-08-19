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
import { ExamAttemptService } from './exam-attempt.service';
import { CreateExamAttemptDto } from './dto/create-exam-attempt.dto';
import { UpdateExamAttemptDto } from './dto/update-exam-attempt.dto';

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
  create(@Body() createExamAttemptDto: CreateExamAttemptDto) {
    return this.examAttemptService.create(createExamAttemptDto);
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
  findAll(
    @Query('userId') userId?: string,
    @Query('examId') examId?: string,
    @Query('status') status?: string,
  ) {
    const userIdNumber = userId ? parseInt(userId, 10) : undefined;
    const examIdNumber = examId ? parseInt(examId, 10) : undefined;
    return this.examAttemptService.findAll(userIdNumber, examIdNumber, status);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy lần làm bài của một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lần làm bài của người dùng',
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.examAttemptService.findByUser(userId);
  }

  @Get('exam/:examId')
  @ApiOperation({ summary: 'Lấy lần làm bài của một bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lần làm bài của bài kiểm tra',
  })
  findByExam(@Param('examId', ParseIntPipe) examId: number) {
    return this.examAttemptService.findByExam(examId);
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: 'Lấy thống kê làm bài của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê làm bài của người dùng',
  })
  getUserStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.examAttemptService.getUserExamStats(userId);
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examAttemptService.findOne(id);
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
  submitExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { answers: any[] },
  ) {
    return this.examAttemptService.submitExam(id, body.answers);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamAttemptDto: UpdateExamAttemptDto,
  ) {
    return this.examAttemptService.update(id, updateExamAttemptDto);
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examAttemptService.remove(id);
  }
}
