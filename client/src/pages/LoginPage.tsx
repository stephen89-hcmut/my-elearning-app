import React, { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Spin } from 'antd';
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

  const fillDemoAccount = () => {
    form.setFieldsValue({
      username: 'sManager',
      password: 'password123',
    });
  };

  return (
    <div className="login-container">
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={22} sm={18} md={12} lg={8}>
          <Card className="login-card">
            {/* Logo and Title */}
            <div className="login-header">
              <div className="logo">📚</div>
              <h1 className="logo-text">EduCore</h1>
              <p className="logo-subtitle">E-Learning Management System</p>
            </div>

            {/* Login Form */}
            <Spin spinning={loading}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark="optional"
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
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    loading={loading}
                  >
                    Sign In
                  </Button>
                </Form.Item>
              </Form>

              {/* Demo Account Section */}
              <div className="demo-account">
                <h4>Demo Account</h4>
                <div className="demo-credentials">
                  <div className="credential-row">
                    <label>Username:</label>
                    <code>sManager</code>
                  </div>
                  <div className="credential-row">
                    <label>Password:</label>
                    <code>password123</code>
                  </div>
                </div>
                <Button
                  type="default"
                  block
                  size="large"
                  onClick={fillDemoAccount}
                  style={{ marginTop: '12px' }}
                >
                  Use Demo Account
                </Button>
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
