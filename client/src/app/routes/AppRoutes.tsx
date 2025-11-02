import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Products } from '../pages/Products';
import { Promotions } from '../pages/Promotions';
import { User } from '../pages/User';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

export const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rota pública - Login */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/products" replace /> : <Login />
        } 
      />
      
      {/* Rota pública - Registro */}
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/promotions"
        element={
          <ProtectedRoute>
            <Promotions />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        }
      />

      {/* Rota padrão */}
      <Route 
        path="/" 
        element={
          <Navigate to={isAuthenticated ? "/products" : "/login"} replace />
        } 
      />

      {/* Rota 404 */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated ? "/products" : "/login"} replace />
        } 
      />
    </Routes>
  );
};
