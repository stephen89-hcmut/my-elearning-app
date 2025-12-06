import React, { useState } from 'react';
import { Card, Row, Col, Table, Avatar, Tag, Input, Space, Statistic, Empty } from 'antd';
import { SearchOutlined, MailOutlined, StarOutlined } from '@ant-design/icons';
import { mockInstructors } from '@/mock/courses';

const InstructorsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const filteredInstructors = mockInstructors.filter((instructor) => {
    const searchLower = searchText.toLowerCase();
    const user = instructor.user;
    if (!user) return false;
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'instructorId',
      key: 'instructorId',
      width: 60,
    },
    {
      title: 'Instructor Name',
      dataIndex: 'user',
      key: 'name',
      render: (user: any, record: any) => (
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
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>@{record.user.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'user',
      key: 'email',
      render: (user: any) => (
        <a href={`mailto:${user.email}`}>
          <MailOutlined style={{ marginRight: 8 }} />
          {user.email}
        </a>
      ),
    },
    {
      title: 'Teaching Field',
      dataIndex: 'qualification',
      key: 'qualification',
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
      title: 'Students',
      key: 'students',
      align: 'center' as const,
      render: (_: any) => <span>450</span>,
    },
    {
      title: 'Revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (_: any, record: any) => (
        <span style={{ color: '#52c41a', fontWeight: 600 }}>
          ${((record.hourlyRate || 0) * 100).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Rating',
      key: 'rating',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <span>{record.rating || 4.8}</span>
        </Space>
      ),
    },
  ];

  const totalInstructors = mockInstructors.length;
  const totalCourses = mockInstructors.reduce((sum, inst) => sum + (inst.courses?.length || 0), 0);
  const totalRevenue = mockInstructors.reduce((sum, inst) => sum + (inst.hourlyRate || 0) * 100, 0);
  const avgRating = (
    mockInstructors.reduce((sum, inst) => sum + (inst.rating || 4.8), 0) / totalInstructors
  ).toFixed(1);

  return (
    <div style={{ padding: '24px' }}>
      {/* Statistics Section */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Instructors"
              value={totalInstructors}
              prefix="👨‍🏫"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={totalCourses}
              prefix="📚"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix="💵"
              suffix="$"
              valueStyle={{ color: '#faad14' }}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Rating"
              value={avgRating}
              prefix="⭐"
              valueStyle={{ color: '#faad14' }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Instructor List */}
      <Card
        title="Instructor List"
        extra={
          <Input
            placeholder="Search instructors..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={filteredInstructors.map((inst, idx) => ({ ...inst, key: inst.instructorId || idx }))}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: filteredInstructors.length === 0 ? <Empty description="No instructors found" /> : undefined }}
        />
      </Card>

      {/* Instructor Cards */}
      <div style={{ marginTop: 32 }}>
        <h2>Instructor Details</h2>
        <Row gutter={[16, 16]}>
          {filteredInstructors.map((instructor) => (
            <Col xs={24} sm={12} md={8} key={instructor.instructorId}>
              <Card
                hoverable
                style={{ height: '100%' }}
                cover={
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      height: 120,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Avatar
                      size={80}
                      style={{ backgroundColor: '#1890ff', color: '#fff' }}
                    >
                      {instructor.user?.firstName.charAt(0)}{instructor.user?.lastName.charAt(0)}
                    </Avatar>
                  </div>
                }
              >
                <Card.Meta
                  title={`${instructor.user?.firstName} ${instructor.user?.lastName}`}
                  description={
                    <div>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>
                        @{instructor.user?.username}
                      </div>
                      <div style={{ fontSize: 12, marginBottom: 8 }}>
                        <strong>Teaching Field:</strong> {instructor.qualification}
                      </div>
                      <Row gutter={16}>
                        <Col span={12}>
                          <div style={{ fontSize: 12 }}>
                            <Tag color="blue">{instructor.courses?.length || 0}</Tag>
                            Courses
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: 12 }}>
                            <StarOutlined style={{ color: '#faad14', marginRight: 4 }} />
                            {instructor.rating || 4.8}
                          </div>
                        </Col>
                      </Row>
                      <Row gutter={16} style={{ marginTop: 12 }}>
                        <Col span={12}>
                          <div style={{ fontSize: 12 }}>
                            <strong>Students:</strong> 450
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: 12, color: '#52c41a', fontWeight: 600 }}>
                            ${((instructor.hourlyRate || 0) * 100).toLocaleString()}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default InstructorsPage;
