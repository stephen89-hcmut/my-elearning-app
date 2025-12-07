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
import { ArrowLeftOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInstructorDetail } from '@/api/courses';
import { InstructorDetail } from '@/types';

const InstructorDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const instructorId = id as string;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<InstructorDetail>({
    queryKey: ['instructor-detail', instructorId],
    queryFn: () => getInstructorDetail(instructorId),
    enabled: Boolean(instructorId),
  });

  const initials = (data?.instructor_name || 'NA')
    .split(' ')
    .map((p) => p.charAt(0))
    .join('')
    .slice(0, 2) || 'NA';
  const joinedLabel = 'Joined —';

  return (
    <div style={{ padding: 24 }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/instructors')} style={{ marginBottom: 12 }}>
        Back to Instructors
      </Button>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Failed to load instructor detail"
          description={<Button size="small" onClick={() => refetch()}>Retry</Button>}
          style={{ marginBottom: 12 }}
        />
      )}

      <Spin spinning={isLoading}>
        <Card style={{ borderRadius: 12, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col flex="auto">
              <Space size={16} align="center" wrap>
                <Avatar size={72} style={{ backgroundColor: '#f0e1ff', color: '#7c3aed' }}>
                  {initials}
                </Avatar>
                <div>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    {data?.instructor_name || 'Instructor Name'}
                  </Typography.Title>
                  <Typography.Text type="secondary" style={{ display: 'block' }}>@{data?.username || 'username'}</Typography.Text>
                  <Tag color="purple" style={{ marginTop: 4 }}>{data?.teaching_field || 'Specialty'}</Tag>
                  <Typography.Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
                    {data?.bio || 'Instructor bio will appear here.'}
                  </Typography.Paragraph>
                  <Space size={12} wrap>
                    <Space size={6}>
                      <MailOutlined />
                      <Typography.Text>{data?.email || '—'}</Typography.Text>
                    </Space>
                    <Space size={6}>
                      <CalendarOutlined />
                      <Typography.Text>{joinedLabel}</Typography.Text>
                    </Space>
                  </Space>
                </div>
              </Space>
            </Col>
            <Col>
              <Tag color="green" style={{ padding: '6px 12px', borderRadius: 12 }}>Active</Tag>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Total Courses" value={data?.total_courses ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Total Students" value={data?.total_students ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Total Revenue" prefix="$" value={data?.total_revenue ?? 0} precision={2} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Avg Rating" value={data?.avg_rating ?? 0} precision={1} />
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
                    <Card title="Student Growth (Last 6 Months)" bordered={false} style={{ borderRadius: 12 }}>
                      <Empty description="Student growth chart coming soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="Course Performance" bordered={false} style={{ borderRadius: 12 }}>
                      <Empty description="Course performance chart coming soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'courses',
              label: `Courses (${data?.total_courses ?? 0})`,
              children: (
                <Card bordered={false} style={{ borderRadius: 12 }}>
                  <Empty description="No courses yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </Card>
              ),
            },
            {
              key: 'students',
              label: 'Students',
              children: <Empty description="Students will appear here" image={Empty.PRESENTED_IMAGE_SIMPLE} />, 
            },
            {
              key: 'revenue',
              label: 'Revenue',
              children: <Empty description="Revenue analytics coming soon" image={Empty.PRESENTED_IMAGE_SIMPLE} />, 
            },
          ]}
        />
      </Spin>
    </div>
  );
};

export default InstructorDetailPage;
