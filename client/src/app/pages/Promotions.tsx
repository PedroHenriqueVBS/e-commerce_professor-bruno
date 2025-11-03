import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Tag, Trash2, Plus } from 'lucide-react';
import api from '../services/api';
import type { Promotion, CreatePromotionData } from '../types/Promotions';
import { mockProducts, type Product } from '../const/products';

export const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePromotionData>({
    product_id: null,
    discount: 0,
    start_date: null,
    end_date: null,
  });

  const fetchPromotions = async () => {
    try {
      const data = await api.get('/promotions');
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newPromotion = await api.post('/promotions', formData);
      if (newPromotion) {
        await fetchPromotions();
        setIsModalOpen(false);
        setFormData({
          product_id: null,
          discount: 0,
          start_date: null,
          end_date: null,
        });
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta promoção?')) return;
    
    try {
      await api.delete(`/promotions/${id}`);
      setPromotions(promotions.filter(promotion => promotion.id !== id));
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Promoções</h2>
          <p className="text-gray-600">Gerencie as promoções e ofertas especiais</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Promoção
        </Button>
      </div>

      {promotions.length === 0 ? (
        <Card className="text-center py-12">
          <div className="flex justify-center mb-4">
            <Tag className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            Nenhuma Promoção
          </h3>
          <p className="text-gray-500">
            Clique no botão acima para criar uma nova promoção
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                    {promotion.product_id ? (
                      <>
                        <h3 className="font-semibold text-lg">
                          {products.find(p => p.id === promotion.product_id)?.name || 'Produto não encontrado'}
                        </h3>
                        <p className="text-gray-500">
                          Preço original: R$ {products.find(p => p.id === promotion.product_id)?.price.toFixed(2)}
                        </p>
                      </>
                    ) : (
                  <h3 className="font-semibold text-lg">
                      Todos os produtos
                  </h3>
                    )}
                  <p className="text-gray-600">
                    Desconto: {promotion.discount}%
                  </p>
                    {promotion.product_id && (
                      <p className="text-green-600 font-medium">
                        Preço com desconto: R$ {(
                          (products.find(p => p.id === promotion.product_id)?.price || 0) * 
                          (1 - promotion.discount / 100)
                        ).toFixed(2)}
                      </p>
                    )}
                  {promotion.start_date && (
                    <p className="text-sm text-gray-500">
                      Início: {new Date(promotion.start_date).toLocaleDateString()}
                    </p>
                  )}
                  {promotion.end_date && (
                    <p className="text-sm text-gray-500">
                      Fim: {new Date(promotion.end_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button 
                  variant="danger" 
                  onClick={() => handleDeletePromotion(promotion.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Promoção"
      >
        <form onSubmit={handleCreatePromotion} className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-700">
                Produto (opcional)
              </label>
              <select
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                value={formData.product_id || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  product_id: e.target.value ? Number(e.target.value) : null
                }))}
              >
                <option value="">Todos os produtos</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - R$ {product.price.toFixed(2)}
                  </option>
                ))}
              </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Desconto (%)
            </label>
            <Input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                discount: Number(e.target.value)
              }))}
              required
              min="0"
              max="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Início
            </label>
            <Input
              type="date"
              value={formData.start_date || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                start_date: e.target.value || null
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data de Fim
            </label>
            <Input
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                end_date: e.target.value || null
              }))}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Promoção'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
