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
import { UserGrammarProgressService } from './user-grammar-progress.service';
import { CreateUserGrammarProgressDto } from './dto/create-user-grammar-progress.dto';
import { UpdateUserGrammarProgressDto } from './dto/update-user-grammar-progress.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { FindAllDto } from 'src/common/global/find-all.dto';

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
  async create(@Body() createUserGrammarProgressDto: CreateUserGrammarProgressDto) {
    try {
      const result = await this.userGrammarProgressService.create(createUserGrammarProgressDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    } 
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
  async findAll(@Query() query: FindAllDto) {
    try {
      const result = await this.userGrammarProgressService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy tiến độ học ngữ pháp của một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học ngữ pháp của người dùng',
  })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.userGrammarProgressService.findByUser(userId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: 'Lấy thống kê học ngữ pháp của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê học ngữ pháp của người dùng',
  })
  async getUserStats(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.userGrammarProgressService.getUserStats(userId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.userGrammarProgressService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Post('practice')
  @ApiOperation({ summary: 'Cập nhật tiến độ sau khi luyện tập ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ đã được cập nhật',
  })
  async updateProgress(
    @Body() body: { userId: number; grammarId: number; practiceResult: boolean },
  ) {
    console.log(body);
    try {
      const result = await this.userGrammarProgressService.updateProgress(
        body.userId,
        body.grammarId,
        body.practiceResult,
      );
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserGrammarProgressDto: UpdateUserGrammarProgressDto,
  ) {
    try {
      const result = await this.userGrammarProgressService.update(id, updateUserGrammarProgressDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.userGrammarProgressService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
