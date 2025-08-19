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
import { PathStepService } from './path-step.service';
import { CreatePathStepDto } from './dto/create-path-step.dto';
import { UpdatePathStepDto } from './dto/update-path-step.dto';

@ApiTags('Path Steps')
@Controller('path-steps')
export class PathStepController {
  constructor(private readonly pathStepService: PathStepService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo path step mới' })
  @ApiResponse({
    status: 201,
    description: 'Path step đã được tạo thành công',
  })
  create(@Body() createPathStepDto: CreatePathStepDto) {
    return this.pathStepService.create(createPathStepDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả path steps' })
  @ApiQuery({
    name: 'learningPathId',
    required: false,
    description: 'Lọc theo ID learning path',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách path steps',
  })
  findAll(@Query('learningPathId') learningPathId?: string) {
    const learningPathIdNumber = learningPathId ? parseInt(learningPathId, 10) : undefined;
    return this.pathStepService.findAll(learningPathIdNumber);
  }

  @Get('learning-path/:learningPathId')
  @ApiOperation({ summary: 'Lấy tất cả steps của một learning path' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách steps của learning path',
  })
  findByLearningPath(@Param('learningPathId', ParseIntPipe) learningPathId: number) {
    return this.pathStepService.findByLearningPath(learningPathId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết path step' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết path step',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy path step',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pathStepService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật path step' })
  @ApiResponse({
    status: 200,
    description: 'Path step đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy path step',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePathStepDto: UpdatePathStepDto,
  ) {
    return this.pathStepService.update(id, updatePathStepDto);
  }

  @Post('learning-path/:learningPathId/reorder')
  @ApiOperation({ summary: 'Sắp xếp lại thứ tự các steps' })
  @ApiResponse({
    status: 200,
    description: 'Thứ tự steps đã được cập nhật',
  })
  reorderSteps(
    @Param('learningPathId', ParseIntPipe) learningPathId: number,
    @Body() stepIds: number[],
  ) {
    return this.pathStepService.reorderSteps(learningPathId, stepIds);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa path step' })
  @ApiResponse({
    status: 200,
    description: 'Path step đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy path step',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pathStepService.remove(id);
  }
}
