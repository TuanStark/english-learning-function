import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { FindAllDto } from 'src/common/global/find-all.dto';

@Injectable()
export class BlogPostService {
  constructor(private prisma: PrismaService) {}

  async create(createBlogPostDto: CreateBlogPostDto) {
    // Kiểm tra xem slug đã tồn tại chưa
    const existingPost = await this.prisma.blogPost.findUnique({
      where: { slug: createBlogPostDto.slug },
    });

    if (existingPost) {
      throw new ConflictException(`Blog post with slug "${createBlogPostDto.slug}" already exists`);
    }

    // Kiểm tra author và category có tồn tại không
    const [author, category] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: createBlogPostDto.authorId },
      }),
      this.prisma.blogCategory.findUnique({
        where: { id: createBlogPostDto.categoryId },
      }),
    ]);

    if (!author) {
      throw new NotFoundException(`Author with ID ${createBlogPostDto.authorId} not found`);
    }

    if (!category) {
      throw new NotFoundException(`Category with ID ${createBlogPostDto.categoryId} not found`);
    }

    // Tự động set publishedAt nếu status là Published
    const data = { ...createBlogPostDto };
    if (data.status === 'Published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    return this.prisma.blogPost.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            categoryName: true,
            slug: true,
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
      this.prisma.blogPost.findMany({
        where: where,
        orderBy: orderBy,
        skip,
        take,
        include: {
          category: true,
          author: true,
        }
      }),
      this.prisma.blogPost.count({
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

  async findPublished() {
    return this.prisma.blogPost.findMany({
      where: { status: 'Published' },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
          },
        },
        category: {
          select: {
            id: true,
            categoryName: true,
            slug: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            categoryName: true,
            slug: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
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

    if (!post) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
          },
        },
        category: {
          select: {
            id: true,
            categoryName: true,
            slug: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
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

    if (!post) {
      throw new NotFoundException(`Blog post with slug "${slug}" not found`);
    }

    // Tăng view count
    await this.prisma.blogPost.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return post;
  }

  async update(id: number, updateBlogPostDto: UpdateBlogPostDto) {
    const existingPost = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    // Kiểm tra slug mới có bị trùng không (nếu có thay đổi slug)
    if (updateBlogPostDto.slug && updateBlogPostDto.slug !== existingPost.slug) {
      const duplicatePost = await this.prisma.blogPost.findUnique({
        where: { slug: updateBlogPostDto.slug },
      });

      if (duplicatePost) {
        throw new ConflictException(`Blog post with slug "${updateBlogPostDto.slug}" already exists`);
      }
    }

    // Tự động set publishedAt nếu status chuyển thành Published
    const updateData: any = { ...updateBlogPostDto };
    if (updateData.status === 'Published' && !existingPost.publishedAt && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
          },
        },
        category: {
          select: {
            id: true,
            categoryName: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const existingPost = await this.prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return this.prisma.blogPost.delete({
      where: { id },
    });
  }

  async searchPosts(searchTerm: string) {
    return this.prisma.blogPost.findMany({
      where: {
        status: 'Published',
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            content: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            excerpt: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
          },
        },
        category: {
          select: {
            id: true,
            categoryName: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
    });
  }

  async getPostStats(id: number) {
    const post = await this.findOne(id);
    
    const totalComments = post.comments.length;

    return {
      ...post,
      stats: {
        totalComments,
        viewCount: post.viewCount,
      },
    };
  }
}
