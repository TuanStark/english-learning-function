import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { FindAllQuestionDto } from './dto/find-all-question.dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async create(createQuestionDto: CreateQuestionDto) {
    // Kiểm tra xem exam có tồn tại không
    const exam = await this.prisma.exam.findUnique({
      where: { id: createQuestionDto.examId },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${createQuestionDto.examId} not found`);
    }

    return this.prisma.question.create({
      data: createQuestionDto,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
        answerOptions: true,
      },
    });
  }

  async findAll(query: FindAllQuestionDto ) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      examId,
      questionType
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
        { content: { contains: search.trim() } },
        { questionType: { contains: search.trim() } },
      ];
    }
    
    // Add examId filter
    if (examId) {
      where.examId = examId;
    }
    
    // Add questionType filter
    if (questionType) {
      where.questionType = questionType;
    }

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          exam: {
            select: {
              id: true,
              title: true,
              difficulty: true,
            }
          },
          answerOptions: {
            select: {
              id: true,
              content: true,
              isCorrect: true,
              optionLabel: true,
            }
          },
          _count: {
            select: {
              answerOptions: true,
              aiExplanations: true,
            }
          }
        }
      }),
      this.prisma.question.count({
        where: where,
      })
    ]);

    return {
      data: questions,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            difficulty: true,
            duration: true,
          },
        },
        answerOptions: {
          orderBy: {
            optionLabel: 'asc',
          },
        },
        aiExplanations: true,
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return question;
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    const existingQuestion = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Nếu có examId mới, kiểm tra xem exam có tồn tại không
    if (updateQuestionDto.examId) {
      const exam = await this.prisma.exam.findUnique({
        where: { id: updateQuestionDto.examId },
      });

      if (!exam) {
        throw new NotFoundException(`Exam with ID ${updateQuestionDto.examId} not found`);
      }
    }

    return this.prisma.question.update({
      where: { id },
      data: updateQuestionDto,
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
        answerOptions: true,
      },
    });
  }

  async remove(id: number) {
    const existingQuestion = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    return this.prisma.question.delete({
      where: { id },
    });
  }

  async findByExam(examId: number) {
    return this.prisma.question.findMany({
      where: { examId },
      include: {
        answerOptions: {
          orderBy: {
            optionLabel: 'asc',
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
  }

  async getQuestionStats(id: number) {
    const question = await this.findOne(id);
    
    const totalOptions = question.answerOptions.length;
    const correctOptions = question.answerOptions.filter(option => option.isCorrect).length;

    return {
      ...question,
      stats: {
        totalOptions,
        correctOptions,
        hasMultipleCorrectAnswers: correctOptions > 1,
      },
    };
  }
}
