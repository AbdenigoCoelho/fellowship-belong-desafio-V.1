import { IsString, IsOptional, IsInt, IsNumber, Min, Max, MaxLength } from 'class-validator';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear())
  releaseYear?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  genre?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;
}
