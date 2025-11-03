import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { Alert } from '../components/Alert';
import { mockProducts } from '../const/products';
import type { Product } from '../const/products';
import api from '../services/api';
import type { Promotion } from '../types/Promotions';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  // Carregar produtos mockados
  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Promotions state and fetch
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const fetchPromotions = async () => {
    try {
      const data = await api.get('/promotions');
      // api.get returns parsed JSON (array)
      setPromotions(Array.isArray(data) ? data : []);
    } catch (error) {
      // ignore errors here (server may be down during dev)
      console.error('Error fetching promotions in Products:', error);
    }
  };

  useEffect(() => {
    fetchPromotions();
    // refresh promotions when window/tab regains focus
    window.addEventListener('focus', fetchPromotions);
    return () => window.removeEventListener('focus', fetchPromotions);
  }, []);

  // Filtrar produtos
  useEffect(() => {
    let filtered = products;

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  // Derived products with applied promotion (if any)
  const productsWithPromotions = filteredProducts.map(p => {
    // find promotions that apply: either specific product_id or global (null)
    const applicable = promotions.filter(pr => pr.product_id === p.id || pr.product_id === null);
    if (applicable.length === 0) return { product: p, promotion: undefined, discountedPrice: undefined };

    // choose the highest discount among applicable promotions
    const best = applicable.reduce((acc, cur) => (cur.discount > acc.discount ? cur : acc), applicable[0]);
    const discountedPrice = +(p.price * (1 - best.discount / 100)).toFixed(2);
    return { product: p, promotion: best, discountedPrice };
  });

  // Obter categorias únicas
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      setAlert({ type: 'error', message: 'Preencha todos os campos obrigatórios!' });
      return;
    }

    const newProduct: Product = {
      id: selectedProduct ? selectedProduct.id : products.length + 1,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      image: 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(formData.name),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (selectedProduct) {
      // Atualizar produto
      setProducts(products.map(p => p.id === selectedProduct.id ? newProduct : p));
      setAlert({ type: 'success', message: 'Produto atualizado com sucesso!' });
    } else {
      // Adicionar novo produto
      setProducts([...products, newProduct]);
      setAlert({ type: 'success', message: 'Produto adicionado com sucesso!' });
    }

    handleCloseModal();
    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(p => p.id !== id));
      setAlert({ type: 'success', message: 'Produto excluído com sucesso!' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <>
      {/* Alert */}
      {alert && (
        <div className="mb-4">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Cabeçalho da página */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gestão de Produtos</h2>
        <p className="text-gray-600">Gerencie o catálogo de produtos da sua loja</p>
      </div>

      {/* Filtros e Ações */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Buscar produtos"
              placeholder="Digite o nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Button onClick={() => handleOpenModal()} variant="primary">
            + Novo Produto
          </Button>
        </div>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Total de Produtos</p>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Categorias</p>
            <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Estoque Total</p>
            <p className="text-3xl font-bold text-gray-900">
              {products.reduce((sum, p) => sum + p.stock, 0)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Valor Total</p>
            <p className="text-2xl font-bold text-green-600">
              {formatPrice(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
            </p>
          </div>
        </Card>
      </div>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {productsWithPromotions.map(({ product, promotion, discountedPrice }) => (
          <Card key={product.id} hoverable>
            <div className="relative">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'><rect width='100%25' height='100%25' fill='%23e5e7eb'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='18'>No%20image</text></svg>";
                  }}
                />
              )}

              {promotion && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {promotion.discount}% OFF
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  {product.category}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  product.stock > 10 ? 'bg-green-100 text-green-800' :
                  product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Estoque: {product.stock}
                </span>
              </div>

              <div className="pt-2 border-t">
                {discountedPrice ? (
                  <div>
                    <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                    <p className="text-2xl font-bold text-green-600">{formatPrice(discountedPrice)}</p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="small"
                  variant="secondary"
                  fullWidth
                  onClick={() => handleOpenModal(product)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  fullWidth
                  onClick={() => handleDelete(product.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
          <p className="text-gray-400 mt-2">Tente ajustar os filtros ou adicione novos produtos</p>
        </Card>
      )}

      {/* Modal de Adicionar/Editar Produto */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedProduct ? 'Editar Produto' : 'Novo Produto'}
        size="medium"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {selectedProduct ? 'Atualizar' : 'Adicionar'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Produto *"
            placeholder="Digite o nome do produto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Digite a descrição do produto"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço (R$) *"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              fullWidth
              required
            />
            
            <Input
              label="Estoque"
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              fullWidth
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Eletrônicos">Eletrônicos</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Monitores">Monitores</option>
              <option value="Áudio">Áudio</option>
              <option value="Armazenamento">Armazenamento</option>
              <option value="Mobília">Mobília</option>
            </select>
          </div>
        </form>
      </Modal>
    </>
  );
};
