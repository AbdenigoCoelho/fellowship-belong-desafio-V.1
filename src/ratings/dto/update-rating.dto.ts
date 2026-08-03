import { IsNumber, Min, Max } from 'class-validator';

export class UpdateRatingDto {
  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;
}
