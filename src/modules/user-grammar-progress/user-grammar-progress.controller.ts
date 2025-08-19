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
import { UserGrammarProgressService } from './user-grammar-progress.service';
import { CreateUserGrammarProgressDto } from './dto/create-user-grammar-progress.dto';
import { UpdateUserGrammarProgressDto } from './dto/update-user-grammar-progress.dto';

@ApiTags('User Grammar Progress')
@Controller('user-grammar-progress')
export class UserGrammarProgressController {
  constructor(private readonly userGrammarProgressService: UserGrammarProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo tiến độ học ngữ pháp mới' })
  @ApiResponse({
    status: 201,
    description: 'Tiến độ học ngữ pháp đã được tạo thành công',
  })
  create(@Body() createUserGrammarProgressDto: CreateUserGrammarProgressDto) {
    return this.userGrammarProgressService.create(createUserGrammarProgressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tiến độ học ngữ pháp' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Lọc theo ID người dùng',
    type: Number,
  })
  @ApiQuery({
    name: 'grammarId',
    required: false,
    description: 'Lọc theo ID bài ngữ pháp',
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Lọc theo trạng thái',
    enum: ['Learning', 'Mastered', 'NeedsReview'],
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tiến độ học ngữ pháp',
  })
  findAll(
    @Query('userId') userId?: string,
    @Query('grammarId') grammarId?: string,
    @Query('status') status?: string,
  ) {
    const userIdNumber = userId ? parseInt(userId, 10) : undefined;
    const grammarIdNumber = grammarId ? parseInt(grammarId, 10) : undefined;
    return this.userGrammarProgressService.findAll(userIdNumber, grammarIdNumber, status);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy tiến độ học ngữ pháp của một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học ngữ pháp của người dùng',
  })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userGrammarProgressService.findByUser(userId);
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: 'Lấy thống kê học ngữ pháp của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê học ngữ pháp của người dùng',
  })
  getUserStats(@Param('userId', ParseIntPipe) userId: number) {
    return this.userGrammarProgressService.getUserStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết tiến độ học ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết tiến độ học ngữ pháp',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ học ngữ pháp',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userGrammarProgressService.findOne(id);
  }

  @Post('practice')
  @ApiOperation({ summary: 'Cập nhật tiến độ sau khi luyện tập ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ đã được cập nhật',
  })
  updateProgress(
    @Body() body: { userId: number; grammarId: number; practiceResult: boolean },
  ) {
    return this.userGrammarProgressService.updateProgress(
      body.userId,
      body.grammarId,
      body.practiceResult,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật tiến độ học ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học ngữ pháp đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ học ngữ pháp',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserGrammarProgressDto: UpdateUserGrammarProgressDto,
  ) {
    return this.userGrammarProgressService.update(id, updateUserGrammarProgressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tiến độ học ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học ngữ pháp đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ học ngữ pháp',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userGrammarProgressService.remove(id);
  }
}
