// src/modules/reports/reports.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Root endpoint for dashboard summary
  @Get()
  getReportsOverview() {
    return this.reportsService.getDashboardStats();
  }

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
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    const monthNum = month !== undefined && month !== null && month !== '' ? Number(month) : undefined;
    const yearNum = year !== undefined && year !== null && year !== '' ? Number(year) : undefined;
    return this.reportsService.getMonthlyRevenue(monthNum, yearNum);
  }

  @Get('course-stats')
  getCourseStats() {
    return this.reportsService.getCourseStats();
  }
}
