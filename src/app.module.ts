import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { MovieListModule } from './movie-list/movie-list.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MoviesModule, MovieListModule, RatingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
