// src/components/CourseTable.tsx
import React, { useState } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Select,
  Button,
  Space,
  Modal,
  Tag,
  Popconfirm,
} from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Course, CourseLevel } from '@/types';

interface CourseTableProps {
  courses: Course[];
  loading?: boolean;
  onEdit?: (courseId: number) => void;
  onDelete?: (courseId: number) => void;
  onView?: (courseId: number) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  loading = false,
  onEdit,
  onDelete,
  onView,
}) => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>();
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>();

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const topicMatch = !selectedTopic || course.topics?.some((t) => t.topicId === Number(selectedTopic));
    const levelMatch = !selectedLevel || course.level === Number(selectedLevel);
    return topicMatch && levelMatch;
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'courseId',
      key: 'courseId',
      width: 60,
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Instructor',
      dataIndex: 'instructors',
      key: 'instructor',
      render: (instructors: any[]) => (
        <span>{instructors?.[0]?.user?.firstName} {instructors?.[0]?.user?.lastName}</span>
      ),
    },
    {
      title: 'Topic',
      dataIndex: 'topics',
      key: 'topic',
      render: (topics: any[]) => (
        <Tag color="blue">{topics?.[0]?.topicName || 'N/A'}</Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'level',
      key: 'status',
      render: (level: CourseLevel) => {
        const statusMap: Record<CourseLevel, { text: string; color: string }> = {
          [CourseLevel.BEGINNER]: { text: 'Published', color: 'green' },
          [CourseLevel.INTERMEDIATE]: { text: 'Published', color: 'green' },
          [CourseLevel.ADVANCED]: { text: 'Published', color: 'green' },
        };
        const status = statusMap[level] || { text: 'Draft', color: 'gray' };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Course) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onView?.(record.courseId) || navigate(`/courses/${record.courseId}`)}
            title="View"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record.courseId) || navigate(`/courses/edit/${record.courseId}`)}
            title="Edit"
          />
          <Popconfirm
            title="Delete Course"
            description="Are you sure you want to delete this course?"
            onConfirm={() => onDelete?.(record.courseId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const topicsOptions = Array.from(
    new Set(courses.flatMap((c) => c.topics?.map((t) => t.topicId) || []))
  ).map((topicId) => {
    const topic = courses
      .flatMap((c) => c.topics)
      .find((t) => t?.topicId === topicId);
    return {
      label: topic?.topicName || '',
      value: topicId,
    };
  });

  return (
    <Card
      title="Course List"
      bordered={false}
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
      }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={8}>
          <Select
            placeholder="Filter by Topic"
            allowClear
            style={{ width: '100%' }}
            options={topicsOptions}
            onChange={setSelectedTopic}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Select
            placeholder="Filter by Level"
            allowClear
            style={{ width: '100%' }}
            options={[
              { label: 'Beginner', value: CourseLevel.BEGINNER },
              { label: 'Intermediate', value: CourseLevel.INTERMEDIATE },
              { label: 'Advanced', value: CourseLevel.ADVANCED },
            ]}
            onChange={setSelectedLevel}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="courseId"
        loading={loading}
        pagination={{
          total: filteredCourses.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total}`,
        }}
      />
    </Card>
  );
};

export default CourseTable;
