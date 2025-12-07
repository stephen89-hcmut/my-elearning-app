// src/pages/StudentsPage.tsx
import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  Space,
  Avatar,
  Button,
  Spin,
  Alert,
  Popconfirm,
  message,
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '@/api/courses';
import { Student } from '@/types';
import { StudentEditModal } from '@/components';
import { useNavigate } from 'react-router-dom';

const StudentsPage: React.FC = () => {
  const [studentsSearch, setStudentsSearch] = useState('');
  const [editVisible, setEditVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const navigate = useNavigate();

  // Fetch students from API
  const {
    data: studentsData = { data: [] },
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudents(),
  });

  // Filter students
  const filteredStudents = (studentsData?.data || []).filter((student: Student) => {
    const searchLower = studentsSearch.toLowerCase();
    const user = student.user;
    if (!user) return false;
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower)
    );
  });

  const studentColumns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (_: any, __: Student, index: number) => index + 1,
    },
    {
      title: 'Id',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 80,
      render: (id: number) => `${id}`,
    },
    {
      title: 'Student Name',
      key: 'name',
      render: (_: any, record: Student) => {
        const user = record.user;
        if (!user) return 'N/A';
        return (
          <Space>
            <Avatar size={40} style={{ backgroundColor: '#1890ff' }}>
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </Avatar>
            <div>
              <div style={{ fontWeight: 600 }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ color: '#8c8c8c', fontSize: 12 }}>
                @{user.username}
              </div>
            </div>
          </Space>
        );
      },
    },
    {
      title: 'Enrollment Date',
      dataIndex: 'enrollmentDate',
      key: 'enrollmentDate',
      render: (date: Date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '—'),
    },
    {
      title: 'Bank Name',
      key: 'bankName',
      render: (_: any, record: Student) => record.user?.bankName || '—',
    },
    {
      title: 'Pay Account',
      key: 'paymentAccount',
      render: (_: any, record: Student) => record.user?.paymentAccount || '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedStudent(record);
              setEditVisible(true);
            }}
            title="Edit"
          />
          <Popconfirm
            title="Delete Student"
            description="Are you sure you want to delete this student?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => message.info(`Deleted student #${record.studentId}`)}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} title="Delete" onClick={(e) => e.stopPropagation()} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Students</h1>

      {/* Error alerts */}
      {studentsError && (
        <Alert
          message="Failed to load students"
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Card>
        <Spin spinning={isStudentsLoading}>
          <div>
            <Space style={{ marginBottom: 16, display: 'flex' }}>
              <Input
                placeholder="Search students..."
                prefix={<SearchOutlined />}
                value={studentsSearch}
                onChange={(e) => setStudentsSearch(e.target.value)}
                style={{ width: 300 }}
              />
            </Space>
            <Table<Student>
              columns={studentColumns as any}
              dataSource={filteredStudents}
              rowKey="studentId"
              onRow={(record) => ({
                onClick: () => navigate(`/students/${record.studentId}`),
                style: { cursor: 'pointer' },
              })}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `Showing ${range[0]}-${range[1]} of ${total}`,
              }}
            />
          </div>
        </Spin>
      </Card>

      <StudentEditModal
        open={editVisible}
        student={selectedStudent || undefined}
        onCancel={() => {
          setEditVisible(false);
          setSelectedStudent(null);
        }}
        onSubmit={(values) => {
          // TODO: wire up to backend update endpoint when available
          message.success('Student updated (UI only)');
          setEditVisible(false);
          setSelectedStudent(null);
        }}
      />

    </div>
  );
};

export default StudentsPage;
