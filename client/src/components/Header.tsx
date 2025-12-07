// src/components/Header.tsx
import React from 'react';
import { Layout, Input, Button, Badge } from 'antd';
import {
  BellOutlined,
} from '@ant-design/icons';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1 }}>
        <span style={{ color: '#666', fontSize: 14 }}>
          <span style={{ color: '#1890ff' }}>Home</span> / Courses
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Input
          placeholder="Search for courses..."
          style={{ width: 250 }}
          bordered={false}
          prefix="🔍"
        />
        <Badge count={3} color="#ff4d4f">
          <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
        </Badge>
      </div>
    </Header>
  );
};

export default AppHeader;
