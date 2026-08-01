import { Module } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import { MovieListController } from './movie-list.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MovieListController],
  providers: [MovieListService],
})
export class MovieListModule {}
