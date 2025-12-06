// src/components/RevenueChart.tsx
import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
  title?: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, title = 'Monthly Revenue Report' }) => {
  return (
    <Card
      title={title}
      bordered={false}
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Bar dataKey="revenue" fill="#1890ff" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
