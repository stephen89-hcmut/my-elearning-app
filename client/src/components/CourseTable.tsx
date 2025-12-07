// src/components/CourseTable.tsx
import React from 'react';
import { Table, Card, Button, Space, Popconfirm, Tag } from 'antd';
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
  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (_: any, __: Course, index: number) => index + 1,
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        const numericPrice = Number(price) || 0;
        return `$${numericPrice.toFixed(2)}`;
      },
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: CourseLevel) => {
        const labelMap: Record<CourseLevel, string> = {
          [CourseLevel.BEGINNER]: 'Beginner',
          [CourseLevel.INTERMEDIATE]: 'Intermediate',
          [CourseLevel.ADVANCED]: 'Advanced',
        };
        return <Tag color="blue">{labelMap[level] || 'N/A'}</Tag>;
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

  return (
    <Card
      title="Course List"
      bordered={false}
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
      }}
    >
      <Table
        columns={columns}
        dataSource={courses}
        rowKey="courseId"
        loading={loading}
        pagination={{
          total: courses.length,
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
