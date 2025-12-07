// src/pages/Dashboard.tsx
import React from 'react';
import { Row, Col, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { StatisticsCards, RevenueChart } from '@/components';
import { getDashboardStats, getMonthlyRevenue } from '@/api/courses';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['monthlyRevenue'],
    queryFn: getMonthlyRevenue,
  });

  const loading = statsLoading || revenueLoading;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Spin spinning={loading} tip="Loading...">
        {stats && (
          <StatisticsCards
            totalRevenue={stats.totalRevenue}
            totalCourses={stats.totalCourses}
            totalStudents={stats.totalStudents}
            totalInstructors={stats.totalInstructors}
            avgRating={stats.avgRating}
          />
        )}

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            {revenueData && <RevenueChart data={revenueData} />}
          </Col>
        </Row>

      </Spin>
    </div>
  );
};

export default Dashboard;
