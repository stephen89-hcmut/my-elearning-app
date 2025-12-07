// src/pages/Dashboard.tsx
import React from 'react';
import { Row, Col, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { StatisticsCards } from '@/components';
import { getDashboardStats } from '@/api/courses';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const loading = statsLoading;

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

      </Spin>
    </div>
  );
};

export default Dashboard;
