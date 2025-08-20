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
import { AnswerOptionService } from './answer-option.service';
import { CreateAnswerOptionDto } from './dto/create-answer-option.dto';
import { UpdateAnswerOptionDto } from './dto/update-answer-option.dto';
import { FindAllAnswerOptionDto } from './dto/find-all-answer-option.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';

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
  async create(@Body() createAnswerOptionDto: CreateAnswerOptionDto) {
    try {
      const result = await this.answerOptionService.create(createAnswerOptionDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async findAll(@Query() query: FindAllAnswerOptionDto) {
    try {
      const result = await this.answerOptionService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('question/:questionId')
  @ApiOperation({ summary: 'Lấy tất cả đáp án của một câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đáp án của câu hỏi',
  })
  async findByQuestion(@Param('questionId', ParseIntPipe) questionId: number) {
    try {
      const result = await this.answerOptionService.findByQuestion(questionId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('question/:questionId/correct')
  @ApiOperation({ summary: 'Lấy đáp án đúng của một câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đáp án đúng',
  })
  async getCorrectAnswers(@Param('questionId', ParseIntPipe) questionId: number) {
    try {
      const result = await this.answerOptionService.getCorrectAnswers(questionId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.answerOptionService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnswerOptionDto: UpdateAnswerOptionDto,
  ) {
      try {
      const result = await this.answerOptionService.update(id, updateAnswerOptionDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.answerOptionService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
