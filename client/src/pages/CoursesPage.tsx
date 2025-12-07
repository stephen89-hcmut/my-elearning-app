// src/pages/CoursesPage.tsx
import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Button, Form, Alert, Input, Select, Space } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { CourseTable, CourseFormModal } from '@/components';
import { getCourses, deleteCourse, createCourse, updateCourse, getTopics, getInstructors } from '@/api/courses';
import { CourseLevel, CreateCourseDto, UpdateCourseDto, Instructor, Topic } from '@/types';

const CoursesPage: React.FC = () => {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<CourseLevel | 'all'>('all');
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: coursesData, isLoading, error: coursesError } = useQuery({
    queryKey: ['courses', page, limit],
    queryFn: () => getCourses(page, limit),
  });

  const { data: topicsData } = useQuery({
    queryKey: ['topics'],
    queryFn: getTopics,
  });

  const { data: instructorsData } = useQuery({
    queryKey: ['instructors-all'],
    queryFn: () => getInstructors(1, 200),
  });

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      message.success('Course created successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setFormModalVisible(false);
      form.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to create course');
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: UpdateCourseDto }) =>
      updateCourse(courseId, data),
    onSuccess: () => {
      message.success('Course updated successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setFormModalVisible(false);
      form.resetFields();
      setSelectedCourse(null);
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update course');
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      message.success('Course deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete course');
    },
  });

  const handleCreate = () => {
    setSelectedCourse(null);
    form.resetFields();
    setFormModalVisible(true);
  };

  const handleEdit = (courseId: string) => {
    const course = coursesData?.data.find((c) => c.courseId === courseId);
    if (course) {
      setSelectedCourse(course);
      setFormModalVisible(true);
    }
  };

  const handleDelete = (courseId: string) => {
    deleteCourseMutation.mutate(courseId);
  };

  const handleFormSubmit = (data: CreateCourseDto | UpdateCourseDto) => {
    if (selectedCourse) {
      updateCourseMutation.mutate({
        courseId: selectedCourse.courseId,
        data: data as UpdateCourseDto,
      });
    } else {
      createCourseMutation.mutate(data as CreateCourseDto);
    }
  };

  const filteredCourses = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return (coursesData?.data || []).filter((course) => {
      const matchesSearch =
        !search ||
        course.courseName.toLowerCase().includes(search) ||
        course.language?.toLowerCase().includes(search);
      const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [coursesData, levelFilter, searchTerm]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Courses</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Space size="middle" wrap>
            <Input
              placeholder="Search by name or language"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 260 }}
              allowClear
            />
            <Select
              style={{ width: 180 }}
              value={levelFilter}
              onChange={setLevelFilter}
              suffixIcon={<FilterOutlined />}
              options={[
                { label: 'All levels', value: 'all' },
                { label: 'Beginner', value: CourseLevel.BEGINNER },
                { label: 'Intermediate', value: CourseLevel.INTERMEDIATE },
                { label: 'Advanced', value: CourseLevel.ADVANCED },
              ]}
            />
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create Course
          </Button>
        </div>
      </div>

      {coursesError && (
        <Alert
          message="Failed to load courses"
          description="Please ensure the backend API is running."
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <CourseTable
        courses={filteredCourses}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(id) => {
          // navigate directly to detail page
          window.location.href = `/courses/${id}`;
        }}
      />

      <CourseFormModal
        visible={formModalVisible}
        title={selectedCourse ? 'Edit Course' : 'Create New Course'}
        loading={
          createCourseMutation.isPending || updateCourseMutation.isPending
        }
        course={selectedCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setFormModalVisible(false);
          form.resetFields();
          setSelectedCourse(null);
        }}
        form={form}
        topics={topicsData || []}
        instructors={instructorsData?.data || []}
      />
    </div>
  );
};

export default CoursesPage;
