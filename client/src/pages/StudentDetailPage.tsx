import React from 'react';
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Space,
  Spin,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, MailOutlined, CalendarOutlined, CreditCardOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudentDetail } from '@/api/courses';
import { StudentDetail, CourseLevel } from '@/types';

const levelLabel: Record<number, string> = {
  [CourseLevel.BEGINNER]: 'Beginner',
  [CourseLevel.INTERMEDIATE]: 'Intermediate',
  [CourseLevel.ADVANCED]: 'Advanced',
};

const StudentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const studentId = Number(id);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<StudentDetail>({
    queryKey: ['student-detail', studentId],
    queryFn: () => getStudentDetail(studentId),
    enabled: !Number.isNaN(studentId),
  });

  const user = data?.student.user;
  const initials = `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}` || 'NA';
  const statusLabel = data?.student.status || 'Active';

  return (
    <div style={{ padding: 24 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/students')} style={{ marginBottom: 12 }}>
        Back to Students
      </Button>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Failed to load student detail"
          description={<Button size="small" onClick={() => refetch()}>Retry</Button>}
          style={{ marginBottom: 12 }}
        />
      )}

      <Spin spinning={isLoading}>
        <Card style={{ borderRadius: 12, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col flex="auto">
              <Space size={16} align="center" wrap>
                <Avatar size={72} style={{ backgroundColor: '#cfd8ff', color: '#1a4fff' }}>
                  {initials}
                </Avatar>
                <div>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    {user ? `${user.firstName} ${user.lastName}` : 'Student Name'}
                  </Typography.Title>
                  <Typography.Text type="secondary" style={{ display: 'block' }}>@{user?.username || 'username'}</Typography.Text>
                  <Space size={12} wrap>
                    <Space size={6}>
                      <MailOutlined />
                      <Typography.Text>{user?.email || '—'}</Typography.Text>
                    </Space>
                    <Space size={6}>
                      <CalendarOutlined />
                      <Typography.Text>{data?.student.enrollmentDate ? new Date(data.student.enrollmentDate).toLocaleDateString('vi-VN') : 'Joined —'}</Typography.Text>
                    </Space>
                    {user?.paymentAccount && (
                      <Space size={6}>
                        <CreditCardOutlined />
                        <Typography.Text>{user.paymentAccount}</Typography.Text>
                      </Space>
                    )}
                    {user?.bankName && (
                      <Space size={6}>
                        <PhoneOutlined />
                        <Typography.Text>{user.bankName}</Typography.Text>
                      </Space>
                    )}
                  </Space>
                </div>
              </Space>
            </Col>
            <Col>
              <Tag color="green" style={{ padding: '6px 12px', borderRadius: 12 }}>{statusLabel}</Tag>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Total Courses" value={data?.stats.totalCourses ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Completed" value={data?.stats.completed ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Avg Progress" value={data?.stats.avgScore ?? 0} suffix="%" />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Study Hours" value={data?.stats.totalSpent ?? 0} suffix="h" />
            </Card>
          </Col>
        </Row>

        <Tabs
          defaultActiveKey="overview"
          items={[
            {
              key: 'overview',
              label: 'Overview',
              children: (
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card title="Learning Activity (Last 7 Days)" bordered={false} style={{ borderRadius: 12 }}>
                      <Empty description="Activity chart coming soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Course Progress Distribution" bordered={false} style={{ borderRadius: 12 }}>
                      <Empty description="Progress distribution coming soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'courses',
              label: `Courses (${data?.courses.length ?? 0})`,
              children: (
                <Card bordered={false} style={{ borderRadius: 12 }}>
                  {data?.courses?.length ? (
                    <Row gutter={[12, 12]}>
                      {data.courses.map((course) => (
                        <Col key={course.courseId} xs={24} md={12}>
                          <Card size="small" hoverable style={{ borderRadius: 10 }} onClick={() => navigate(`/courses/${course.courseId}`)}>
                            <Space direction="vertical" size={4}>
                              <Typography.Text strong>{course.courseName}</Typography.Text>
                              <Typography.Text type="secondary">{course.language} • {levelLabel[course.level] || '—'}</Typography.Text>
                              <Typography.Text type="secondary">Enrolled: {new Date(course.enrollmentDate).toLocaleDateString('vi-VN')}</Typography.Text>
                            </Space>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Empty description="No courses yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )}
                </Card>
              ),
            },
            {
              key: 'progress',
              label: 'Progress',
              children: <Empty description="Progress details coming soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />, 
            },
            {
              key: 'certificates',
              label: `Certificates (${data?.courses.filter((c) => c.completionStatus === 2).length ?? 0})`,
              children: <Empty description="Certificates will appear here" image={Empty.PRESENTED_IMAGE_SIMPLE} />, 
            },
          ]}
        />
      </Spin>
    </div>
  );
};

export default StudentDetailPage;
