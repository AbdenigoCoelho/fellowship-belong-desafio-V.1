import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExportService } from './export.service';
import { ExportQueryDto } from './dto/export-query.dto';

interface AuthenticatedRequest {
  user: { id: number; email: string };
}

@UseGuards(AuthGuard('jwt'))
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('movie-list')
  exportMovieList(@Request() req: AuthenticatedRequest, @Query() query: ExportQueryDto) {
    return this.exportService.exportMovieList(req.user.id, req.user.email, query.format);
  }

  @Get('ratings')
  exportRatings(@Request() req: AuthenticatedRequest, @Query() query: ExportQueryDto) {
    return this.exportService.exportRatings(req.user.id, req.user.email, query.format);
  }
}
