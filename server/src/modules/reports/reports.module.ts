// src/modules/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Course } from '@/modules/courses/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
