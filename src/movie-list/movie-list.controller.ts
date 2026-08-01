import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovieListService } from './movie-list.service';
import { CreateMovieListDto } from './dto/create-movie-list.dto';
import { QueryMovieListDto } from './dto/query-movie-list.dto';

interface AuthenticatedRequest {
  user: { id: number; email: string };
}

@UseGuards(AuthGuard('jwt'))
@Controller('movie-list')
export class MovieListController {
  constructor(private readonly movieListService: MovieListService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateMovieListDto) {
    return this.movieListService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest, @Query() query: QueryMovieListDto) {
    return this.movieListService.findAll(req.user.id, query);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.movieListService.remove(req.user.id, +id);
  }
}
