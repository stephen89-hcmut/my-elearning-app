// src/pages/StudentsPage.tsx
import React, { useMemo, useState } from 'react';
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
  Select,
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, deleteStudent, updateStudent } from '@/api/courses';
import { Student, UpdateStudentDto } from '@/types';
import { StudentEditModal } from '@/components';
import { useNavigate } from 'react-router-dom';

const StudentsPage: React.FC = () => {
  const [studentsSearch, setStudentsSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'has' | 'missing'>('all');
  const [editVisible, setEditVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch students from API
  const {
    data: studentsData = { data: [] },
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => getStudents(),
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: () => {
      message.success('Student deleted');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to delete student');
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDto }) => updateStudent(id, data),
    onSuccess: () => {
      message.success('Student updated');
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setEditVisible(false);
      setSelectedStudent(null);
    },
    onError: (error: any) => {
      const serverMsg = error?.response?.data?.message || error?.message;
      message.error(serverMsg || 'Failed to update student');
    },
  });

  // Filter students
  const filteredStudents = useMemo(() => {
    const searchLower = studentsSearch.toLowerCase();
    return (studentsData?.data || []).filter((student: Student) => {
      const user = student.user;
      if (!user) return false;
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower);

      const hasPayment = Boolean(user.paymentAccount);
      const matchesPayment =
        paymentFilter === 'all' ||
        (paymentFilter === 'has' && hasPayment) ||
        (paymentFilter === 'missing' && !hasPayment);

      return matchesSearch && matchesPayment;
    });
  }, [paymentFilter, studentsData, studentsSearch]);

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
      render: (id: string) => id,
    },
    {
      title: 'Student Name',
      key: 'name',
      sorter: (a: Student, b: Student) => {
        const aName = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.trim();
        const bName = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.trim();
        return aName.localeCompare(bName);
      },
      sortDirections: ['ascend', 'descend'],
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
      sorter: (a: Student, b: Student) => {
        const aDate = a.enrollmentDate ? new Date(a.enrollmentDate).getTime() : 0;
        const bDate = b.enrollmentDate ? new Date(b.enrollmentDate).getTime() : 0;
        return aDate - bDate;
      },
      sortDirections: ['ascend', 'descend'],
      render: (date: Date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '—'),
    },
    {
      title: 'Bank Name',
      key: 'bankName',
      sorter: (a: Student, b: Student) => (a.user?.bankName || '').localeCompare(b.user?.bankName || ''),
      sortDirections: ['ascend', 'descend'],
      render: (_: any, record: Student) => record.user?.bankName || '—',
    },
    {
      title: 'Pay Account',
      key: 'paymentAccount',
      sorter: (a: Student, b: Student) => (a.user?.paymentAccount || '').localeCompare(b.user?.paymentAccount || ''),
      sortDirections: ['ascend', 'descend'],
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
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/students/${record.studentId}`);
            }}
            title="View"
          />
          <Popconfirm
            title="Delete Student"
            description="Are you sure you want to delete this student?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteStudentMutation.mutate(record.studentId)}
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
            <Space style={{ marginBottom: 16, display: 'flex' }} wrap>
              <Input
                placeholder="Search students..."
                prefix={<SearchOutlined />}
                value={studentsSearch}
                onChange={(e) => setStudentsSearch(e.target.value)}
                style={{ width: 300 }}
                allowClear
              />
              <Select
                value={paymentFilter}
                style={{ width: 200 }}
                onChange={(value) => setPaymentFilter(value)}
                options={[
                  { label: 'All payment status', value: 'all' },
                  { label: 'Has payment account', value: 'has' },
                  { label: 'Missing payment account', value: 'missing' },
                ]}
              />
            </Space>
            <Table<Student>
              columns={studentColumns as any}
              dataSource={filteredStudents}
              rowKey="studentId"
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
        loading={updateStudentMutation.isPending}
        onCancel={() => {
          setEditVisible(false);
          setSelectedStudent(null);
        }}
        onSubmit={(values) => {
          if (!selectedStudent) return;
          const payload: UpdateStudentDto = {
            username: values.username,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            bankName: values.bankName,
            paymentAccount: values.paymentAccount,
          };
          updateStudentMutation.mutate({ id: selectedStudent.studentId, data: payload });
        }}
      />

    </div>
  );
};

export default StudentsPage;
