import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FindAllOrderDto } from './dto/find-all-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    // Kiểm tra user có tồn tại không
    const user = await this.prisma.user.findUnique({
      where: { id: createOrderDto.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${createOrderDto.userId} not found`);
    }

    // Kiểm tra các course có tồn tại không
    const courseIds = createOrderDto.items.map(item => item.courseId);
    const courses = await this.prisma.course.findMany({
      where: { id: { in: courseIds } },
    });

    if (courses.length !== courseIds.length) {
      const foundIds = courses.map(course => course.id);
      const missingIds = courseIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Courses with IDs ${missingIds.join(', ')} not found`);
    }

    // Tạo order với items
    return this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        status: createOrderDto.status || 'Pending',
        totalAmount: createOrderDto.totalAmount,
        currency: createOrderDto.currency || 'USD',
        paymentMethod: createOrderDto.paymentMethod,
        items: {
          create: createOrderDto.items.map(item => ({
            courseId: item.courseId,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        items: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
        payment: true,
      },
    });
  }

  async findAll(query: FindAllOrderDto) {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      userId,
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const take = limitNumber;
    const skip = (pageNumber - 1) * take;

    const where: any = {};

    // Add search filters
    if (search && search.trim()) {
      where.OR = [
        { id: { equals: parseInt(search) || 0 } },
        { user: { fullName: { contains: search.trim() } } },
        { user: { email: { contains: search.trim() } } },
      ];
    }

    // Add status filter
    if (status) {
      where.status = status;
    }

    // Add userId filter
    if (userId) {
      where.userId = userId;
    }

    const orderBy = {
      [sortBy]: sortOrder,
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          items: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  price: true,
                  discountPrice: true,
                },
              },
            },
          },
          payment: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        pageNumber,
        limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phoneNumber: true,
            address: true,
          },
        },
        items: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                discountPrice: true,
                coverImage: true,
              },
            },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Nếu có paymentId, kiểm tra payment có tồn tại không
    if (updateOrderDto.paymentId) {
      const payment = await this.prisma.payment.findUnique({
        where: { id: updateOrderDto.paymentId },
      });

      if (!payment) {
        throw new NotFoundException(`Payment with ID ${updateOrderDto.paymentId} not found`);
      }
    }

    return this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        items: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
        payment: true,
      },
    });
  }

  async remove(id: number) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.order.delete({
      where: { id },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
                discountPrice: true,
                coverImage: true,
              },
            },
          },
        },
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStatus(id: number, status: string) {
    const validStatuses = ['Pending', 'Paid', 'Cancelled', 'Refunded'];
    
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const existingOrder = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        items: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
        payment: true,
      },
    });
  }

  async getOrderStats() {
    const [
      totalOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      refundedOrders,
      totalRevenue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'Pending' } }),
      this.prisma.order.count({ where: { status: 'Paid' } }),
      this.prisma.order.count({ where: { status: 'Cancelled' } }),
      this.prisma.order.count({ where: { status: 'Refunded' } }),
      this.prisma.order.aggregate({
        where: { status: 'Paid' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      refundedOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
  }
}
