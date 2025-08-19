import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo vai trò mới' })
  @ApiResponse({
    status: 201,
    description: 'Vai trò đã được tạo thành công',
  })
  @ApiResponse({
    status: 409,
    description: 'Tên vai trò đã tồn tại',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách vai trò',
  })
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết vai trò',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy vai trò',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Lấy thống kê vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê vai trò',
  })
  getStats(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getRoleStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Vai trò đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy vai trò',
  })
  @ApiResponse({
    status: 409,
    description: 'Tên vai trò đã tồn tại',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vai trò' })
  @ApiResponse({
    status: 200,
    description: 'Vai trò đã được xóa',
  }) 
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
