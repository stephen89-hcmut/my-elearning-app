// src/components/Header.tsx
import React, { useMemo } from 'react';
import { Layout, Button, Badge } from 'antd';
import {
  BellOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumb = useMemo(() => {
    const path = location.pathname || '/';
    const segments = path.split('/').filter(Boolean);
    const labelMap: Record<string, string> = {
      courses: 'Courses',
      students: 'Students',
      instructors: 'Instructors',
      reports: 'Reports',
      settings: 'Settings',
      login: 'Login',
    };

    // Build clickable crumbs with their target path for navigation
    const crumbs = segments.reduce<{ label: string; to: string }[]>((acc, seg, idx) => {
      const to = `/${segments.slice(0, idx + 1).join('/')}`;
      const label = labelMap[seg] || seg;
      acc.push({ label, to });
      return acc;
    }, []);

    return [{ label: 'Home', to: '/' }, ...crumbs];
  }, [location.pathname]);

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
          {breadcrumb.map((crumb, idx) => {
            const isLast = idx === breadcrumb.length - 1;
            const clickable = !isLast;

            return (
              <span
                key={crumb.to + idx}
                style={{
                  color: isLast ? '#1890ff' : '#666',
                  cursor: clickable ? 'pointer' : 'default',
                }}
                onClick={() => clickable && navigate(crumb.to)}
                role={clickable ? 'button' : undefined}
              >
                {crumb.label}
                {idx < breadcrumb.length - 1 ? ' / ' : ''}
              </span>
            );
          })}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Badge count={3} color="#ff4d4f">
          <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
        </Badge>
      </div>
    </Header>
  );
};

export default AppHeader;
