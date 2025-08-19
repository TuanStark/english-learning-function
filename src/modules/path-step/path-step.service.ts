import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePathStepDto } from './dto/create-path-step.dto';
import { UpdatePathStepDto } from './dto/update-path-step.dto';

@Injectable()
export class PathStepService {
  constructor(private prisma: PrismaService) {}

  async create(createPathStepDto: CreatePathStepDto) {
    // Kiểm tra learning path có tồn tại không
    const learningPath = await this.prisma.learningPath.findUnique({
      where: { id: createPathStepDto.learningPathId },
    });

    if (!learningPath) {
      throw new NotFoundException(`Learning path with ID ${createPathStepDto.learningPathId} not found`);
    }

    return this.prisma.pathStep.create({
      data: createPathStepDto,
      include: {
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
    });
  }

  async findAll(learningPathId?: number) {
    const where: any = {};
    
    if (learningPathId) {
      where.learningPathId = learningPathId;
    }

    return this.prisma.pathStep.findMany({
      where,
      include: {
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const pathStep = await this.prisma.pathStep.findUnique({
      where: { id },
      include: {
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
    });

    if (!pathStep) {
      throw new NotFoundException(`Path step with ID ${id} not found`);
    }

    return pathStep;
  }

  async update(id: number, updatePathStepDto: UpdatePathStepDto) {
    const existingPathStep = await this.prisma.pathStep.findUnique({
      where: { id },
    });

    if (!existingPathStep) {
      throw new NotFoundException(`Path step with ID ${id} not found`);
    }

    // Nếu có thay đổi learningPathId, kiểm tra learning path mới có tồn tại không
    if (updatePathStepDto.learningPathId && updatePathStepDto.learningPathId !== existingPathStep.learningPathId) {
      const learningPath = await this.prisma.learningPath.findUnique({
        where: { id: updatePathStepDto.learningPathId },
      });

      if (!learningPath) {
        throw new NotFoundException(`Learning path with ID ${updatePathStepDto.learningPathId} not found`);
      }
    }

    return this.prisma.pathStep.update({
      where: { id },
      data: updatePathStepDto,
      include: {
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingPathStep = await this.prisma.pathStep.findUnique({
      where: { id },
    });

    if (!existingPathStep) {
      throw new NotFoundException(`Path step with ID ${id} not found`);
    }

    return this.prisma.pathStep.delete({
      where: { id },
    });
  }

  async findByLearningPath(learningPathId: number) {
    return this.prisma.pathStep.findMany({
      where: { learningPathId },
      include: {
        learningPath: {
          select: {
            id: true,
            pathName: true,
            targetLevel: true,
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async reorderSteps(learningPathId: number, stepIds: number[]) {
    // Cập nhật thứ tự các steps
    const updates = stepIds.map((stepId, index) => ({
      where: { id: stepId },
      data: { orderIndex: index + 1 },
    }));

    await this.prisma.$transaction(
      updates.map(update => this.prisma.pathStep.update(update))
    );

    return this.findByLearningPath(learningPathId);
  }
}
