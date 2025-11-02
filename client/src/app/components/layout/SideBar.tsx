import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Tag, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
  { path: '/products', label: 'Produtos', icon: Package },
  { path: '/promotions', label: 'Promoções', icon: Tag },
  { path: '/user', label: 'Perfil', icon: User },
];

export const SideBar: React.FC = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isExpanded ? '16rem' : '5rem');
  }, [isExpanded]);

  return (
    <aside className={`fixed left-0 top-0 ${isExpanded ? 'w-64' : 'w-20'} bg-gray-800 h-screen text-white overflow-y-auto transition-all duration-300`}>
      <div className="flex justify-end p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          aria-label={isExpanded ? 'Minimizar sidebar' : 'Expandir sidebar'}
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={!isExpanded ? item.label : undefined}
                >
                  {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                  {isExpanded && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
