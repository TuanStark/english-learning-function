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
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindAllOrderDto } from './dto/find-all-order.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from '../auth/enum/role.enum';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiResponse({
    status: 201,
    description: 'Đơn hàng đã được tạo thành công',
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const result = await this.orderService.create(createOrderDto);
      return new ResponseData(result, 201, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng (Admin only)' })
  @ApiQuery({ name: 'page', required: false, description: 'Trang hiện tại', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Số lượng item mỗi trang', type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Từ khóa tìm kiếm', type: String })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sắp xếp theo trường', type: String })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Thứ tự sắp xếp (asc/desc)', type: String })
  @ApiQuery({ name: 'status', required: false, description: 'Trạng thái đơn hàng', type: String })
  @ApiQuery({ name: 'userId', required: false, description: 'ID người dùng', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đơn hàng',
  })
  async findAll(@Query() query: FindAllOrderDto) {
    try {
      const result = await this.orderService.findAll(query);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('my-orders')
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Lấy đơn hàng của người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đơn hàng của người dùng',
  })
  async findMyOrders(@Request() req) {
    try {
      const userId = req.user.id;
      const result = await this.orderService.findByUser(userId);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('stats')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy thống kê đơn hàng (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê đơn hàng',
  })
  async getOrderStats() {
    try {
      const result = await this.orderService.getOrderStats();
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết đơn hàng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin chi tiết đơn hàng',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderService.findOne(id);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật đơn hàng (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Đơn hàng đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const result = await this.orderService.update(id, updateOrderDto);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái đơn hàng đã được cập nhật',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng',
  })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    try {
      const result = await this.orderService.updateStatus(id, status);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Xóa đơn hàng (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Đơn hàng đã được xóa',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy đơn hàng',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderService.remove(id);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }
}
