import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorator/role.decorator';
import { Role } from '../auth/enum/role.enum';

@ApiTags('Dashboard')
@Controller('dashboard')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats/overall')
//   @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy thống kê tổng quan (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê tổng quan hệ thống',
  })
  async getOverallStats() {
    try {
      const result = await this.dashboardService.getOverallStats();
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('stats/user')
  @ApiOperation({ summary: 'Lấy thống kê cá nhân người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê cá nhân người dùng',
  })
  async getUserStats(@Request() req) {
    try {
      const userId = req.user.id;
      const result = await this.dashboardService.getUserStats(userId);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('stats/admin')
//   @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy thống kê admin (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê chi tiết cho admin',
  })
  async getAdminStats() {
    try {
      const result = await this.dashboardService.getAdminStats();
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('learning-paths/progress')
  @ApiOperation({ summary: 'Lấy tiến độ học tập theo learning path' })
  @ApiResponse({
    status: 200,
    description: 'Tiến độ học tập theo learning path',
  })
  async getLearningPathProgress(@Request() req) {
    try {
      const userId = req.user.id;
      const result = await this.dashboardService.getLearningPathProgress(userId);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }

  @Get('user/:userId/stats')
//   @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy thống kê của một người dùng cụ thể (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Thống kê của người dùng',
  })
  async getUserStatsById(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.dashboardService.getUserStats(userId);
      return new ResponseData(result, 200, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(error, 400, HttpMessage.ACCESS_DENIED);
    }
  }
}
