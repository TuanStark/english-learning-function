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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

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
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
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
  findAll(
    @Query('examId') examId?: string,
    @Query('questionType') questionType?: string,
  ) {
    const examIdNumber = examId ? parseInt(examId, 10) : undefined;
    return this.questionService.findAll(examIdNumber, questionType);
  }

  @Get('exam/:examId')
  @ApiOperation({ summary: 'Lấy tất cả câu hỏi của một bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách câu hỏi của bài kiểm tra',
  })
  findByExam(@Param('examId', ParseIntPipe) examId: number) {
    return this.questionService.findByExam(examId);
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê câu hỏi',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.getQuestionStats(id);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.remove(id);
  }
}
