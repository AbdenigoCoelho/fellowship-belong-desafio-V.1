import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieListDto } from './dto/create-movie-list.dto';
import { QueryMovieListDto } from './dto/query-movie-list.dto';

@Injectable()
export class MovieListService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateMovieListDto) {
    // Validação: filme deve existir no catálogo
    const movie = await this.prisma.movie.findUnique({ where: { id: dto.movieId } });
    if (!movie) {
      throw new NotFoundException('Filme não encontrado no catálogo');
    }

    // Validação: não permite duplicar
    const existing = await this.prisma.movieList.findUnique({
      where: { userId_movieId: { userId, movieId: dto.movieId } },
    });
    if (existing) {
      throw new ConflictException('Este filme já está na sua lista');
    }

    return this.prisma.movieList.create({
      data: { userId, movieId: dto.movieId },
      include: { movie: true },
    });
  }

  async findAll(userId: number, query: QueryMovieListDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.movieList.findMany({
        where: { userId },
        include: { movie: true },
        skip,
        take: limit,
        orderBy: { addedAt: 'desc' },
      }),
      this.prisma.movieList.count({ where: { userId } }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async remove(userId: number, id: number) {
    // Validação: usuário só pode remover filmes da própria lista
    const item = await this.prisma.movieList.findFirst({ where: { id, userId } });
    if (!item) {
      throw new NotFoundException('Item não encontrado na sua lista');
    }
    await this.prisma.movieList.delete({ where: { id } });
    // O filme no catálogo (tabela movies) permanece intacto — só removemos o vínculo
  }
}
