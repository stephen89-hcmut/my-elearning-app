// src/modules/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Course } from '@/modules/courses/entities';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    private dataSource: DataSource,
  ) {}

  async getDashboardStats() {
    // This can call a stored procedure or perform aggregation
    const totalCourses = await this.coursesRepository.count();
    const totalRevenue = (await this.dataSource.query(
      'SELECT SUM(price) as total FROM COURSES',
    ))[0]?.total || 0;

    return {
      totalRevenue: `$${totalRevenue || '0.00'}`,
      totalCourses,
      totalStudents: 1203, // Mock for now
      avgRating: 4.8, // Mock for now
    };
  }

  async getMonthlyRevenue(month?: number, year?: number) {
    // Mock monthly revenue data
    const monthlyData = [
      { month: 'Jan', revenue: 4000 },
      { month: 'Feb', revenue: 3000 },
      { month: 'Mar', revenue: 2000 },
      { month: 'Apr', revenue: 2780 },
      { month: 'May', revenue: 1890 },
      { month: 'Jun', revenue: 2390 },
      { month: 'Jul', revenue: 3490 },
      { month: 'Aug', revenue: 2100 },
      { month: 'Sep', revenue: 2800 },
      { month: 'Oct', revenue: 3200 },
      { month: 'Nov', revenue: 2600 },
      { month: 'Dec', revenue: 3100 },
    ];

    // In production, call stored procedure:
    // return this.dataSource.query('CALL sp_GetMonthlyRevenue(?, ?)', [month, year]);

    return monthlyData;
  }

  async getCourseStats() {
    const stats = await this.dataSource.query(
      `SELECT 
        COUNT(*) as totalCourses,
        AVG(price) as avgPrice,
        MAX(price) as maxPrice,
        MIN(price) as minPrice
      FROM COURSES`,
    );

    return stats[0];
  }
}
