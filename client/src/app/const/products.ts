export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  createdAt?: string;
}

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Notebook Dell Inspiron 15',
    description: 'Notebook com processador Intel Core i7, 16GB RAM, 512GB SSD',
    price: 3999.99,
    category: 'Eletrônicos',
    stock: 15,
    image: 'https://via.placeholder.com/300x200?text=Notebook+Dell',
    createdAt: '2025-10-01',
  },
  {
    id: 2,
    name: 'Mouse Logitech MX Master 3',
    description: 'Mouse ergonômico sem fio com precisão de 4000 DPI',
    price: 459.99,
    category: 'Periféricos',
    stock: 30,
    image: 'https://via.placeholder.com/300x200?text=Mouse+Logitech',
    createdAt: '2025-10-05',
  },
  {
    id: 3,
    name: 'Teclado Mecânico Keychron K2',
    description: 'Teclado mecânico 75% com switches Gateron Brown',
    price: 599.99,
    category: 'Periféricos',
    stock: 20,
    image: 'https://via.placeholder.com/300x200?text=Teclado+Keychron',
    createdAt: '2025-10-10',
  },
  {
    id: 4,
    name: 'Monitor LG UltraWide 29"',
    description: 'Monitor 29 polegadas UltraWide Full HD IPS',
    price: 1299.99,
    category: 'Monitores',
    stock: 8,
    image: 'https://via.placeholder.com/300x200?text=Monitor+LG',
    createdAt: '2025-10-12',
  },
  {
    id: 5,
    name: 'Headset HyperX Cloud II',
    description: 'Headset gamer com som surround 7.1 virtual',
    price: 499.99,
    category: 'Áudio',
    stock: 25,
    image: 'https://via.placeholder.com/300x200?text=Headset+HyperX',
    createdAt: '2025-10-15',
  },
  {
    id: 6,
    name: 'Webcam Logitech C920',
    description: 'Webcam Full HD 1080p com microfone integrado',
    price: 399.99,
    category: 'Periféricos',
    stock: 12,
    image: 'https://via.placeholder.com/300x200?text=Webcam+Logitech',
    createdAt: '2025-10-18',
  },
  {
    id: 7,
    name: 'SSD Samsung 970 EVO Plus 1TB',
    description: 'SSD NVMe M.2 com velocidades de até 3500MB/s',
    price: 799.99,
    category: 'Armazenamento',
    stock: 18,
    image: 'https://via.placeholder.com/300x200?text=SSD+Samsung',
    createdAt: '2025-10-20',
  },
  {
    id: 8,
    name: 'Cadeira Gamer DXRacer',
    description: 'Cadeira ergonômica para longas sessões de trabalho',
    price: 1899.99,
    category: 'Mobília',
    stock: 5,
    image: 'https://via.placeholder.com/300x200?text=Cadeira+DXRacer',
    createdAt: '2025-10-22',
  },
];
