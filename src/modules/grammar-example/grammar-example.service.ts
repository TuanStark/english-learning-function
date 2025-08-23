import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGrammarExampleDto } from './dto/create-grammar-example.dto';
import { UpdateGrammarExampleDto } from './dto/update-grammar-example.dto';
import { FindAll } from './dto/find-all.dto';

@Injectable()
export class GrammarExampleService {
  constructor(private prisma: PrismaService) {}

  async create(createGrammarExampleDto: CreateGrammarExampleDto) {
    // Kiểm tra xem grammar có tồn tại không
    const grammar = await this.prisma.grammar.findUnique({
      where: { id: createGrammarExampleDto.grammarId },
    });

    if (!grammar) {
      throw new NotFoundException(
        `Grammar with ID ${createGrammarExampleDto.grammarId} not found`
      );
    }

    return this.prisma.grammarExample.create({
      data: createGrammarExampleDto,
      include: {
        grammar: {
          select: {
            id: true,
            title: true,
            difficultyLevel: true,
          },
        },
      },
    });
  }

  async findAll(query: FindAll) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'asc',
      difficultyLevel,
      grammarId,
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
    
    // Add search filters for grammar examples
    if (search && search.trim()) {
      where.OR = [
        { englishSentence: { contains: search.trim() } },
        { vietnameseSentence: { contains: search.trim() } },
        { grammar: { title: { contains: search.trim() } } },
      ];
    }
    
    // Add grammarId filter
    if (grammarId) {
      where.grammarId = grammarId;
    }
    
    // Add difficultyLevel filter through grammar relation
    if (difficultyLevel) {
      where.grammar = {
        difficultyLevel: difficultyLevel
      };
    }
    
    // Note: GrammarExample doesn't have isActive field, so includeInactive is not used

    const orderBy = {
      [sortBy]: sortOrder
    };

    const [grammarExamples, total] = await Promise.all([
      this.prisma.grammarExample.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          grammar: {
            select: {
              id: true,
              title: true,
              difficultyLevel: true,
              content: true,
            }
          }
        }
      }),
      this.prisma.grammarExample.count({
        where: where,
      })
    ]);

    return {
      data: grammarExamples,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const example = await this.prisma.grammarExample.findUnique({
      where: { id },
      include: {
        grammar: {
          select: {
            id: true,
            title: true,
            content: true,
            difficultyLevel: true,
          },
        },
      },
    });

    if (!example) {
      throw new NotFoundException(`Grammar example with ID ${id} not found`);
    }

    return example;
  }

  async update(id: number, updateGrammarExampleDto: UpdateGrammarExampleDto) {
    const existingExample = await this.prisma.grammarExample.findUnique({
      where: { id },
    });

    if (!existingExample) {
      throw new NotFoundException(`Grammar example with ID ${id} not found`);
    }

    // Nếu có grammarId mới, kiểm tra xem grammar có tồn tại không
    if (updateGrammarExampleDto.grammarId) {
      const grammar = await this.prisma.grammar.findUnique({
        where: { id: updateGrammarExampleDto.grammarId },
      });

      if (!grammar) {
        throw new NotFoundException(
          `Grammar with ID ${updateGrammarExampleDto.grammarId} not found`
        );
      }
    }

    return this.prisma.grammarExample.update({
      where: { id },
      data: updateGrammarExampleDto,
      include: {
        grammar: {
          select: {
            id: true,
            title: true,
            difficultyLevel: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingExample = await this.prisma.grammarExample.findUnique({
      where: { id },
    });

    if (!existingExample) {
      throw new NotFoundException(`Grammar example with ID ${id} not found`);
    }

    return this.prisma.grammarExample.delete({
      where: { id },
    });
  }

  async findByGrammar(grammarId: number) {
    return this.prisma.grammarExample.findMany({
      where: { grammarId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async searchExamples(searchTerm: string) {
    return this.prisma.grammarExample.findMany({
      where: {
        OR: [
          {
            englishSentence: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            vietnameseSentence: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            explanation: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        grammar: {
          select: {
            id: true,
            title: true,
            difficultyLevel: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
