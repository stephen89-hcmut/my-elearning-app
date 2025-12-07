// src/pages/StudentsPage.tsx
import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  Space,
  Avatar,
  Row,
  Col,
  Statistic,
  Button,
  Spin,
  Alert,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '@/api/courses';
import { Student } from '@/types';

const StudentsPage: React.FC = () => {
  const [studentsSearch, setStudentsSearch] = useState('');

  // Fetch students from API
  const {
    data: studentsData = { data: [] },
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudents(),
  });

  // Filter students
  const filteredStudents = (studentsData?.data || []).filter((student: Student) => {
    const searchLower = studentsSearch.toLowerCase();
    const user = student.user;
    if (!user) return false;
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
  });

  const studentColumns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (_: any, __: Student, index: number) => index + 1,
    },
    {
      title: 'Id',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 80,
      render: (id: number) => `${id}`,
    },
    {
      title: 'Student Name',
      key: 'name',
      render: (_: any, record: Student) => {
        const user = record.user;
        if (!user) return 'N/A';
        return (
          <Space>
            <Avatar size={40} style={{ backgroundColor: '#1890ff' }}>
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </Avatar>
            <div>
              <div style={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                @{user.username}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (date: Date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '—'),
    },
    {
      title: 'Bank Name',
      key: 'bankName',
      render: (_: any, record: Student) => record.user?.bankName || '—',
    },
    {
      title: 'Pay Account',
      key: 'paymentAccount',
      render: (_: any, record: Student) => record.user?.paymentAccount || '—',
    },
  ];

  const totalStudents = studentsData?.data?.length || 0;
  const activeStudents = (studentsData?.data || []).filter((s: Student) => s.status === 'active').length;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Students</h1>

      {/* Error alerts */}
      {studentsError && (
        <Alert
          message="Failed to load students"
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={totalStudents}
              valueStyle={{ color: '#1890ff' }}
              prefix="👨‍🎓"
              loading={isStudentsLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Students"
              value={activeStudents}
              valueStyle={{ color: '#52c41a' }}
              prefix="✅"
              loading={isStudentsLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Spin spinning={isStudentsLoading}>
          <div>
            <Space style={{ marginBottom: 16, display: 'flex' }}>
              <Input
                placeholder="Search students..."
                prefix={<SearchOutlined />}
                value={studentsSearch}
                onChange={(e) => setStudentsSearch(e.target.value)}
                style={{ width: 300 }}
              />
              <Button type="primary">+ Add Student</Button>
            </Space>
            <Table<Student>
              columns={studentColumns as any}
              dataSource={filteredStudents}
              rowKey="studentId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total}`,
              }}
            />
          </div>
        </Spin>
      </Card>
    </div>
  );
};

export default StudentsPage;
