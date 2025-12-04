// src/components/Sidebar.tsx
import React from 'react';
import { Menu, Layout } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      key: '/courses',
      icon: <BookOutlined />,
      label: 'Courses Management',
      onClick: () => navigate('/courses'),
    },
    {
      key: '/students',
      icon: <TeamOutlined />,
      label: 'Students',
      onClick: () => navigate('/students'),
    },
    {
      key: '/instructors',
      icon: <UserOutlined />,
      label: 'Instructors',
      onClick: () => navigate('/instructors'),
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
      onClick: () => navigate('/reports'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <Sider
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        background: 'linear-gradient(180deg, #001529 0%, #002c52 100%)',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 24,
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {collapsed ? 'EC' : 'EduCore'}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname || '/']}
        items={menuItems}
        style={{ background: 'transparent' }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          width: '100%',
          padding: '0 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: 16,
          textAlign: 'center',
          color: '#fff',
          fontSize: 12,
        }}
      >
        <div style={{ marginBottom: 8 }}>👤</div>
        <div style={{ fontWeight: 'bold' }}>SManager</div>
      </div>
    </Sider>
  );
};

export default Sidebar;
