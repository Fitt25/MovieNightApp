import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './components/Authorization/Login';
import Register from './components/Authorization/Register';
import Dashboard from './components/Dashboard';
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));;

    return (
        <>
          <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <div className="content">
            <Routes>
              {!isAuthenticated ? (
                <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
                </>
              ) : (
                <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </div>
        </>
    );
};

export default App;
