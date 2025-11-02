import React from 'react';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export const User: React.FC = () => {
  const { user } = useAuth();

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

            <div className="pt-4">
              <Button variant="primary">Editar Perfil</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};
