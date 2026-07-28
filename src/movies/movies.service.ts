import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

export interface FindAllMoviesParams {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  releaseYear?: number;
  sortBy?: 'title' | 'releaseYear' | 'averageRating';
  order?: 'asc' | 'desc';
}

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    this.logger.log(`Creating movie: ${createMovieDto.title}`);
    return this.prisma.movie.create({ data: createMovieDto });
  }

  async findAll(params: FindAllMoviesParams) {
    const {
      page = 1,
      limit = 10,
      search,
      genre,
      releaseYear,
      sortBy = 'title',
      order = 'asc',
    } = params;

    this.logger.log(
      `Fetching movies - page: ${page}, limit: ${limit}, search: ${search}, genre: ${genre}`,
    );

    const where: Record<string, unknown> = {};
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (genre) where.genre = { equals: genre, mode: 'insensitive' };
    if (releaseYear) where.releaseYear = releaseYear;

    const [data, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.movie.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    this.logger.log(`Fetching movie id: ${id}`);
    const movie = await this.prisma.movie.findUnique({ where: { id } });
    if (!movie) throw new NotFoundException(`Movie #${id} not found`);
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    this.logger.log(`Updating movie id: ${id}`);
    await this.findOne(id);
    return this.prisma.movie.update({ where: { id }, data: updateMovieDto });
  }

  async remove(id: number) {
    this.logger.log(`Deleting movie id: ${id}`);
    await this.findOne(id);
    await this.prisma.movie.delete({ where: { id } });
  }

  async updateAverageRating(movieId: number) {
    const stats = await this.prisma.rating.aggregate({
      where: { movieId },
      _avg: { score: true },
      _count: { score: true },
    });

    await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        averageRating: stats._avg.score ?? 0,
        totalRatings: stats._count.score,
      },
    });
  }
}
