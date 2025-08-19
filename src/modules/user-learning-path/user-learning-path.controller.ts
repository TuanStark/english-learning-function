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
import { UserLearningPathService } from './user-learning-path.service';
import { CreateUserLearningPathDto } from './dto/create-user-learning-path.dto';
import { UpdateUserLearningPathDto } from './dto/update-user-learning-path.dto';

@ApiTags('User Learning Paths')
@Controller('user-learning-paths')
export class UserLearningPathController {
  constructor(private readonly userLearningPathService: UserLearningPathService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo user learning path mới' })
  @ApiResponse({
    status: 201,
    description: 'User learning path đã được tạo thành công',
  })
  create(@Body() createUserLearningPathDto: CreateUserLearningPathDto) {
    return this.userLearningPathService.create(createUserLearningPathDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả user learning paths' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Lọc theo ID người dùng',
    type: Number,
  })
  @ApiQuery({
    name: 'learningPathId',
    required: false,
    description: 'Lọc theo ID learning path',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách user learning paths',
  })
  findAll(
    @Query('userId') userId?: string,
    @Query('learningPathId') learningPathId?: string,
  ) {
    const userIdNumber = userId ? parseInt(userId, 10) : undefined;
    const learningPathIdNumber = learningPathId ? parseInt(learningPathId, 10) : undefined;
    return this.userLearningPathService.findAll(userIdNumber, learningPathIdNumber);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy tất cả learning paths của một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách learning paths của người dùng',
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userLearningPathService.findByUser(userId);
  }

  @Get('learning-path/:learningPathId')
  @ApiOperation({ summary: 'Lấy tất cả người dùng của một learning path' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách người dùng của learning path',
  })
  findByLearningPath(@Param('learningPathId', ParseIntPipe) learningPathId: number) {
    return this.userLearningPathService.findByLearningPath(learningPathId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết user learning path' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết user learning path',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy user learning path',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userLearningPathService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật user learning path' })
  @ApiResponse({
    status: 200,
    description: 'User learning path đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy user learning path',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserLearningPathDto: UpdateUserLearningPathDto,
  ) {
    return this.userLearningPathService.update(id, updateUserLearningPathDto);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: 'Cập nhật tiến độ học tập' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học tập đã được cập nhật',
  })
  updateProgress(
    @Param('id', ParseIntPipe) id: number,
    @Body() progress: any,
  ) {
    return this.userLearningPathService.updateProgress(id, progress);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Hoàn thành learning path' })
  @ApiResponse({
    status: 200,
    description: 'Learning path đã được hoàn thành',
  })
  completeLearningPath(@Param('id', ParseIntPipe) id: number) {
    return this.userLearningPathService.completeLearningPath(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa user learning path' })
  @ApiResponse({
    status: 200,
    description: 'User learning path đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy user learning path',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userLearningPathService.remove(id);
  }
}
