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
import { ArrowLeftOutlined, GlobalOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseDetail } from '@/api/courses';
import { CourseDetail, CourseLevel } from '@/types';

const CourseDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const courseId = id as string;

  const {
    data: course,
    isLoading,
    error,
    refetch,
  } = useQuery<CourseDetail>({
    queryKey: ['course-detail', courseId],
    queryFn: () => getCourseDetail(courseId),
    enabled: Boolean(courseId),
  });

  const revenueDisplay = useMemo(() => {
    if (!course) return '$0.00';
    const revenue = Number(course.totalRevenue) || 0;
    return `$${revenue.toFixed(2)}`;
  }, [course]);

  const levelLabel = useMemo(() => {
    if (course?.level === undefined || course?.level === null) return 'N/A';
    const map: Record<number, string> = {
      [CourseLevel.BEGINNER]: 'Beginner',
      [CourseLevel.INTERMEDIATE]: 'Intermediate',
      [CourseLevel.ADVANCED]: 'Advanced',
    };
    return map[course.level] ?? 'N/A';
  }, [course?.level]);

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
                  <Tag color="green" style={{ borderRadius: 16 }}>Course</Tag>
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
                    <Typography.Text strong>{course?.minScore !== undefined ? `${course.minScore}%` : '—'}</Typography.Text>
                  </Space>
                  <Space size={6}>
                    <Typography.Text type="secondary">Level:</Typography.Text>
                    <Typography.Text strong>{levelLabel}</Typography.Text>
                  </Space>
                  <Space size={6}>
                    <CalendarOutlined />
                    <Typography.Text>Created Date</Typography.Text>
                  </Space>
                </Space>
              </Space>
            </Col>
            <Col>
              <div style={{ textAlign: 'right' }}>
                <Typography.Title level={3} style={{ marginBottom: 4, color: '#1a4fff' }}>
                  {revenueDisplay}
                </Typography.Title>
                <Typography.Text type="secondary">Total Revenue</Typography.Text>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Total Students" value={course?.totalStudents ?? 0} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Reviews" value={course?.totalReviews ?? 0} suffix="" />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Avg Rating" value={course?.avgRating ?? 0} precision={1} />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Revenue" prefix={<DollarOutlined />} value={course?.totalRevenue ?? 0} precision={2} />
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
                    <Card title="Instructor(s)" bordered={false} style={{ borderRadius: 12 }}>
                      {course?.instructors?.length ? (
                        <Space direction="vertical" size={8}>
                          {course.instructors.map((ins) => (
                            <Tag key={ins.instructorId} color="blue">{ins.name}</Tag>
                          ))}
                        </Space>
                      ) : (
                        <Empty description="Instructor data not provided" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Course Statistics" bordered={false} style={{ borderRadius: 12 }}>
                      <Space direction="vertical" style={{ width: '100%' }} size={12}>
                        <div>
                          <Typography.Text type="secondary">Topics</Typography.Text>
                          {course?.topics?.length ? (
                            <Space wrap size={8}>
                              {course.topics.map((t) => (
                                <Tag key={t.topicId}>{t.topicName}</Tag>
                              ))}
                            </Space>
                          ) : (
                            <Typography.Text strong>—</Typography.Text>
                          )}
                        </div>
                        <div>
                          <Typography.Text type="secondary">Average Rating</Typography.Text>
                          <Typography.Text strong>{course?.avgRating ?? 0}</Typography.Text>
                        </div>
                        <Divider style={{ margin: '12px 0' }} />
                        <Row gutter={12}>
                          <Col span={12}>
                            <Typography.Text type="secondary">Total Enrollments</Typography.Text>
                            <Typography.Title level={4} style={{ margin: 0 }}>{course?.totalEnrollments ?? 0}</Typography.Title>
                          </Col>
                          <Col span={12}>
                            <Typography.Text type="secondary">Total Revenue</Typography.Text>
                            <Typography.Title level={4} style={{ margin: 0 }}>
                              ${course?.totalRevenue?.toFixed ? course.totalRevenue.toFixed(2) : (Number(course?.totalRevenue || 0)).toFixed(2)}
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
