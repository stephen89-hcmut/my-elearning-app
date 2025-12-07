import React, { useMemo } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Row,
  Space,
  Spin,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import { ArrowLeftOutlined, GlobalOutlined, UserOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseDetail } from '@/api/courses';
import { CourseLevel } from '@/types';

const levelLabel: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: 'Beginner',
  [CourseLevel.INTERMEDIATE]: 'Intermediate',
  [CourseLevel.ADVANCED]: 'Advanced',
};

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const courseId = Number(id);

  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: () => getCourseDetail(courseId),
    enabled: !Number.isNaN(courseId),
  });

  const levelTag = useMemo(() => {
    if (!course) return null;
    return <Tag color="green" style={{ borderRadius: 16 }}>{levelLabel[course.level] || 'Level'}</Tag>;
  }, [course]);

  const priceDisplay = useMemo(() => {
    if (!course) return '$0.00';
    const priceNumber = Number(course.price) || 0;
    return `$${priceNumber.toFixed(2)}`;
  }, [course]);

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/courses')}>
          Back to Courses
        </Button>
      </Space>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Failed to load course detail"
          description={<Button size="small" onClick={() => refetch()}>Retry</Button>}
          style={{ marginBottom: 16 }}
        />
      )}

      <Spin spinning={isLoading}>
        <Card
          style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}
          bodyStyle={{ padding: 20 }}
        >
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col flex="auto">
              <Space size={12} direction="vertical" style={{ width: '100%' }}>
                <Space size={8} wrap>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    {course?.courseName || 'Course Detail'}
                  </Typography.Title>
                  {levelTag}
                </Space>
                <Typography.Text type="secondary">
                  {course?.description || 'Explore the course content and performance at a glance.'}
                </Typography.Text>
                <Space size={16} wrap>
                  <Space size={6}>
                    <GlobalOutlined />
                    <Typography.Text strong>{course?.language || 'N/A'}</Typography.Text>
                  </Space>
                  <Space size={6}>
                    <Typography.Text type="secondary">Min Score:</Typography.Text>
                    <Typography.Text strong>{course?.minScore ? `${course.minScore}%` : '—'}</Typography.Text>
                  </Space>
                  <Space size={6}>
                    <CalendarOutlined />
                    <Typography.Text>{course ? 'Created Date' : '—'}</Typography.Text>
                  </Space>
                  <Space size={6}>
                    <UserOutlined />
                    <Typography.Text>
                      {course?.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'N/A'}
                    </Typography.Text>
                  </Space>
                </Space>
              </Space>
            </Col>
            <Col>
              <div style={{ textAlign: 'right' }}>
                <Typography.Title level={3} style={{ marginBottom: 4, color: '#1a4fff' }}>
                  {priceDisplay}
                </Typography.Title>
                <Typography.Text type="secondary">Course Price</Typography.Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Total Students" value={course?.studentCount ?? 0} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Completed" value={course?.studentCount ? Math.floor((course.studentCount * 0.5)) : 0} suffix="" />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Avg Progress" value={67} suffix="%" />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Revenue" prefix={<DollarOutlined />} value={course?.studentCount ? (course.studentCount * (Number(course?.price) || 0)).toFixed(2) : '0.00'} />
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
                    <Card title="Instructor" bordered={false} style={{ borderRadius: 12 }}>
                      {course?.instructor ? (
                        <Space direction="vertical">
                          <Typography.Text strong>
                            {course.instructor.firstName} {course.instructor.lastName}
                          </Typography.Text>
                          <Typography.Text type="secondary">{course.instructor.teachingField || '—'}</Typography.Text>
                          <Typography.Text type="secondary">{course.instructor.email}</Typography.Text>
                        </Space>
                      ) : (
                        <Empty description="No instructor data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Course Statistics" bordered={false} style={{ borderRadius: 12 }}>
                      <Space direction="vertical" style={{ width: '100%' }} size={12}>
                        <div>
                          <Typography.Text type="secondary">Completion Rate</Typography.Text>
                          <div style={{ height: 10, background: '#f0f0f0', borderRadius: 6, marginTop: 6 }}>
                            <div style={{ width: '51%', height: '100%', background: '#0b0b18', borderRadius: 6 }} />
                          </div>
                          <Typography.Text strong>51.1%</Typography.Text>
                        </div>
                        <div>
                          <Typography.Text type="secondary">Average Progress</Typography.Text>
                          <div style={{ height: 10, background: '#f0f0f0', borderRadius: 6, marginTop: 6 }}>
                            <div style={{ width: '67%', height: '100%', background: '#0b0b18', borderRadius: 6 }} />
                          </div>
                          <Typography.Text strong>67%</Typography.Text>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <Row gutter={12}>
                          <Col span={12}>
                            <Typography.Text type="secondary">Total Enrollments</Typography.Text>
                            <Typography.Title level={4} style={{ margin: 0 }}>{course?.studentCount ?? 0}</Typography.Title>
                          </Col>
                          <Col span={12}>
                            <Typography.Text type="secondary">Total Revenue</Typography.Text>
                            <Typography.Title level={4} style={{ margin: 0 }}>
                              ${course?.studentCount ? (course.studentCount * (Number(course.price) || 0)).toFixed(2) : '0.00'}
                            </Typography.Title>
                          </Col>
                        </Row>
                      </Space>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="Course Content" bordered={false} style={{ borderRadius: 12 }}>
                      <Empty description="Content outline coming soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'content',
              label: 'Course Content',
              children: <Empty description="Course content will be displayed here" image={Empty.PRESENTED_IMAGE_SIMPLE} />, 
            },
            {
              key: 'students',
              label: 'Students',
              children: <Empty description="Student list will be displayed here" image={Empty.PRESENTED_IMAGE_SIMPLE} />, 
            },
            {
              key: 'reviews',
              label: 'Reviews',
              children: <Empty description="Reviews will be displayed here" image={Empty.PRESENTED_IMAGE_SIMPLE} />, 
            },
          ]}
        />
      </Spin>
    </div>
  );
};

export default CourseDetailPage;
