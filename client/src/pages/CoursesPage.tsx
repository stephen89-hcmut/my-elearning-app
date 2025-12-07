// src/pages/CoursesPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message, Button, Form, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CourseTable, CourseFormModal, CourseDetailModal } from '@/components';
import { getCourses, deleteCourse, createCourse, updateCourse, getTopics, getInstructors } from '@/api/courses';
import { CreateCourseDto, UpdateCourseDto } from '@/types';

const CoursesPage: React.FC = () => {
  const [page] = useState(1);
  const [limit] = useState(10);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: coursesData, isLoading, error: coursesError } = useQuery({
    queryKey: ['courses', page, limit],
    queryFn: () => getCourses(page, limit),
  });

  const { data: topicsData = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: () => getTopics(),
  });

  const { data: instructorsData = { data: [] } } = useQuery({
    queryKey: ['instructors'],
    queryFn: () => getInstructors(0, 100),
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
      setDetailModalVisible(false);
      setSelectedCourse(null);
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

  const handleEdit = (courseId: number) => {
    const course = coursesData?.data.find((c) => c.courseId === courseId);
    if (course) {
      setSelectedCourse(course);
      setFormModalVisible(true);
      setDetailModalVisible(false);
    }
  };

  const handleView = (courseId: number) => {
    const course = coursesData?.data.find((c) => c.courseId === courseId);
    if (course) {
      setSelectedCourse(course);
      setDetailModalVisible(true);
    }
  };

  const handleDelete = (courseId: number) => {
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

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Courses</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Create Course
        </Button>
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
        courses={coursesData?.data || []}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <CourseFormModal
        visible={formModalVisible}
        title={selectedCourse ? 'Edit Course' : 'Create New Course'}
        loading={
          createCourseMutation.isPending || updateCourseMutation.isPending
        }
        course={selectedCourse}
        instructors={instructorsData.data}
        topics={topicsData}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setFormModalVisible(false);
          form.resetFields();
          setSelectedCourse(null);
        }}
        form={form}
      />

      <CourseDetailModal
        visible={detailModalVisible}
        course={selectedCourse}
        loading={false}
        onEdit={() => handleEdit(selectedCourse.courseId)}
        onDelete={() => handleDelete(selectedCourse.courseId)}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedCourse(null);
        }}
      />
    </div>
  );
};

export default CoursesPage;
