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
    const totalCourses = await this.coursesRepository.count();

    const revenueRow = (await this.dataSource.query(
      'SELECT f_GetTotalSystemRevenue() as totalRevenue',
    ))[0];
    const avgRatingRow = (await this.dataSource.query(
      'SELECT f_GetAverageRatingAllCourses() as avgRating',
    ))[0];

    const studentsRow = (await this.dataSource.query(
      'SELECT COUNT(*) as total FROM STUDENTS',
    ))[0];
    const instructorsRow = (await this.dataSource.query(
      'SELECT COUNT(*) as total FROM INSTRUCTORS',
    ))[0];

    const totalRevenue = Number(revenueRow?.totalRevenue || 0);
    const avgRating = Number(avgRatingRow?.avgRating || 0);

    return {
      totalRevenue: `$${totalRevenue.toFixed(2)}`,
      totalCourses,
      totalStudents: Number(studentsRow?.total || 0),
      totalInstructors: Number(instructorsRow?.total || 0),
      avgRating,
    };
  }

  async getMonthlyRevenue(month?: number, year?: number) {
    const monthly = await this.dataSource.query(
      `SELECT DATE_FORMAT(created_at, '%b') as month, SUM(price) as revenue
       FROM TRANSACTIONS
       WHERE payment_status = 'completed'
       GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
       ORDER BY MONTH(created_at)`
    );

    return monthly.map((row: any) => ({
      month: row.month,
      revenue: Number(row.revenue || 0),
    }));
  }

  // getRevenueReport removed per requirement to use f_GetTotalSystemRevenue instead

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
