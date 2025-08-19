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
import { AIExplanationService } from './ai-explanation.service';
import { CreateAIExplanationDto } from './dto/create-ai-explanation.dto';
import { UpdateAIExplanationDto } from './dto/update-ai-explanation.dto';

@ApiTags('AI Explanations')
@Controller('ai-explanations')
export class AIExplanationController {
  constructor(private readonly aiExplanationService: AIExplanationService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo giải thích AI mới' })
  @ApiResponse({
    status: 201,
    description: 'Giải thích AI đã được tạo thành công',
  })
  create(@Body() createAIExplanationDto: CreateAIExplanationDto) {
    return this.aiExplanationService.create(createAIExplanationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách giải thích AI' })
  @ApiQuery({
    name: 'examAttemptId',
    required: false,
    description: 'Lọc theo ID lần làm bài',
    type: Number,
  })
  @ApiQuery({
    name: 'questionId',
    required: false,
    description: 'Lọc theo ID câu hỏi',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách giải thích AI',
  })
  findAll(
    @Query('examAttemptId') examAttemptId?: string,
    @Query('questionId') questionId?: string,
  ) {
    const examAttemptIdNumber = examAttemptId ? parseInt(examAttemptId, 10) : undefined;
    const questionIdNumber = questionId ? parseInt(questionId, 10) : undefined;
    return this.aiExplanationService.findAll(examAttemptIdNumber, questionIdNumber);
  }

  @Get('exam-attempt/:examAttemptId')
  @ApiOperation({ summary: 'Lấy tất cả giải thích AI của một lần làm bài' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách giải thích AI của lần làm bài',
  })
  findByExamAttempt(@Param('examAttemptId', ParseIntPipe) examAttemptId: number) {
    return this.aiExplanationService.findByExamAttempt(examAttemptId);
  }

  @Get('question/:questionId')
  @ApiOperation({ summary: 'Lấy tất cả giải thích AI của một câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách giải thích AI của câu hỏi',
  })
  findByQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.aiExplanationService.findByQuestion(questionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết giải thích AI' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết giải thích AI',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy giải thích AI',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.aiExplanationService.findOne(id);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Tự động tạo giải thích AI cho câu hỏi' })
  @ApiResponse({
    status: 201,
    description: 'Giải thích AI đã được tạo tự động',
  })
  generateExplanation(
    @Body() body: { examAttemptId: number; questionId: number },
  ) {
    return this.aiExplanationService.generateExplanationForAttempt(
      body.examAttemptId,
      body.questionId,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật giải thích AI' })
  @ApiResponse({
    status: 200,
    description: 'Giải thích AI đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy giải thích AI',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAIExplanationDto: UpdateAIExplanationDto,
  ) {
    return this.aiExplanationService.update(id, updateAIExplanationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa giải thích AI' })
  @ApiResponse({
    status: 200,
    description: 'Giải thích AI đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy giải thích AI',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.aiExplanationService.remove(id);
  }
}
