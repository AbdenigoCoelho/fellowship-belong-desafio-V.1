import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  movieId!: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;
}
