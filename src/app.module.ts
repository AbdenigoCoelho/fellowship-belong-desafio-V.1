import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { MovieListModule } from './movie-list/movie-list.module';
import { RatingsModule } from './ratings/ratings.module';
import { MailModule } from './mail/mail.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    MoviesModule,
    MovieListModule,
    RatingsModule,
    MailModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
