import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto) {
    const data = {
      ...createExamDto,
      difficulty: createExamDto.difficulty || 'Easy',
    };

    return this.prisma.exam.create({
      data,
      include: {
        questions: {
          include: {
            answerOptions: true,
          },
        },
      },
    });
  }

  async findAll(difficulty?: string, includeInactive = false) {
    const where: any = {};
    
    if (!includeInactive) {
      where.isActive = true;
    }
    
    if (difficulty) {
      where.difficulty = difficulty;
    }

    return this.prisma.exam.findMany({
      where,
      include: {
        questions: {
          select: {
            id: true,
            content: true,
            questionType: true,
            points: true,
          },
        },
        examAttempts: {
          select: {
            id: true,
            userId: true,
            score: true,
            status: true,
            completedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            answerOptions: true,
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
        examAttempts: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const existingExam = await this.prisma.exam.findUnique({
      where: { id },
    });

    if (!existingExam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return this.prisma.exam.update({
      where: { id },
      data: updateExamDto,
      include: {
        questions: {
          include: {
            answerOptions: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingExam = await this.prisma.exam.findUnique({
      where: { id },
    });

    if (!existingExam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async getExamStats(id: number) {
    const exam = await this.findOne(id);
    
    const totalQuestions = exam.questions.length;
    const totalAttempts = exam.examAttempts.length;
    const completedAttempts = exam.examAttempts.filter(attempt => attempt.status === 'Completed').length;
    
    const scores = exam.examAttempts
      .filter(attempt => attempt.score !== null)
      .map(attempt => attempt.score as number);

    const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    return {
      ...exam,
      stats: {
        totalQuestions,
        totalAttempts,
        completedAttempts,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore,
        lowestScore,
      },
    };
  }

  async getActiveExams() {
    return this.prisma.exam.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        difficulty: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
