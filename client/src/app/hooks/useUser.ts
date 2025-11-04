import { useState, useEffect } from 'react';
import { type User } from '../types/Users';
import { api } from '../services/api';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/users');
      setUsers(data);
    } catch {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      const data = await api.post('/users', userData);
      setUsers((prev) => [...prev, data]);
    } catch {
      setError('Erro ao adicionar usuário');
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const data = await api.put(`/users/${id}`, userData);
      setUsers((prev) => prev.map((u) => (u.id === id ? data : u)));
    } catch {
      setError('Erro ao atualizar usuário');
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError('Erro ao remover usuário');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, addUser, updateUser, deleteUser };
};
