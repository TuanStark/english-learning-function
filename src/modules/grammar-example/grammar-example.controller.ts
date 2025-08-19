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
import { GrammarExampleService } from './grammar-example.service';
import { CreateGrammarExampleDto } from './dto/create-grammar-example.dto';
import { UpdateGrammarExampleDto } from './dto/update-grammar-example.dto';

@ApiTags('Grammar Examples')
@Controller('grammar-examples')
export class GrammarExampleController {
  constructor(private readonly grammarExampleService: GrammarExampleService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo ví dụ ngữ pháp mới' })
  @ApiResponse({
    status: 201,
    description: 'Ví dụ ngữ pháp đã được tạo thành công',
  })
  create(@Body() createGrammarExampleDto: CreateGrammarExampleDto) {
    return this.grammarExampleService.create(createGrammarExampleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách ví dụ ngữ pháp' })
  @ApiQuery({
    name: 'grammarId',
    required: false,
    description: 'Lọc theo ID bài ngữ pháp',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách ví dụ ngữ pháp',
  })
  findAll(@Query('grammarId') grammarId?: string) {
    const grammarIdNumber = grammarId ? parseInt(grammarId, 10) : undefined;
    return this.grammarExampleService.findAll(grammarIdNumber);
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm ví dụ ngữ pháp' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Từ khóa tìm kiếm',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Kết quả tìm kiếm ví dụ ngữ pháp',
  })
  search(@Query('q') searchTerm: string) {
    return this.grammarExampleService.searchExamples(searchTerm);
  }

  @Get('grammar/:grammarId')
  @ApiOperation({ summary: 'Lấy tất cả ví dụ của một bài ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách ví dụ của bài ngữ pháp',
  })
  findByGrammar(@Param('grammarId', ParseIntPipe) grammarId: number) {
    return this.grammarExampleService.findByGrammar(grammarId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết ví dụ ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết ví dụ ngữ pháp',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ ngữ pháp',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.grammarExampleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật ví dụ ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Ví dụ ngữ pháp đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ ngữ pháp',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGrammarExampleDto: UpdateGrammarExampleDto,
  ) {
    return this.grammarExampleService.update(id, updateGrammarExampleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa ví dụ ngữ pháp' })
  @ApiResponse({
    status: 200,
    description: 'Ví dụ ngữ pháp đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy ví dụ ngữ pháp',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.grammarExampleService.remove(id);
  }
}
