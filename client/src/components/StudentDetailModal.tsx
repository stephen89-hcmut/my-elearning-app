import React from 'react';
import { Modal, Avatar, Typography, Space, Row, Col, Card, Tag, Tabs, List, Progress, Skeleton } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getStudentDetail } from '@/api/courses';
import { CourseLevel, LearningStatus, StudentCourseSummary } from '@/types';

const { Title, Text } = Typography;

interface StudentDetailModalProps {
  visible: boolean;
  studentId?: number;
  onClose: () => void;
}

const statusLabel: Record<LearningStatus, string> = {
  [LearningStatus.NOT_STARTED]: 'Not Started',
  [LearningStatus.IN_PROGRESS]: 'In Progress',
  [LearningStatus.COMPLETED]: 'Completed',
};

const statusColor: Record<LearningStatus, string> = {
  [LearningStatus.NOT_STARTED]: 'default',
  [LearningStatus.IN_PROGRESS]: 'gold',
  [LearningStatus.COMPLETED]: 'green',
};

const levelLabel: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: 'Beginner',
  [CourseLevel.INTERMEDIATE]: 'Intermediate',
  [CourseLevel.ADVANCED]: 'Advanced',
};

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ visible, studentId, onClose }) => {
  const { data, isFetching } = useQuery({
    queryKey: ['student-detail', studentId],
    queryFn: () => getStudentDetail(studentId as number),
    enabled: Boolean(visible && studentId),
  });

  const student = data?.student;
  const stats = data?.stats;
  const courses = (data?.courses || []) as StudentCourseSummary[];
  const initials = `${student?.user?.firstName?.[0] || ''}${student?.user?.lastName?.[0] || ''}` || 'N/A';

  return (
    <Modal
      title="Student Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      bodyStyle={{ paddingTop: 8 }}
    >
      {isFetching ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : student ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <Avatar size={72} style={{ background: '#dbeafe', color: '#1d4ed8', fontWeight: 600 }}>
              {initials}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Title level={4} style={{ margin: 0 }}>
                {student.user?.firstName} {student.user?.lastName}
              </Title>
              <Space size="small" wrap>
                <Text type="secondary">@{student.user?.username}</Text>
                <Tag color="green">Active</Tag>
              </Space>
              <div>
                <Text type="secondary">Enrolled: {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString('vi-VN') : '—'}</Text>
              </div>
              <div>
                <Text type="secondary">Payment: {student.user?.paymentAccount || '—'}</Text>
              </div>
            </div>
          </div>

          <Row gutter={12} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card>
                <Text type="secondary">Total Courses</Text>
                <Title level={3} style={{ margin: 0 }}>{stats?.totalCourses ?? 0}</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text type="secondary">Completed</Text>
                <Title level={3} style={{ margin: 0 }}>{stats?.completed ?? 0}</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text type="secondary">Avg Score</Text>
                <Title level={3} style={{ margin: 0 }}>{stats?.avgScore ?? '-'}</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text type="secondary">Total Spent</Text>
                <Title level={3} style={{ margin: 0 }}>${Number(stats?.totalSpent || 0).toLocaleString()}</Title>
              </Card>
            </Col>
          </Row>

          <Tabs
            items={[{
              key: 'courses',
              label: 'Courses',
              children: (
                <List
                  dataSource={courses}
                  itemLayout="vertical"
                  renderItem={(course) => (
                    <List.Item key={course.courseId}>
                      <List.Item.Meta
                        title={course.courseName}
                        description={course.description || 'No description'}
                      />
                      <Space size="small" wrap style={{ marginBottom: 8 }}>
                        <Tag color="blue">{levelLabel[course.level]}</Tag>
                        <Tag color="geekblue">{course.language}</Tag>
                        <Tag color="gold">${Number(course.price || 0).toFixed(2)}</Tag>
                        <Tag color={statusColor[course.completionStatus] as any}>{statusLabel[course.completionStatus]}</Tag>
                      </Space>
                      <Progress
                        percent={course.completionStatus === LearningStatus.COMPLETED ? 100 : course.completionStatus === LearningStatus.IN_PROGRESS ? 50 : 0}
                        showInfo={false}
                      />
                    </List.Item>
                  )}
                />
              ),
            }]}
          />
        </div>
      ) : (
        <Text type="secondary">No data.</Text>
      )}
    </Modal>
  );
};

export default StudentDetailModal;
