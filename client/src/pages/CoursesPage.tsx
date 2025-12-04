// src/pages/CoursesPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { CourseTable } from '@/components';
import { getCourses, deleteCourse } from '@/api/courses';

const CoursesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const queryClient = useQueryClient();

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ['courses', page, limit],
    queryFn: () => getCourses(page, limit),
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

  const handleDelete = (courseId: number) => {
    deleteCourseMutation.mutate(courseId);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Courses Management</h1>
      <CourseTable
        courses={coursesData?.data || []}
        loading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CoursesPage;
