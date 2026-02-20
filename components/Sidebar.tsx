import React, { useState } from 'react';
import { MENU_STRUCTURE } from '../constants';
import { MenuItem } from '../types';

interface SidebarProps {
  activeMenuId: string | null;
  onMenuClick: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenuId, onMenuClick }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['widgets', 'every-voice', 'donation-manage', 'account']);

  const toggleExpand = (id: string) => {
    setExpandedMenus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const renderMenu = (item: MenuItem, depth = 0) => {
    const isActive = activeMenuId === item.id || (item.children && item.children.some(child => child.id === activeMenuId));
    const isExpanded = expandedMenus.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className="w-full">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpand(item.id);
            } else {
              onMenuClick(item.id);
            }
          }}
          className={`
            w-full text-left px-4 py-3 flex items-center justify-between
            transition-colors duration-200
            ${isActive && !hasChildren ? 'bg-toonation-primary text-black font-bold' : 'text-toonation-text hover:bg-toonation-card'}
            ${depth > 0 ? 'pl-8 text-sm' : 'font-medium'}
          `}
        >
          <span>{item.label}</span>
          {hasChildren && (
            <span className="text-xs text-toonation-muted">
              {isExpanded ? '▲' : '▼'}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="bg-toonation-darker">
            {item.children!.map(child => renderMenu(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-toonation-dark border-r border-toonation-card flex flex-col h-full overflow-y-auto shrink-0 hidden md:flex">
      <div className="p-6 border-b border-toonation-card">
        <h1 className="text-2xl font-bold text-toonation-primary italic">Toonation</h1>
        <p className="text-xs text-toonation-muted mt-1">Creator Studio</p>
      </div>
      <nav className="flex-1 py-4">
        {MENU_STRUCTURE.map(item => renderMenu(item))}
      </nav>
      <div className="p-4 border-t border-toonation-card text-xs text-toonation-muted text-center">
        © Toonation Creator Helper
      </div>
    </div>
  );
};

export default Sidebar;