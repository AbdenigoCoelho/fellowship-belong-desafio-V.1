import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('movies')
export class MoviesController {
  private readonly logger = new Logger(MoviesController.name);

  constructor(private readonly moviesService: MoviesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    this.logger.log('POST /movies');
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('genre') genre?: string,
    @Query('releaseYear') releaseYear?: string,
    @Query('sortBy') sortBy?: 'title' | 'releaseYear' | 'averageRating',
    @Query('order') order?: 'asc' | 'desc',
  ) {
    this.logger.log('GET /movies (public)');
    return this.moviesService.findAll({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      search,
      genre,
      releaseYear: releaseYear ? parseInt(releaseYear, 10) : undefined,
      sortBy,
      order,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`GET /movies/${id} (public)`);
    return this.moviesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMovieDto: UpdateMovieDto) {
    this.logger.log(`PATCH /movies/${id}`);
    return this.moviesService.update(id, updateMovieDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`DELETE /movies/${id}`);
    return this.moviesService.remove(id);
  }
}
