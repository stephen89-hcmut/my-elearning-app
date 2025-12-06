import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      message.error((error as Error).message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card" bordered={false}>
          {/* Logo and Title */}
          <div className="login-header">
            <div className="logo-icon">📚</div>
            <h1 className="logo-text">EduCore</h1>
            <p className="logo-subtitle">E-Learning<br />Management<br />System</p>
          </div>

          {/* Login Form */}
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              autoComplete="off"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: 'Vui lòng nhập username' },
                  { min: 3, message: 'Username phải từ 3 ký tự trở lên' },
                ]}
              >
                <Input
                  placeholder="Enter your username"
                  prefix={<UserOutlined />}
                  size="large"
                  className="login-input"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập password' }]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  prefix={<LockOutlined />}
                  size="large"
                  className="login-input"
                />
              </Form.Item>

              <Form.Item style={{ marginTop: '24px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                  className="login-button"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
