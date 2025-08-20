import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { FindAllExamDto } from './dto/find-all-exam.dto';

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

  async findAll(query: FindAllExamDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      difficulty,
      includeInactive = false
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const take = limitNumber;
    const skip = (pageNumber - 1) * take;

    const where: any = {};
    
    // Add search filters
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
        { difficulty: { contains: search.trim() } },
      ];
    }
    
    // Add difficulty filter
    if (difficulty) {
      where.difficulty = difficulty;
    }
    
    // Add active filter
    if (!includeInactive) {
      where.isActive = true;
    }

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [exams, total] = await Promise.all([
      this.prisma.exam.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          questions: {
            select: {
              id: true,
              content: true,
              questionType: true,
              orderIndex: true,
              points: true,
            }
          },
          examAttempts: {
            select: {
              id: true,
              score: true,
              status: true,
              startedAt: true,
              completedAt: true,
            }
          },
          _count: {
            select: {
              questions: true,
              examAttempts: true,
            }
          }
        }
      }),
      this.prisma.exam.count({
        where: where,
      })
    ]);

    return {
      data: exams,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
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
