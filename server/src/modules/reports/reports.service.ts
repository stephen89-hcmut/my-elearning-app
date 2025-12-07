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
      "SELECT COALESCE(SUM(price), 0) as total FROM TRANSACTIONS WHERE payment_status = 'completed'",
    ))[0];
    const totalRevenue = Number(revenueRow?.total || 0);

    const studentsRow = (await this.dataSource.query(
      'SELECT COUNT(*) as total FROM STUDENTS',
    ))[0];
    const instructorsRow = (await this.dataSource.query(
      'SELECT COUNT(*) as total FROM INSTRUCTORS',
    ))[0];

    return {
      totalRevenue: `$${totalRevenue.toFixed(2)}`,
      totalCourses,
      totalStudents: Number(studentsRow?.total || 0),
      totalInstructors: Number(instructorsRow?.total || 0),
      avgRating: 0,
    };
  }

  async getMonthlyRevenue(month?: number, year?: number) {
    const monthly = await this.dataSource.query(
      `SELECT DATE_FORMAT(payment_date, '%b') as month, SUM(price) as revenue
       FROM TRANSACTIONS
       WHERE payment_status = 'completed'
       GROUP BY MONTH(payment_date), DATE_FORMAT(payment_date, '%b')
       ORDER BY MONTH(payment_date)`
    );

    return monthly.map((row: any) => ({
      month: row.month,
      revenue: Number(row.revenue || 0),
    }));
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
