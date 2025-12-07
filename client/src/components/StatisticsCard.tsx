// src/components/StatisticsCard.tsx
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  color?: string;
  icon?: React.ReactNode;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  color = '#1890ff',
  icon,
}) => {
  return (
    <Card
      bordered={false}
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
            {title}
          </div>
          <Statistic value={value} valueStyle={{ color, fontSize: 28, fontWeight: 600 }} />
        </div>
        {icon && <div style={{ fontSize: 32, color }}>{icon}</div>}
      </div>
    </Card>
  );
};

export const StatisticsCards: React.FC<{
  totalRevenue: string;
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
  avgRating: number;
}> = ({ totalRevenue, totalCourses, totalStudents, totalInstructors, avgRating }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Total Revenue"
          value={totalRevenue}
          color="#52c41a"
          icon="💰"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Total Courses"
          value={totalCourses}
          color="#1890ff"
          icon="📚"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Total Students"
          value={totalStudents}
          color="#faad14"
          icon="👥"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Total Instructors"
          value={totalInstructors}
          color="#722ed1"
          icon="👨‍🏫"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Avg Rating"
          value={avgRating}
          color="#eb2f96"
          icon="⭐"
        />
      </Col>
    </Row>
  );
};

export default StatisticsCard;
