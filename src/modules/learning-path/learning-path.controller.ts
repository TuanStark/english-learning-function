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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LearningPathService } from './learning-path.service';
import { CreateLearningPathDto } from './dto/create-learning-path.dto';
import { UpdateLearningPathDto } from './dto/update-learning-path.dto';

@ApiTags('Learning Paths')
@Controller('learning-paths')
export class LearningPathController {
  constructor(private readonly learningPathService: LearningPathService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo learning path mới' })
  @ApiResponse({
    status: 201,
    description: 'Learning path đã được tạo thành công',
  })
  create(@Body() createLearningPathDto: CreateLearningPathDto) {
    return this.learningPathService.create(createLearningPathDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả learning paths' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách learning paths',
  })
  findAll() {
    return this.learningPathService.findAll();
  }

  @Get('level/:targetLevel')
  @ApiOperation({ summary: 'Lấy learning paths theo mức độ mục tiêu' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách learning paths theo mức độ',
  })
  findByTargetLevel(@Param('targetLevel') targetLevel: string) {
    return this.learningPathService.findByTargetLevel(targetLevel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết learning path' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết learning path',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy learning path',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.learningPathService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê learning path' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê learning path',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.learningPathService.getLearningPathStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật learning path' })
  @ApiResponse({
    status: 200,
    description: 'Learning path đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy learning path',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLearningPathDto: UpdateLearningPathDto,
  ) {
    return this.learningPathService.update(id, updateLearningPathDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa learning path' })
  @ApiResponse({
    status: 200,
    description: 'Learning path đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy learning path',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.learningPathService.remove(id);
  }
}
