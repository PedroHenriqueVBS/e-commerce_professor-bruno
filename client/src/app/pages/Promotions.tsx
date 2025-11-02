import React from 'react';
import { Card } from '../components/Card';
import { Tag } from 'lucide-react';

export const Promotions: React.FC = () => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Promoções</h2>
        <p className="text-gray-600">Gerencie as promoções e ofertas especiais</p>
      </div>

      <Card className="text-center py-12">
        <div className="flex justify-center mb-4">
          <Tag className="w-16 h-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
          Página de Promoções
        </h3>
        <p className="text-gray-500">
          Esta página está em desenvolvimento
        </p>
      </Card>
    </>
  );
};
