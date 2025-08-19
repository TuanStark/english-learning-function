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
import { AnswerOptionService } from './answer-option.service';
import { CreateAnswerOptionDto } from './dto/create-answer-option.dto';
import { UpdateAnswerOptionDto } from './dto/update-answer-option.dto';

@ApiTags('Answer Options')
@Controller('answer-options')
export class AnswerOptionController {
  constructor(private readonly answerOptionService: AnswerOptionService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đáp án mới' })
  @ApiResponse({
    status: 201,
    description: 'Đáp án đã được tạo thành công',
  })
  create(@Body() createAnswerOptionDto: CreateAnswerOptionDto) {
    return this.answerOptionService.create(createAnswerOptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đáp án' })
  @ApiQuery({
    name: 'questionId',
    required: false,
    description: 'Lọc theo ID câu hỏi',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đáp án',
  })
  findAll(@Query('questionId') questionId?: string) {
    const questionIdNumber = questionId ? parseInt(questionId, 10) : undefined;
    return this.answerOptionService.findAll(questionIdNumber);
  }

  @Get('question/:questionId')
  @ApiOperation({ summary: 'Lấy tất cả đáp án của một câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đáp án của câu hỏi',
  })
  findByQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.answerOptionService.findByQuestion(questionId);
  }

  @Get('question/:questionId/correct')
  @ApiOperation({ summary: 'Lấy đáp án đúng của một câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đáp án đúng',
  })
  getCorrectAnswers(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.answerOptionService.getCorrectAnswers(questionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết đáp án' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết đáp án',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đáp án',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.answerOptionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật đáp án' })
  @ApiResponse({
    status: 200,
    description: 'Đáp án đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đáp án',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnswerOptionDto: UpdateAnswerOptionDto,
  ) {
    return this.answerOptionService.update(id, updateAnswerOptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa đáp án' })
  @ApiResponse({
    status: 200,
    description: 'Đáp án đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đáp án',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.answerOptionService.remove(id);
  }
}
