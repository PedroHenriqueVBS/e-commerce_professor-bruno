import React, { useState } from 'react';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';
import { useUsers } from '../hooks/useUser';

export const User: React.FC = () => {
  const { user } = useAuth();
  const { users, addUser, deleteUser, loading } = useUsers();

  const [newUser, setNewUser] = useState({ name: '', email: '' });

  const handleAdd = async () => {
    if (!newUser.name || !newUser.email) return;
    await addUser(newUser);
    setNewUser({ name: '', email: '' });
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Perfil do Usuário</h2>
        <p className="text-gray-600">Gerencie suas informações pessoais</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{user?.name}</h3>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-4 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <p className="text-lg text-gray-900">{user?.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <p className="text-lg text-gray-900">{user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID do Usuário
              </label>
              <p className="text-lg text-gray-900">#{user?.id}</p>
            </div>
          </div>
        </Card>

        {/* CRUD de usuários */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-3">Usuários cadastrados</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <ul className="space-y-2">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <span>
                    <strong>{u.name}</strong> — {u.email}
                  </span>
                  <Button variant="danger" onClick={() => deleteUser(u.id)}>
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-2">Adicionar novo usuário</h4>
            <input
              type="text"
              placeholder="Nome"
              className="border rounded p-2 w-full mb-2"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="E-mail"
              className="border rounded p-2 w-full mb-2"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Button variant="primary" onClick={handleAdd}>
              Adicionar Usuário
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
