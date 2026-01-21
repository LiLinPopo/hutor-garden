import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Cultures from './components/Cultures';
import CultureDetail from './components/CultureDetail';
import Statistics from './components/Statistics';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <h1>🌱 Менеджер огорода</h1>
          <div className="nav-links">
            <Link to="/">Культуры</Link>
            <Link to="/statistics">Статистика</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Cultures />} />
          <Route path="/culture/:id" element={<CultureDetail />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
