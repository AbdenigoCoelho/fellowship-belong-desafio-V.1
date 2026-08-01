import { IsInt } from 'class-validator';

export class CreateMovieListDto {
  @IsInt()
  movieId!: number;
}
