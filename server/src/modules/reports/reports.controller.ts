// src/modules/reports/reports.controller.ts
import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard-stats')
  getDashboardStats() {
    return this.reportsService.getDashboardStats();
  }

  // Alias to match frontend call /reports/statistics
  @Get('statistics')
  getDashboardStatsAlias() {
    return this.reportsService.getDashboardStats();
  }

  @Get('monthly-revenue')
  getMonthlyRevenue(
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
  ) {
    return this.reportsService.getMonthlyRevenue(month, year);
  }

  // Alias to match frontend call /reports/revenue
  @Get('revenue')
  getRevenueAlias(
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
    @Query('year', new ParseIntPipe({ optional: true })) year?: number,
  ) {
    return this.reportsService.getMonthlyRevenue(month, year);
  }

  @Get('course-stats')
  getCourseStats() {
    return this.reportsService.getCourseStats();
  }
}
