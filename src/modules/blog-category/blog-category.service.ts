import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { FindAllDto } from 'src/common/global/find-all.dto';

@Injectable()
export class BlogCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createBlogCategoryDto: CreateBlogCategoryDto) {
    // Kiểm tra xem slug đã tồn tại chưa
    const existingCategory = await this.prisma.blogCategory.findUnique({
      where: { slug: createBlogCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException(`Blog category with slug "${createBlogCategoryDto.slug}" already exists`);
    }

    return this.prisma.blogCategory.create({
      data: createBlogCategoryDto,
      include: {
        blogPosts: {
          select: {
            id: true,
            title: true,
            status: true,
            publishedAt: true,
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
      sortOrder = 'asc',
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
        { title: { contains: search.trim() } }
      ];
    }
    const orderBy = {
      [sortBy]: sortOrder
    };

    const [grammars, total] = await Promise.all([
      this.prisma.blogCategory.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
      }),
      this.prisma.blogCategory.count({
        where: where,
      })
    ]);

    return {
      data: grammars,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
      include: {
        blogPosts: {
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
          orderBy: {
            publishedAt: 'desc',
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Blog category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { slug },
      include: {
        blogPosts: {
          where: { status: 'Published' },
          include: {
            author: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
          orderBy: {
            publishedAt: 'desc',
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Blog category with slug "${slug}" not found`);
    }

    return category;
  }

  async update(id: number, updateBlogCategoryDto: UpdateBlogCategoryDto) {
    const existingCategory = await this.prisma.blogCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Blog category with ID ${id} not found`);
    }

    // Kiểm tra slug mới có bị trùng không (nếu có thay đổi slug)
    if (updateBlogCategoryDto.slug && updateBlogCategoryDto.slug !== existingCategory.slug) {
      const duplicateCategory = await this.prisma.blogCategory.findUnique({
        where: { slug: updateBlogCategoryDto.slug },
      });

      if (duplicateCategory) {
        throw new ConflictException(`Blog category with slug "${updateBlogCategoryDto.slug}" already exists`);
      }
    }

    return this.prisma.blogCategory.update({
      where: { id },
      data: updateBlogCategoryDto,
      include: {
        blogPosts: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingCategory = await this.prisma.blogCategory.findUnique({
      where: { id },
      include: {
        blogPosts: true,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Blog category with ID ${id} not found`);
    }

    // Kiểm tra xem có bài viết nào đang sử dụng category này không
    if (existingCategory.blogPosts.length > 0) {
      throw new ConflictException(
        `Cannot delete category "${existingCategory.categoryName}" because it contains ${existingCategory.blogPosts.length} blog post(s)`
      );
    }

    return this.prisma.blogCategory.delete({
      where: { id },
    });
  }

  async getCategoryStats(id: number) {
    const category = await this.findOne(id);
    
    const totalPosts = category.blogPosts.length;
    const publishedPosts = category.blogPosts.filter(post => post.status === 'Published').length;
    const draftPosts = category.blogPosts.filter(post => post.status === 'Draft').length;
    const totalViews = category.blogPosts.reduce((sum, post) => sum + post.viewCount, 0);

    return {
      ...category,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews,
      },
    };
  }
}
