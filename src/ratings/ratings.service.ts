import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { QueryRatingDto } from './dto/query-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  private async recalculateMovieRating(movieId: number) {
    const agg = await this.prisma.rating.aggregate({
      where: { movieId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        averageRating: agg._avg.score ?? 0,
        totalRatings: agg._count.score,
      },
    });
  }

  async create(userId: number, dto: CreateRatingDto) {
    const movie = await this.prisma.movie.findUnique({ where: { id: dto.movieId } });
    if (!movie) {
      throw new NotFoundException('Filme não encontrado no catálogo');
    }

    // Se já existe avaliação do usuário para esse filme, atualiza em vez de duplicar
    const rating = await this.prisma.rating.upsert({
      where: { userId_movieId: { userId, movieId: dto.movieId } },
      update: { score: dto.score },
      create: { userId, movieId: dto.movieId, score: dto.score },
    });

    await this.recalculateMovieRating(dto.movieId);
    return rating;
  }

  async findAllByUser(userId: number, query: QueryRatingDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.rating.findMany({
        where: { userId },
        include: { movie: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rating.count({ where: { userId } }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(userId: number, id: number, dto: UpdateRatingDto) {
    const rating = await this.prisma.rating.findFirst({ where: { id, userId } });
    if (!rating) {
      throw new NotFoundException('Avaliação não encontrada');
    }

    const updated = await this.prisma.rating.update({
      where: { id },
      data: { score: dto.score },
    });

    await this.recalculateMovieRating(rating.movieId);
    return updated;
  }
}
