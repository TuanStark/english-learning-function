import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

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

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    
    return this.prisma.blogCategory.findMany({
      where,
      include: {
        blogPosts: {
          where: { status: 'Published' },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            publishedAt: true,
            viewCount: true,
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });
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
