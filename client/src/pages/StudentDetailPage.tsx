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
import { getStudentDetail } from '@/api/courses';
import { StudentDetail } from '@/types';

const StudentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const studentId = id as string;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<StudentDetail>({
    queryKey: ['student-detail', studentId],
    queryFn: () => getStudentDetail(studentId),
    enabled: Boolean(studentId),
  });

  const initials = (data?.student_name || 'NA')
    .split(' ')
    .map((p) => p.charAt(0))
    .join('')
    .slice(0, 2) || 'NA';
  const statusLabel = 'Active';
  const enrollmentDate = data?.enrollment_date ? new Date(data.enrollment_date).toLocaleDateString('vi-VN') : 'Joined —';

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
                    {data?.student_name || 'Student Name'}
                  </Typography.Title>
                  <Typography.Text type="secondary" style={{ display: 'block' }}>@{data?.username || 'username'}</Typography.Text>
                  <Space size={12} wrap>
                    <Space size={6}>
                      <MailOutlined />
                      <Typography.Text>{data?.email || '—'}</Typography.Text>
                    </Space>
                    <Space size={6}>
                      <CalendarOutlined />
                      <Typography.Text>{enrollmentDate}</Typography.Text>
                    </Space>
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
              <Statistic title="Total Courses" value={data?.total_courses ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Completed" value={data?.total_completed ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Certificates" value={data?.total_certificates ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card bodyStyle={{ padding: 16 }}>
              <Statistic title="Study Duration" value={data?.total_learning_duration ?? 0} />
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
              label: `Courses (${data?.total_courses ?? 0})`,
              children: (
                <Card bordered={false} style={{ borderRadius: 12 }}>
                  <Empty description="No courses yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
              label: `Certificates (${data?.total_certificates ?? 0})`,
              children: <Empty description="Certificates will appear here" image={Empty.PRESENTED_IMAGE_SIMPLE} />, 
            },
          ]}
        />
      </Spin>
    </div>
  );
};

export default StudentDetailPage;
