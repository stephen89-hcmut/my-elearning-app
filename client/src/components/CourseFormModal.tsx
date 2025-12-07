// src/components/CourseFormModal.tsx
import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  FormInstance,
  Row,
  Col,
} from 'antd';
import { Course, CreateCourseDto, UpdateCourseDto, CourseLevel } from '@/types';

interface CourseFormModalProps {
  visible: boolean;
  title: string;
  loading: boolean;
  course?: Course;
  onSubmit: (data: CreateCourseDto | UpdateCourseDto) => void;
  onCancel: () => void;
  form: FormInstance;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({
  visible,
  title,
  loading,
  course,
  onSubmit,
  onCancel,
  form,
}) => {
  useEffect(() => {
    if (visible && course) {
      form.setFieldsValue({
        courseName: course.courseName,
        description: course.description,
        language: course.language,
        price: Number(course.price ?? 0),
        minScore: course.minScore !== undefined && course.minScore !== null ? Number(course.minScore) : undefined,
        level: course.level,
      });
    } else if (visible && !course) {
      form.resetFields();
    }
  }, [visible, course, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        price: values.price !== undefined && values.price !== null ? Number(values.price) : values.price,
        minScore: values.minScore !== undefined && values.minScore !== null ? Number(values.minScore) : values.minScore,
        level: values.level !== undefined ? Number(values.level) : undefined,
      } as CreateCourseDto | UpdateCourseDto;

      onSubmit(payload);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Save
        </Button>,
      ]}
      width={700}
      styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        {/* Row 1: Course Name */}
        <Form.Item
          label="Course Name"
          name="courseName"
          rules={[
            { required: true, message: 'Course name is required' },
            { min: 3, message: 'Course name must be at least 3 characters' },
            { max: 255, message: 'Course name cannot exceed 255 characters' },
          ]}
          validateTrigger="onBlur"
        >
          <Input
            placeholder="e.g., Introduction to Database Systems"
            size="large"
          />
        </Form.Item>

        {/* Row 2: Description */}
        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea
            rows={3}
            placeholder="Course description..."
            maxLength={1000}
          />
        </Form.Item>

        {/* Language */}
        <Form.Item
          label="Language"
          name="language"
          rules={[{ required: true, message: 'Please select language' }]}
        >
          <Select placeholder="Select language" size="large">
            <Select.Option value="English">English</Select.Option>
            <Select.Option value="Vietnamese">Vietnamese</Select.Option>
            <Select.Option value="French">French</Select.Option>
            <Select.Option value="Spanish">Spanish</Select.Option>
          </Select>
        </Form.Item>

        {/* Row 4: Price & Level */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Price ($)"
              name="price"
              rules={[
                { required: true, message: 'Please enter price' },
                { type: 'number', min: 0, message: 'Price must be greater than or equal to 0', transform: (value) => Number(value) },
              ]}
            >
              <InputNumber
                placeholder="0"
                min={0}
                step={0.01}
                size="large"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Level"
              name="level"
              rules={[{ required: true, message: 'Please select level' }]}
            >
              <Select placeholder="Select level" size="large">
                <Select.Option value={CourseLevel.BEGINNER}>Beginner</Select.Option>
                <Select.Option value={CourseLevel.INTERMEDIATE}>Intermediate</Select.Option>
                <Select.Option value={CourseLevel.ADVANCED}>Advanced</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Minimum Score */}
        <Form.Item
          label="Minimum Score for Certificate (0-100)"
          name="minScore"
          rules={[
            { type: 'number', min: 0, max: 100, message: 'Score must be between 0 and 100', transform: (value) => Number(value) },
          ]}
        >
          <InputNumber
            placeholder="50"
            min={0}
            max={100}
            step={1}
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CourseFormModal;
