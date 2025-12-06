// src/pages/StudentsPage.tsx
import React, { useState } from 'react';
import {
  Card,
  Table,
  Tabs,
  Input,
  Space,
  Tag,
  Avatar,
  Row,
  Col,
  Statistic,
  Progress,
  Button,
} from 'antd';
import {
  SearchOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { mockStudents, mockInstructors } from '@/mock/courses';
import { Student, Instructor } from '@/types';

const StudentsPage: React.FC = () => {
  const [studentsSearch, setStudentsSearch] = useState('');
  const [instructorsSearch, setInstructorsSearch] = useState('');

  // Filter students
  const filteredStudents = mockStudents.filter((student) => {
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

  // Filter instructors
  const filteredInstructors = mockInstructors.filter((instructor) => {
    const searchLower = instructorsSearch.toLowerCase();
    const user = instructor.user;
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
      title: 'ID',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 60,
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Student Name',
      key: 'name',
      render: (_: any, record: Student) => {
        const user = record.user;
        if (!user) return 'N/A';
        return (
          <Space>
            <Avatar
              size={40}
              style={{ backgroundColor: '#1890ff' }}
            >
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
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
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (email: string) => (
        <a href={`mailto:${email}`}>
          <MailOutlined style={{ marginRight: 8 }} />
          {email}
        </a>
      ),
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (date: Date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Courses',
      key: 'courses',
      align: 'center' as const,
      render: () => <Tag color="blue">3</Tag>,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: any) => (
        <Progress percent={33} size="small" />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => (
        <Tag color={record.status === 'active' ? 'green' : 'red'}>
          {record.status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
  ];

  const instructorColumns = [
    {
      title: 'ID',
      dataIndex: 'instructorId',
      key: 'instructorId',
      width: 60,
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Instructor Name',
      key: 'name',
      render: (_: any, record: Instructor) => {
        const user = record.user;
        if (!user) return 'N/A';
        return (
          <Space>
            <Avatar
              size={40}
              style={{ backgroundColor: '#1890ff' }}
            >
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
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
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
      render: (email: string) => (
        <a href={`mailto:${email}`}>
          <MailOutlined style={{ marginRight: 8 }} />
          {email}
        </a>
      ),
    },
    {
      title: 'Teaching Field',
      dataIndex: 'qualification',
      key: 'qualification',
      render: (qualification: string) => qualification || 'N/A',
    },
    {
      title: 'Courses',
      key: 'courses',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Tag color="blue">{record.courses?.length || 0}</Tag>
      ),
    },
    {
      title: 'Hourly Rate',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
      render: (rate: number) => (
        <span style={{ color: '#52c41a', fontWeight: 600 }}>
          ${rate}
        </span>
      ),
    },
  ];

  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter(s => s.status === 'active').length;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Students & Instructors</h1>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={totalStudents}
              valueStyle={{ color: '#1890ff' }}
              prefix="👨‍🎓"
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
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Courses/Student"
              value={2.7}
              valueStyle={{ color: '#faad14' }}
              prefix="📚"
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={30}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
              prefix="📊"
            />
          </Card>
        </Col>
      </Row>

      {/* Tables */}
      <Card>
        <Tabs
          defaultActiveKey="students"
          items={[
            {
              key: 'students',
              label: `Students (${filteredStudents.length})`,
              children: (
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
                  <Table
                    columns={studentColumns}
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
              ),
            },
            {
              key: 'instructors',
              label: `Instructors (${filteredInstructors.length})`,
              children: (
                <div>
                  <Space style={{ marginBottom: 16, display: 'flex' }}>
                    <Input
                      placeholder="Search instructors..."
                      prefix={<SearchOutlined />}
                      value={instructorsSearch}
                      onChange={(e) => setInstructorsSearch(e.target.value)}
                      style={{ width: 300 }}
                    />
                    <Button type="primary">+ Add Instructor</Button>
                  </Space>
                  <Table
                    columns={instructorColumns}
                    dataSource={filteredInstructors}
                    rowKey="instructorId"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total, range) =>
                        `Showing ${range[0]}-${range[1]} of ${total}`,
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default StudentsPage;
