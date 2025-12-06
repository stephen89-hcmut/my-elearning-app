// src/components/Sidebar.tsx
import React from 'react';
import { Menu, Layout, Button, Avatar, Divider, Popconfirm, message } from 'antd';
import {
  HomeOutlined,
  BookOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const { Sider } = Layout;

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const roleLabelMap: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'admin',
    [UserRole.INSTRUCTOR]: 'instructor',
    [UserRole.STUDENT]: 'student',
  };

  const roleLabel = user?.role !== undefined ? roleLabelMap[user.role as UserRole] : undefined;

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
          textAlign: 'center',
        }}
      >
        <Divider style={{ margin: '12px 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Avatar
            size={36}
            style={{ backgroundColor: '#1890ff' }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          {!collapsed && (
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: 11 }}>
                {roleLabel}
              </div>
            </div>
          )}
        </div>
        <Popconfirm
          title="Logout"
          description="Are you sure you want to logout?"
          onConfirm={() => {
            logout();
            message.success('Logged out successfully');
            navigate('/login');
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="primary"
            danger
            block
            icon={<LogoutOutlined />}
            size="small"
          >
            {collapsed ? '' : 'Logout'}
          </Button>
        </Popconfirm>
      </div>
    </Sider>
  );
};

export default Sidebar;
