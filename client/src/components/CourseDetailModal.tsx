// src/components/CourseDetailModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Button,
  Space,
  Divider,
  Empty,
  Spin,
  Popconfirm,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Course, CourseLevel } from '@/types';

interface CourseDetailModalProps {
  visible: boolean;
  course?: Course;
  loading: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  visible,
  course,
  loading,
  onEdit,
  onDelete,
  onCancel,
}) => {
  const [deleteConfirmLoading, setDeleteConfirmLoading] = useState(false);

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return 'green';
      case CourseLevel.INTERMEDIATE:
        return 'orange';
      case CourseLevel.ADVANCED:
        return 'red';
      default:
        return 'blue';
    }
  };

  const getLevelLabel = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return 'Beginner';
      case CourseLevel.INTERMEDIATE:
        return 'Intermediate';
      case CourseLevel.ADVANCED:
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirmLoading(true);
    try {
      if (onDelete) {
        await onDelete();
      }
    } finally {
      setDeleteConfirmLoading(false);
    }
  };

  return (
    <Modal
      title={`${course?.courseName || ''}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
        <Button key="edit" type="primary" icon={<EditOutlined />} onClick={onEdit}>
          Edit
        </Button>,
        <Popconfirm
          key="delete"
          title="Delete Course"
          description={`Are you sure you want to delete "${course?.courseName}"? This action cannot be undone.`}
          okText="Yes, Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true, loading: deleteConfirmLoading }}
          onConfirm={handleDeleteConfirm}
        >
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>,
      ]}
      width={800}
    >
      <Spin spinning={loading}>
        {course && (
          <>
            <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
              <Tag color={getLevelColor(course.level)}>
                {getLevelLabel(course.level)}
              </Tag>
              <Tag color="cyan">{course.language}</Tag>
              {course.rating && (
                <Tag color="gold">⭐ {course.rating.toFixed(1)}</Tag>
              )}
            </div>

            <Descriptions bordered column={2} size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Course ID" span={1}>
                #{course.courseId}
              </Descriptions.Item>
              <Descriptions.Item label="Total Lectures" span={1}>
                {course.totalLectures}
              </Descriptions.Item>
              <Descriptions.Item label="Price" span={1}>
                <Space>
                  <DollarOutlined />
                  <span style={{ fontSize: 16, fontWeight: 600 }}>
                    {course.price.toFixed(2)}
                  </span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Minimum Score" span={1}>
                {course.minScore}%
              </Descriptions.Item>
              <Descriptions.Item label="Student Count" span={2}>
                {course.studentCount} students enrolled
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={2}>
                {course.description || 'No description provided'}
              </Descriptions.Item>
            </Descriptions>

            {/* Topics Section */}
            {course.topics && course.topics.length > 0 && (
              <>
                <Divider>Topics</Divider>
                <Space wrap style={{ marginBottom: 16 }}>
                  {course.topics.map((topic) => (
                    <Tag key={topic.topicId} color="blue">
                      {topic.topicName}
                    </Tag>
                  ))}
                </Space>
              </>
            )}

            {/* Instructors Section */}
            {course.instructor && (
              <>
                <Divider>Instructor</Divider>
                <div style={{ padding: '16px', background: '#fafafa', borderRadius: 4 }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <strong>{course.instructor.user?.firstName} {course.instructor.user?.lastName}</strong>
                      <div style={{ color: '#666', fontSize: 12 }}>
                        @{course.instructor.user?.username}
                      </div>
                    </div>
                    <div>
                      <strong>Email:</strong> {course.instructor.user?.email}
                    </div>
                    {course.instructor.qualification && (
                      <div>
                        <strong>Teaching Field:</strong> {course.instructor.qualification}
                      </div>
                    )}
                    {course.instructor.hourlyRate && (
                      <div>
                        <strong>Hourly Rate:</strong> ${course.instructor.hourlyRate}
                      </div>
                    )}
                  </Space>
                </div>
              </>
            )}

            {!course.instructor && (
              <>
                <Divider>Instructor</Divider>
                <Empty description="No instructor assigned" />
              </>
            )}
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default CourseDetailModal;
