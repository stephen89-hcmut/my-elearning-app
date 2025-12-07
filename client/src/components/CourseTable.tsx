// src/components/CourseTable.tsx
import React from 'react';
import { Table, Card, Button, Space, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Course, CourseLevel } from '@/types';

interface CourseTableProps {
  courses: Course[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
  loading?: boolean;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
  onView?: (courseId: string) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  total,
  page,
  pageSize,
  onPageChange,
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
      sorter: (a: Course, b: Course) => (a.courseName || '').localeCompare(b.courseName || ''),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      sorter: (a: Course, b: Course) => (a.language || '').localeCompare(b.language || ''),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => {
        const numericPrice = Number(price) || 0;
        return `$${numericPrice.toFixed(2)}`;
      },
      sorter: (a: Course, b: Course) => (Number(a.price) || 0) - (Number(b.price) || 0),
      sortDirections: ['ascend', 'descend'],
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
      filters: [
        { text: 'Beginner', value: CourseLevel.BEGINNER },
        { text: 'Intermediate', value: CourseLevel.INTERMEDIATE },
        { text: 'Advanced', value: CourseLevel.ADVANCED },
      ],
      onFilter: (value: string | number | boolean, record: Course) => record.level === value,
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
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) {
                onEdit(record.courseId);
              } else {
                navigate(`/courses/edit/${record.courseId}`);
              }
            }}
            title="Edit"
          />
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              if (onView) {
                onView(record.courseId);
              } else {
                navigate(`/courses/${record.courseId}`);
              }
            }}
            title="View detail"
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
              onClick={(e) => e.stopPropagation()}
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
          total,
          current: page,
          pageSize,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '20', '50'],
          showTotal: (t, range) => `Showing ${range[0]}-${range[1]} of ${t}`,
          onChange: onPageChange,
        }}
      />
    </Card>
  );
};

export default CourseTable;
