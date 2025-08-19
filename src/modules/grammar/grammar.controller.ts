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
import { GrammarService } from './grammar.service';
import { CreateGrammarDto } from './dto/create-grammar.dto';
import { UpdateGrammarDto } from './dto/update-grammar.dto';

@ApiTags('Grammar')
@Controller('grammar')
export class GrammarController {
  constructor(private readonly grammarService: GrammarService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bài ngữ pháp mới' })
  @ApiResponse({
    status: 201,
    description: 'Bài ngữ pháp đã được tạo thành công',
  })
  create(@Body() createGrammarDto: CreateGrammarDto) {
    return this.grammarService.create(createGrammarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách bài ngữ pháp' })
  @ApiQuery({
    name: 'difficultyLevel',
    required: false,
    description: 'Lọc theo mức độ khó',
    enum: ['Easy', 'Medium', 'Hard'],
  })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    description: 'Bao gồm bài ngữ pháp không hoạt động',
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài ngữ pháp',
  })
  findAll(
    @Query('difficultyLevel') difficultyLevel?: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const includeInactiveBoolean = includeInactive === 'true';
    return this.grammarService.findAll(difficultyLevel, includeInactiveBoolean);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm bài ngữ pháp' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Từ khóa tìm kiếm',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Kết quả tìm kiếm bài ngữ pháp',
  })
  search(@Query('q') searchTerm: string) {
    return this.grammarService.searchGrammar(searchTerm);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết bài ngữ pháp',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài ngữ pháp',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.grammarService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê bài ngữ pháp',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.grammarService.getGrammarStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Bài ngữ pháp đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài ngữ pháp',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrammarDto: UpdateGrammarDto,
  ) {
    return this.grammarService.update(id, updateGrammarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Bài ngữ pháp đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài ngữ pháp',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.grammarService.remove(id);
  }
}
