import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVocabularyExampleDto } from './dto/create-vocabulary-example.dto';
import { UpdateVocabularyExampleDto } from './dto/update-vocabulary-example.dto';
import { FindAllDto } from 'src/common/global/find-all.dto';

@Injectable()
export class VocabularyExampleService {
  constructor(private prisma: PrismaService) {}

  async create(createVocabularyExampleDto: CreateVocabularyExampleDto) {
    // Kiểm tra xem vocabulary có tồn tại không
    const vocabulary = await this.prisma.vocabulary.findUnique({
      where: { id: createVocabularyExampleDto.vocabularyId },
    });

    if (!vocabulary) {
      throw new NotFoundException(
        `Vocabulary with ID ${createVocabularyExampleDto.vocabularyId} not found`
      );
    }

    return this.prisma.vocabularyExample.create({
      data: createVocabularyExampleDto,
      include: {
        vocabulary: {
          select: {
            id: true,
            englishWord: true,
            vietnameseMeaning: true,
          },
        },
      },
    });
  }

  async findAll(query: FindAllDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new Error('Page and limit must be greater than 0');
    }

    const take = limitNumber;
    const skip = (pageNumber - 1) * take;

    const searchUpCase = search.charAt(0).toUpperCase() + search.slice(1);
    const where = search
      ? {
        OR: [
          { englishSentence: { contains: searchUpCase } },
        ]
      }
      : {};
    const orderBy = {
      [sortBy]: sortOrder
    };

    const [examples, total] = await Promise.all([
      this.prisma.vocabularyExample.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          vocabulary: {
            select: {
              id: true,
              englishWord: true,
              vietnameseMeaning: true,
            },
          },
        }
      }),
      this.prisma.vocabularyExample.count({
        where: where,
      })
    ])

    return {
      data: examples,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const example = await this.prisma.vocabularyExample.findUnique({
      where: { id },
      include: {
        vocabulary: {
          include: {
            topic: {
              select: {
                id: true,
                topicName: true,
              },
            },
          },
        },
      },
    });

    if (!example) {
      throw new NotFoundException(`Vocabulary example with ID ${id} not found`);
    }

    return example;
  }

  async update(id: number, updateVocabularyExampleDto: UpdateVocabularyExampleDto) {
    const existingExample = await this.prisma.vocabularyExample.findUnique({
      where: { id },
    });

    if (!existingExample) {
      throw new NotFoundException(`Vocabulary example with ID ${id} not found`);
    }

    // Nếu có vocabularyId mới, kiểm tra xem vocabulary có tồn tại không
    if (updateVocabularyExampleDto.vocabularyId) {
      const vocabulary = await this.prisma.vocabulary.findUnique({
        where: { id: updateVocabularyExampleDto.vocabularyId },
      });

      if (!vocabulary) {
        throw new NotFoundException(
          `Vocabulary with ID ${updateVocabularyExampleDto.vocabularyId} not found`
        );
      }
    }

    return this.prisma.vocabularyExample.update({
      where: { id },
      data: updateVocabularyExampleDto,
      include: {
        vocabulary: {
          select: {
            id: true,
            englishWord: true,
            vietnameseMeaning: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingExample = await this.prisma.vocabularyExample.findUnique({
      where: { id },
    });

    if (!existingExample) {
      throw new NotFoundException(`Vocabulary example with ID ${id} not found`);
    }

    return this.prisma.vocabularyExample.delete({
      where: { id },
    });
  }

  async findByVocabulary(vocabularyId: number) {
    return this.prisma.vocabularyExample.findMany({
      where: { vocabularyId },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
