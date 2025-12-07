import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateInstructorDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  paymentAccount?: string;

  @IsOptional()
  @IsString()
  teachingField?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
