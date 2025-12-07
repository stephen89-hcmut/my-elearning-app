import React from 'react';
import { Modal, Avatar, Typography, Space, Row, Col, Card, Tag, List, Skeleton, Progress } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getInstructorDetail } from '@/api/courses';
import { CourseLevel } from '@/types';

const { Title, Text } = Typography;

interface InstructorDetailModalProps {
  visible: boolean;
  instructorId?: number;
  onClose: () => void;
}

const levelLabel: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: 'Beginner',
  [CourseLevel.INTERMEDIATE]: 'Intermediate',
  [CourseLevel.ADVANCED]: 'Advanced',
};

const InstructorDetailModal: React.FC<InstructorDetailModalProps> = ({ visible, instructorId, onClose }) => {
  const { data, isFetching } = useQuery({
    queryKey: ['instructor-detail', instructorId],
    queryFn: () => getInstructorDetail(instructorId as number),
    enabled: Boolean(visible && instructorId),
  });

  const instructor = data?.instructor;
  const stats = data?.stats;
  const revenueByCourse = data?.revenueByCourse || [];
  const courses = data?.courses || [];
  const levelCounts = data?.coursesByLevel || [];
  const initials = `${instructor?.user?.firstName?.[0] || ''}${instructor?.user?.lastName?.[0] || ''}` || 'N/A';

  return (
    <Modal
      title="Instructor Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={960}
      bodyStyle={{ paddingTop: 8 }}
    >
      {isFetching ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : instructor ? (
        <div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <Avatar size={72} style={{ background: '#f3e8ff', color: '#7c3aed', fontWeight: 600 }}>
              {initials}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ margin: 0 }}>
                {instructor.user?.firstName} {instructor.user?.lastName}
              </Title>
              <Space size="small" wrap>
                <Text type="secondary">@{instructor.user?.username}</Text>
                <Tag color="purple">Instructor</Tag>
              </Space>
              <div style={{ marginTop: 4 }}>
                <Text type="secondary">{instructor.user?.email}</Text>
              </div>
              {instructor.teachingField && (
                <div>
                  <Text type="secondary">{instructor.teachingField}</Text>
                </div>
              )}
            </div>
          </div>

          <Row gutter={12} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Text type="secondary">Courses</Text>
                <Title level={3} style={{ margin: 0 }}>{stats?.courseCount ?? 0}</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text type="secondary">Students</Text>
                <Title level={3} style={{ margin: 0 }}>{stats?.studentCount ?? 0}</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text type="secondary">Revenue</Text>
                <Title level={3} style={{ margin: 0 }}>${Number(stats?.revenue || 0).toLocaleString()}</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text type="secondary">Avg Rating</Text>
                <Title level={3} style={{ margin: 0 }}>{stats?.avgRating ?? '-'}</Title>
              </Card>
            </Col>
          </Row>

          <Row gutter={12} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card title="Revenue by Course">
                <List
                  dataSource={revenueByCourse}
                  renderItem={(item: any) => (
                    <List.Item>
                      <div style={{ flex: 1 }}>{item.courseName}</div>
                      <Text strong>${Number(item.revenue || 0).toLocaleString()}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Courses by Level">
                <Space size="small" wrap>
                  {levelCounts.map((l: any) => (
                    <Tag key={l.level} color="blue">{levelLabel[l.level as CourseLevel]}: {l.count}</Tag>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>

          <Card title="Courses">
            <List
              dataSource={courses}
              itemLayout="vertical"
              renderItem={(course: any) => (
                <List.Item key={course.courseId}>
                  <List.Item.Meta
                    title={course.courseName}
                    description={`${course.language} • ${levelLabel[course.level as CourseLevel]}`}
                  />
                  <Space size="small" wrap style={{ marginBottom: 8 }}>
                    <Tag color="geekblue">Lectures: {course.lectures}</Tag>
                    <Tag color="green">${Number(course.price || 0).toFixed(2)}</Tag>
                    <Tag color="purple">Students: {course.studentCount}</Tag>
                  </Space>
                  <Progress percent={Math.min((course.studentCount || 0) * 5, 100)} showInfo={false} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      ) : (
        <Text type="secondary">No data.</Text>
      )}
    </Modal>
  );
};

export default InstructorDetailModal;
