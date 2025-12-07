// src/components/CourseDetailModal.tsx
import React from 'react';
import { Modal, Tag, Button, Space, Divider, Skeleton, Row, Col, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { CourseLevel } from '@/types';
import { getCourseDetail } from '@/api/courses';

const { Title, Text } = Typography;

interface CourseDetailModalProps {
  visible: boolean;
  courseId?: number;
  onEdit?: (courseId: number) => void;
  onDelete?: (courseId: number) => void;
  onCancel: () => void;
}

const levelLabel: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: 'Beginner',
  [CourseLevel.INTERMEDIATE]: 'Intermediate',
  [CourseLevel.ADVANCED]: 'Advanced',
};

const levelColor: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: '#16a34a',
  [CourseLevel.INTERMEDIATE]: '#f59e0b',
  [CourseLevel.ADVANCED]: '#ef4444',
};

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  visible,
  courseId,
  onEdit,
  onDelete,
  onCancel,
}) => {
  const { data, isFetching } = useQuery({
    queryKey: ['course-detail', courseId],
    queryFn: () => getCourseDetail(courseId as number),
    enabled: Boolean(visible && courseId),
  });

  const course = data;
  const totalDuration = course ? Number(course.totalDuration || 0) : 0;

  return (
    <Modal
      title={course?.courseName || 'Course Details'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
        <Button key="edit" type="primary" icon={<EditOutlined />} onClick={() => courseId && onEdit?.(courseId)}>
          Edit
        </Button>,
        <Button key="delete" danger onClick={() => courseId && onDelete?.(courseId)}>
          Delete
        </Button>,
      ]}
      width={900}
      bodyStyle={{ paddingTop: 8 }}
    >
      {isFetching || !course ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            <Tag color={levelColor[course.level] || 'blue'}>{levelLabel[course.level] || 'Level'}</Tag>
            <Tag color="geekblue">{course.language}</Tag>
            <Tag color="green">${Number(course.price || 0).toFixed(2)}</Tag>
            <Tag>{course.studentCount || 0} students</Tag>
          </div>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <div style={{ background: '#f5f7fb', padding: 16, borderRadius: 8 }}>
                <Text type="secondary">Lectures</Text>
                <Title level={3} style={{ margin: 0 }}>{course.lectureCount || course.totalLectures}</Title>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ background: '#f5f7fb', padding: 16, borderRadius: 8 }}>
                <Text type="secondary">Tests</Text>
                <Title level={3} style={{ margin: 0 }}>{course.testCount || 0}</Title>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ background: '#f5f7fb', padding: 16, borderRadius: 8 }}>
                <Text type="secondary">Duration</Text>
                <Title level={3} style={{ margin: 0 }}>
                  <ClockCircleOutlined style={{ marginRight: 6 }} />
                  {Math.round(totalDuration / 60)}h {Math.round(totalDuration % 60)}m
                </Title>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ background: '#f5f7fb', padding: 16, borderRadius: 8 }}>
                <Text type="secondary">Price</Text>
                <Title level={3} style={{ margin: 0 }}>${Number(course.price || 0).toFixed(2)}</Title>
              </div>
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <Title level={4} style={{ marginBottom: 8 }}>Description</Title>
            <Text>{course.description || 'No description provided.'}</Text>
          </div>

          <div style={{ marginBottom: 12 }}>
            <Title level={4} style={{ marginBottom: 8 }}>Topics</Title>
            <Space wrap>
              {(course.topics || []).map((topic) => (
                <Tag key={topic.topicId} color="blue">{topic.topicName}</Tag>
              ))}
            </Space>
          </div>

          <Divider style={{ margin: '16px 0' }} />
          <Title level={4} style={{ marginBottom: 12 }}>Instructor</Title>
          {course.instructor ? (
            <div style={{ padding: 16, background: '#f5f7fb', borderRadius: 8 }}>
              <Title level={5} style={{ margin: 0 }}>
                {course.instructor.firstName} {course.instructor.lastName}
              </Title>
              <Text type="secondary">@{course.instructor.username}</Text>
              <div style={{ marginTop: 8 }}>
                <Text>Email: {course.instructor.email}</Text>
              </div>
              {course.instructor.teachingField && (
                <div style={{ marginTop: 4 }}>
                  <Text>Field: {course.instructor.teachingField}</Text>
                </div>
              )}
            </div>
          ) : (
            <Text type="secondary">No instructor assigned.</Text>
          )}
        </div>
      )}
    </Modal>
  );
};

export default CourseDetailModal;
