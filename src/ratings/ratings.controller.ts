import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { QueryRatingDto } from './dto/query-rating.dto';

interface AuthenticatedRequest {
  user: { id: number; email: string };
}

@UseGuards(AuthGuard('jwt'))
@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() dto: CreateRatingDto) {
    return this.ratingsService.create(req.user.id, dto);
  }

  @Get('me')
  findMine(@Request() req: AuthenticatedRequest, @Query() query: QueryRatingDto) {
    return this.ratingsService.findAllByUser(req.user.id, query);
  }

  @Patch(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingsService.update(req.user.id, +id, dto);
  }
}
