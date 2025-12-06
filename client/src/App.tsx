// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { Sidebar, Header } from '@/components';
import { Dashboard, CoursesPage, StudentsPage, LoginPage, InstructorsPage } from '@/pages';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

const { Content } = Layout;

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout>
        <Header />
        <Content style={{ background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/instructors" element={<InstructorsPage />} />
                  <Route path="/reports" element={<StudentsPage />} />
                  <Route path="/settings" element={<StudentsPage />} />
                </Routes>
              </ProtectedLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
