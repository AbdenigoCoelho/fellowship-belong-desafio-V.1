import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ExportService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  private toCsv(rows: Record<string, unknown>[]): string {
    if (rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    const lines = rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','));
    return [headers.join(','), ...lines].join('\n');
  }

  private buildFile(data: Record<string, unknown>[], format: 'csv' | 'json', prefix: string) {
    const filename = `${prefix}-${randomUUID()}.${format}`;
    const content =
      format === 'json'
        ? Buffer.from(JSON.stringify(data, null, 2), 'utf-8')
        : Buffer.from(this.toCsv(data), 'utf-8');
    return { filename, content };
  }

  async exportMovieList(userId: number, email: string, format: 'csv' | 'json') {
    const items = await this.prisma.movieList.findMany({
      where: { userId },
      include: { movie: true },
    });

    const data = items.map((item) => ({
      id: item.id,
      movieId: item.movieId,
      title: item.movie.title,
      genre: item.movie.genre,
      releaseYear: item.movie.releaseYear,
      addedAt: item.addedAt,
    }));

    const { filename, content } = this.buildFile(data, format, 'movie-list');
    await this.mailService.sendFile(email, 'Sua lista pessoal de filmes', filename, content);
    return { message: 'Exportação enviada para seu e-mail', filename };
  }

  async exportRatings(userId: number, email: string, format: 'csv' | 'json') {
    const items = await this.prisma.rating.findMany({
      where: { userId },
      include: { movie: true },
    });

    const data = items.map((item) => ({
      id: item.id,
      movieId: item.movieId,
      title: item.movie.title,
      score: item.score,
      updatedAt: item.updatedAt,
    }));

    const { filename, content } = this.buildFile(data, format, 'ratings');
    await this.mailService.sendFile(email, 'Suas avaliações de filmes', filename, content);
    return { message: 'Exportação enviada para seu e-mail', filename };
  }
}
