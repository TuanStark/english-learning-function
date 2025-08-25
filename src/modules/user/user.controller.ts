import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import { GetUser } from '../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth/jwt-auth.guard';
import { FindAllDto } from 'src/common/global/find-all.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorator/role.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findOneForAuthentication(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return new ResponseData(user, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('ADMIN') // Chỉ role 'admin' được truy cập
  @Get('all')
  async findAll(@Query() query: FindAllDto) {
    try {
      const user = await this.userService.findAll(query);
      return new ResponseData(user, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.userService.findOne(id);
      return new ResponseData(user, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) => {
      if (!file || !file.mimetype.match(/image\/(jpg|jpeg|png|gif)/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  })) 
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File) {
    try {
      const user = await this.userService.update(id, updateUserDto, file);
      return new ResponseData(user, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('delete/:id')
  async remove(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.remove(id, updateUserDto);
      return new ResponseData(user, HttpStatus.OK, HttpMessage.SUCCESS);
    } catch (error) {
      return new ResponseData(null, HttpStatus.INTERNAL_SERVER_ERROR, HttpMessage.SERVER_ERROR);
    }
  }
}
