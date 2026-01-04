import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './src/pages/HomePage';
import LoginPage from './src/pages/LoginPage';
import ConfirmationPage from './src/pages/ConfirmationPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />
    </Routes>
  );
};

export default App;