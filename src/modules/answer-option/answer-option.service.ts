import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnswerOptionDto } from './dto/create-answer-option.dto';
import { UpdateAnswerOptionDto } from './dto/update-answer-option.dto';
import { FindAllAnswerOptionDto } from './dto/find-all-answer-option.dto';

@Injectable()
export class AnswerOptionService {
  constructor(private prisma: PrismaService) {}

  async create(createAnswerOptionDto: CreateAnswerOptionDto) {
    // Kiểm tra xem question có tồn tại không
    const question = await this.prisma.question.findUnique({
      where: { id: createAnswerOptionDto.questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${createAnswerOptionDto.questionId} not found`);
    }

    return this.prisma.answerOption.create({
      data: createAnswerOptionDto,
      include: {
        question: {
          select: {
            id: true,
            content: true,
            questionType: true,
            exam: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(query: FindAllAnswerOptionDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      questionId
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
        { optionLabel: { contains: search.trim() } },
      ];
    }
    
    // Add questionId filter
    if (questionId) {
      where.questionId = questionId;
    }

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [answerOptions, total] = await Promise.all([
      this.prisma.answerOption.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          question: {
            select: {
              id: true,
              content: true,
              questionType: true,
              exam: {
                select: {
                  id: true,
                  title: true,
                  difficulty: true,
                }
              }
            }
          }
        }
      }),
      this.prisma.answerOption.count({
        where: where,
      })
    ]);

    return {
      data: answerOptions,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const answerOption = await this.prisma.answerOption.findUnique({
      where: { id },
      include: {
        question: {
          include: {
            exam: {
              select: {
                id: true,
                title: true,
                difficulty: true,
              },
            },
          },
        },
      },
    });

    if (!answerOption) {
      throw new NotFoundException(`Answer option with ID ${id} not found`);
    }

    return answerOption;
  }

  async update(id: number, updateAnswerOptionDto: UpdateAnswerOptionDto) {
    const existingOption = await this.prisma.answerOption.findUnique({
      where: { id },
    });

    if (!existingOption) {
      throw new NotFoundException(`Answer option with ID ${id} not found`);
    }

    // Nếu có questionId mới, kiểm tra xem question có tồn tại không
    if (updateAnswerOptionDto.questionId) {
      const question = await this.prisma.question.findUnique({
        where: { id: updateAnswerOptionDto.questionId },
      });

      if (!question) {
        throw new NotFoundException(`Question with ID ${updateAnswerOptionDto.questionId} not found`);
      }
    }

    return this.prisma.answerOption.update({
      where: { id },
      data: updateAnswerOptionDto,
      include: {
        question: {
          select: {
            id: true,
            content: true,
            questionType: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingOption = await this.prisma.answerOption.findUnique({
      where: { id },
    });

    if (!existingOption) {
      throw new NotFoundException(`Answer option with ID ${id} not found`);
    }

    return this.prisma.answerOption.delete({
      where: { id },
    });
  }

  async findByQuestion(questionId: number) {
    return this.prisma.answerOption.findMany({
      where: { questionId },
      orderBy: {
        optionLabel: 'asc',
      },
      include: {
        question: {
          select: {
            id: true,
            content: true,
            questionType: true,
          },
        },
      },
    });
  }

  async getCorrectAnswers(questionId: number) {
    return this.prisma.answerOption.findMany({
      where: {
        questionId,
        isCorrect: true,
      },
      orderBy: {
        optionLabel: 'asc',
      },
      include: {
        question: {
          select: {
            id: true,
            content: true,
            questionType: true,
          },
        },
      },
    });
  }
}
