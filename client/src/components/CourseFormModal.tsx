// src/components/CourseFormModal.tsx
import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Button,
  FormInstance,
  Row,
  Col,
} from 'antd';
import { Course, CreateCourseDto, UpdateCourseDto, Topic } from '@/types';

interface CourseFormModalProps {
  visible: boolean;
  title: string;
  loading: boolean;
  course?: Course;
  instructors?: any[];
  topics: Topic[];
  onSubmit: (data: CreateCourseDto | UpdateCourseDto) => void;
  onCancel: () => void;
  form: FormInstance;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({
  visible,
  title,
  loading,
  course,
  topics,
  onSubmit,
  onCancel,
  form,
}) => {
  useEffect(() => {
    if (visible && course) {
      form.setFieldsValue({
        courseName: course.courseName,
        description: course.description,
        instructor: course.instructor?.instructorId,
        language: course.language,
        price: course.price,
        minScore: course.minScore,
        level: course.level,
        topicIds: course.topics?.map((t) => t.topicId) || [],
      });
    } else if (visible && !course) {
      form.resetFields();
    }
  }, [visible, course, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const mockInstructors = [
    { id: 1, name: 'Nguyen Minh Tan' },
    { id: 2, name: 'Pham Thi Hoa' },
    { id: 3, name: 'Le Thi Anh' },
  ];

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
          {course ? 'Update Course' : 'Create Course'}
        </Button>,
      ]}
      width={700}
      bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
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

        {/* Row 3: Instructor & Language */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Instructor"
              name="instructor"
              rules={[{ required: true, message: 'Please select an instructor' }]}
            >
              <Select
                placeholder="Select instructor"
                size="large"
              >
                {mockInstructors.map((inst) => (
                  <Select.Option key={inst.id} value={inst.id}>
                    {inst.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        {/* Row 4: Price & Level */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Price ($)"
              name="price"
              rules={[
                { required: true, message: 'Please enter price' },
                { type: 'number', min: 0, message: 'Price must be greater than or equal to 0' },
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
                <Select.Option value="Beginner">Beginner</Select.Option>
                <Select.Option value="Intermediate">Intermediate</Select.Option>
                <Select.Option value="Advanced">Advanced</Select.Option>
                <Select.Option value="Expert">Expert</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Row 5: Minimum Score */}
        <Form.Item
          label="Minimum Score for Certificate (0-100)"
          name="minScore"
          rules={[
            { type: 'number', min: 0, max: 100, message: 'Score must be between 0 and 100' },
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

        {/* Row 6: Topics */}
        <Form.Item
          label="Topics (Select at least one)"
          name="topicIds"
          rules={[
            { required: true, message: 'Please select at least one topic' },
            { 
              validator: (_, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(new Error('Please select at least one topic'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              {topics.map((topic) => (
                <Col span={12} key={topic.topicId} style={{ marginBottom: 8 }}>
                  <Checkbox value={topic.topicId}>
                    {topic.topicName}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseFormModal;
