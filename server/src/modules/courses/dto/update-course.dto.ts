// src/modules/courses/dto/update-course.dto.ts
import {
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
  Max,
} from 'class-validator';
import { CourseLevel } from '@/common/enums';

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  courseName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  minScore?: number;

  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;
}
