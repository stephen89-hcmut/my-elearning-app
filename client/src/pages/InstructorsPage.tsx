import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Avatar,
  Input,
  Space,
  Spin,
  Alert,
  Button,
  Popconfirm,
  message,
} from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInstructors, deleteInstructor, updateInstructor } from '@/api/courses';
import { UpdateInstructorDto } from '@/types';
import { InstructorEditModal } from '@/components';
import { useNavigate } from 'react-router-dom';

const InstructorsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [editVisible, setEditVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<any | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch instructors from API
  const {
    data: instructorsData = { data: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => getInstructors(),
  });

  const filteredInstructors = (instructorsData?.data || []).filter((instructor: any) => {
    const searchLower = searchText.toLowerCase();
    const user = instructor.user;
    if (!user) return false;
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const deleteInstructorMutation = useMutation({
    mutationFn: (id: string) => deleteInstructor(id),
    onSuccess: () => {
      message.success('Instructor deleted');
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
    },
    onError: (error: any) => {
      message.error(error?.message || 'Failed to delete instructor');
    },
  });

  const updateInstructorMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInstructorDto }) => updateInstructor(id, data),
    onSuccess: () => {
      message.success('Instructor updated');
      queryClient.invalidateQueries({ queryKey: ['instructors'] });
      setEditVisible(false);
      setSelectedInstructor(null);
    },
    onError: (error: any) => {
      const serverMsg = error?.response?.data?.message || error?.message;
      message.error(serverMsg || 'Failed to update instructor');
    },
  });

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Id',
      dataIndex: 'instructorId',
      key: 'instructorId',
      width: 80,
      render: (id: string) => id,
    },
    {
      title: 'Instructor Name',
      dataIndex: 'user',
      key: 'name',
      render: (user: any, record: any) => (
        <Space>
          <Avatar
            size={40}
            style={{ backgroundColor: '#1890ff' }}
          >
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>
              {user.firstName} {user.lastName}
            </div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>@{record.user.username}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Teaching Field',
      dataIndex: 'teachingField',
      key: 'teachingField',
      render: (value: string) => value || '—',
    },
    {
      title: 'Bank Name',
      key: 'bankName',
      render: (_: any, record: any) => record.user?.bankName || '—',
    },
    {
      title: 'Pay Account',
      key: 'paymentAccount',
      render: (_: any, record: any) => record.user?.paymentAccount || '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedInstructor(record);
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
              navigate(`/instructors/${record.instructorId}`);
            }}
            title="View"
          />
          <Popconfirm
            title="Delete Instructor"
            description="Are you sure you want to delete this instructor?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteInstructorMutation.mutate(record.instructorId)}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} title="Delete" onClick={(e) => e.stopPropagation()} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Error alert */}
      {error && (
        <Alert
          message="Failed to load instructors"
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Instructor List */}
      <Card
        title="Instructor List"
        extra={
          <Space>
            <Input
              placeholder="Search instructors..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
          </Space>
        }
      >
        <Spin spinning={isLoading}>
          <Table<any>
            columns={columns as any}
            dataSource={filteredInstructors.map((inst: any, idx: number) => ({ ...inst, key: inst.instructorId || idx }))}
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </Card>

      <InstructorEditModal
        open={editVisible}
        instructor={selectedInstructor || undefined}
        loading={updateInstructorMutation.isPending}
        onCancel={() => {
          setEditVisible(false);
          setSelectedInstructor(null);
        }}
        onSubmit={(values) => {
          if (!selectedInstructor) return;
          const payload: UpdateInstructorDto = {
            username: values.username,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            bankName: values.bankName,
            paymentAccount: values.paymentAccount,
            teachingField: values.teaching_field,
            bio: values.bio,
          };
          updateInstructorMutation.mutate({ id: selectedInstructor.instructorId, data: payload });
        }}
      />
    </div>
  );
};

export default InstructorsPage;
