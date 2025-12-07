// src/modules/courses/dto/update-course.dto.ts
import {
  IsString,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
  Max,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
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

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  instructorIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  topicIds?: string[];
}
