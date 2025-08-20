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
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { FindAllExamDto } from './dto/find-all-exam.dto';

@ApiTags('Exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bài kiểm tra mới' })
  @ApiResponse({
    status: 201,
    description: 'Bài kiểm tra đã được tạo thành công',
  })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài kiểm tra' })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    description: 'Lọc theo mức độ khó',
    enum: ['Easy', 'Medium', 'Hard'],
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Bao gồm bài kiểm tra không hoạt động',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài kiểm tra',
  })
  findAll(@Query() query: FindAllExamDto) {
    return this.examService.findAll(query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Lấy danh sách bài kiểm tra đang hoạt động' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài kiểm tra đang hoạt động',
  })
  getActiveExams() {
    return this.examService.getActiveExams();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết bài kiểm tra',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài kiểm tra',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê bài kiểm tra',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.examService.getExamStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Bài kiểm tra đã được cập nhật',   
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài kiểm tra',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    return this.examService.update(id, updateExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài kiểm tra' })
  @ApiResponse({
    status: 200,
    description: 'Bài kiểm tra đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài kiểm tra',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examService.remove(id);
  }
}
