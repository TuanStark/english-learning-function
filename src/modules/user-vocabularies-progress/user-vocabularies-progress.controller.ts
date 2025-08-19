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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserVocabulariesProgressService } from './user-vocabularies-progress.service';
import { CreateUserVocabulariesProgressDto } from './dto/create-user-vocabularies-progress.dto';
import { UpdateUserVocabulariesProgressDto } from './dto/update-user-vocabularies-progress.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { FindAllDto } from 'src/common/global/find-all.dto';

@ApiTags('User Vocabulary Progress')
@Controller('user-vocabularies-progress')
export class UserVocabulariesProgressController {
  constructor(private readonly userVocabulariesProgressService: UserVocabulariesProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo tiến độ học từ vựng mới' })
  @ApiResponse({
    status: 201,
    description: 'Tiến độ học từ vựng đã được tạo thành công',
  })
  async create(@Body() createUserVocabulariesProgressDto: CreateUserVocabulariesProgressDto) {
    try {
      const result = await this.userVocabulariesProgressService.create(createUserVocabulariesProgressDto);
      return new ResponseData(result, HttpStatus.CREATED, HttpMessage.CREATED);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tiến độ học từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tiến độ học từ vựng',
  })
  async findAll(@Query() query: FindAllDto) {
    try {
      const result = await this.userVocabulariesProgressService.findAll(query);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lấy tiến độ học từ vựng của một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học từ vựng của người dùng',
  })
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.userVocabulariesProgressService.findByUser(userId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('user/:userId/stats')
  @ApiOperation({ summary: 'Lấy thống kê học tập của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê học tập của người dùng',
  })
  async getUserStats(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.userVocabulariesProgressService.getUserStats(userId);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết tiến độ học từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết tiến độ học từ vựng',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ học từ vựng',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.userVocabulariesProgressService.findOne(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Post('practice')
  @ApiOperation({ summary: 'Cập nhật tiến độ sau khi luyện tập' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ đã được cập nhật',
  })
  async updateProgress(
    @Body() body: { userId: number; vocabularyId: number; practiceResult: boolean },
  ) {
    try {
      const result = await this.userVocabulariesProgressService.updateProgress(
        body.userId,
        body.vocabularyId,
        body.practiceResult,
      );
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật tiến độ học từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học từ vựng đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ học từ vựng',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserVocabulariesProgressDto: UpdateUserVocabulariesProgressDto,
  ) {
    try {
      const result = await this.userVocabulariesProgressService.update(id, updateUserVocabulariesProgressDto);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa tiến độ học từ vựng' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học từ vựng đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy tiến độ học từ vựng',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.userVocabulariesProgressService.remove(id);
      return new ResponseData(result, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, HttpStatus.BAD_REQUEST, HttpMessage.ACCESS_DENIED);
    }
  }
}
