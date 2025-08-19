import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: CreateRoleDto) {
    // Kiểm tra xem tên vai trò đã tồn tại chưa
    const existingRole = await this.prisma.role.findUnique({
      where: { roleName: createRoleDto.roleName },
    });

    if (existingRole) {
      throw new ConflictException(`Role with name "${createRoleDto.roleName}" already exists`);
    }

    return this.prisma.role.create({
      data: createRoleDto,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({
      include: {
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            isActive: true,
          },
        },
      },
      orderBy: {
        roleName: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const existingRole = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Kiểm tra tên vai trò mới có bị trùng không (nếu có thay đổi tên)
    if (updateRoleDto.roleName && updateRoleDto.roleName !== existingRole.roleName) {
      const duplicateRole = await this.prisma.role.findUnique({
        where: { roleName: updateRoleDto.roleName },
      });

      if (duplicateRole) {
        throw new ConflictException(`Role with name "${updateRoleDto.roleName}" already exists`);
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
      include: {
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingRole = await this.prisma.role.findUnique({
      where: { id },
      include: {
        users: true,
      },
    });

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Kiểm tra xem có user nào đang sử dụng role này không
    if (existingRole.users.length > 0) {
      throw new ConflictException(
        `Cannot delete role "${existingRole.roleName}" because it is being used by ${existingRole.users.length} user(s)`
      );
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }

  async getRoleStats(id: number) {
    const role = await this.findOne(id);
    
    const activeUsers = role.users.filter(user => user.isActive).length;
    const inactiveUsers = role.users.filter(user => !user.isActive).length;

    return {
      ...role,
      stats: {
        totalUsers: role.users.length,
        activeUsers,
        inactiveUsers,
      },
    };
  }
}
