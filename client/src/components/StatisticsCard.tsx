// src/components/StatisticsCard.tsx
import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  trend?: number; // positive or negative percentage
  trendLabel?: string;
  color?: string;
  icon?: React.ReactNode;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  trend,
  trendLabel,
  color = '#1890ff',
  icon,
}) => {
  const isTrendPositive = trend && trend >= 0;

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
          {trend !== undefined && (
            <div
              style={{
                marginTop: 8,
                color: isTrendPositive ? '#52c41a' : '#ff4d4f',
                fontSize: 12,
              }}
            >
              {isTrendPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              {' '}
              {Math.abs(trend)}% {trendLabel || 'from last month'}
            </div>
          )}
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
  avgRating: number;
}> = ({ totalRevenue, totalCourses, totalStudents, avgRating }) => {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Total Revenue"
          value={totalRevenue}
          trend={5}
          trendLabel="increase"
          color="#52c41a"
          icon="💰"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Total Courses"
          value={totalCourses}
          trend={2}
          trendLabel="new courses"
          color="#1890ff"
          icon="📚"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Total Students"
          value={totalStudents}
          trend={8}
          trendLabel="enrollment growth"
          color="#faad14"
          icon="👥"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatisticsCard
          title="Avg Rating"
          value={avgRating}
          trend={1}
          trendLabel="improvement"
          color="#eb2f96"
          icon="⭐"
        />
      </Col>
    </Row>
  );
};

export default StatisticsCard;
