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
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getInstructors } from '@/api/courses';
import { InstructorDetailModal } from '@/components';

const InstructorsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | undefined>(undefined);

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
      render: (id: number) => `#${id}`,
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
          <Button size="small" onClick={() => { setSelectedInstructorId(record.instructorId); setDetailVisible(true); }}>View</Button>
          <Button size="small" onClick={() => message.info(`Edit instructor #${record.instructorId}`)}>Edit</Button>
          <Popconfirm
            title="Delete Instructor"
            description="Are you sure you want to delete this instructor?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => message.info(`Deleted instructor #${record.instructorId}`)}
          >
            <Button size="small" danger>Delete</Button>
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
            <Button type="primary">+ Add Instructor</Button>
          </Space>
        }
      >
        <Spin spinning={isLoading}>
          <Table<any>
            columns={columns as any}
            dataSource={filteredInstructors.map((inst: any, idx: number) => ({ ...inst, key: inst.instructorId || idx }))}
            onRow={(record) => ({
              onClick: () => {
                setSelectedInstructorId(record.instructorId);
                setDetailVisible(true);
              },
            })}
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </Card>

      <InstructorDetailModal
        visible={detailVisible}
        instructorId={selectedInstructorId}
        onClose={() => {
          setDetailVisible(false);
          setSelectedInstructorId(undefined);
        }}
      />
    </div>
  );
};

export default InstructorsPage;
