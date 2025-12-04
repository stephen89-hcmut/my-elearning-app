// src/modules/courses/dto/create-course.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
  IsArray,
  Max,
} from 'class-validator';
import { CourseLevel } from '@/common/enums';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  courseName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  language: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  minScore?: number;

  @IsEnum(CourseLevel)
  @IsOptional()
  level?: CourseLevel;

  @IsArray()
  @IsNumber({}, { each: true })
  topicIds: number[];
}
