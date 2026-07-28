import { IsString, IsOptional, IsInt, IsNumber, Min, Max, MaxLength } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  releaseYear: number;

  @IsString()
  @MaxLength(100)
  genre: string;

  @IsNumber()
  @Min(1)
  duration: number;
}
