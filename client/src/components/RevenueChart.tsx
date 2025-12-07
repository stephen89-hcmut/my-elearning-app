// src/components/RevenueChart.tsx
import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlyRevenue } from '@/types';

interface RevenueChartProps {
  data: MonthlyRevenue[];
  title?: string;
  subtitle?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  title = 'Monthly Revenue Report',
  subtitle = 'Visualizing revenue trends throughout the year',
}) => {
  const revenueByMonth = new Map(
    data.map((item) => [item.month.toLowerCase(), item.revenue]),
  );

  const normalizedData = MONTHS.map((month) => ({
    month,
    revenue: revenueByMonth.get(month.toLowerCase()) ?? 0,
  }));

  return (
    <Card
      title={title}
      bordered={false}
      headStyle={{ border: 'none', paddingBottom: 0 }}
      bodyStyle={{ paddingTop: 8 }}
      style={{ boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: 8 }}
    >
      <div style={{ marginBottom: 12, color: '#6b7280' }}>{subtitle}</div>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart
          data={normalizedData}
          margin={{ top: 10, right: 24, left: 0, bottom: 12 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#9ca3af' }}
            tickLine={{ stroke: '#9ca3af' }}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            axisLine={{ stroke: '#9ca3af' }}
            tickLine={{ stroke: '#9ca3af' }}
            label={{
              value: 'Revenue ($)',
              angle: -90,
              position: 'insideLeft',
              offset: -5,
              style: { fill: '#6b7280', fontSize: 12 },
            }}
          />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
            contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: 4 }}
          />
          <Bar dataKey="revenue" fill="#1890ff" barSize={48} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
