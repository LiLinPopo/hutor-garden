import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, Typography } from 'antd';
import {
  HomeOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import Cultures from './components/Cultures';
import CultureDetail from './components/CultureDetail';
import Statistics from './components/Statistics';
import './styles/App.css';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="light"
      >
        <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
            🌱 Огород
          </Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: <Link to="/">Культуры</Link>,
            },
            {
              key: '2',
              icon: <BarChartOutlined />,
              label: <Link to="/statistics">Статистика</Link>,
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          padding: 0, 
          background: '#fff',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ padding: '0 24px' }}>
            <Title level={2} style={{ margin: '16px 0' }}>
              Менеджер огорода
            </Title>
          </div>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ 
            padding: 24, 
            minHeight: 360,
            background: '#fff',
            borderRadius: '8px'
          }}>
            <Routes>
              <Route path="/" element={<Cultures />} />
              <Route path="/culture/:id" element={<CultureDetail />} />
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Менеджер огорода ©2026
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;