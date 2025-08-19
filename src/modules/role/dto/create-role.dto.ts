import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Tên vai trò',
    example: 'Admin',
  })
  @IsString()
  roleName: string;

  @ApiPropertyOptional({
    description: 'Mô tả vai trò',
    example: 'Quản trị viên hệ thống',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
