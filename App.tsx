import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import { MENU_STRUCTURE } from './constants';

const App: React.FC = () => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>('dashboard');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Helper to find menu ID by name
  const findMenuIdByName = (name: string): string | null => {
    // Flatten menu structure for searching
    const queue = [...MENU_STRUCTURE];
    while (queue.length > 0) {
      const item = queue.shift();
      if (item) {
        // Simple partial match logic
        if (item.label.includes(name) || name.includes(item.label)) {
          return item.id;
        }
        if (item.children) {
          queue.push(...item.children);
        }
      }
    }
    return null;
  };

  const handleNavigate = (menuName: string) => {
    const menuId = findMenuIdByName(menuName);
    
    // Show toast for visual feedback
    setToastMessage(`이동 중: ${menuName}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    if (menuId) {
      setActiveMenuId(menuId);
    }
  };

  const handleMenuClick = (id: string) => {
    setActiveMenuId(id);
  };

  return (
    <div className="flex h-screen bg-toonation-darker text-toonation-text overflow-hidden">
      {/* Sidebar Mockup */}
      <Sidebar activeMenuId={activeMenuId} onMenuClick={handleMenuClick} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* On Mobile, show a simple header since sidebar is hidden */}
        <div className="md:hidden p-4 bg-toonation-dark border-b border-toonation-card flex items-center justify-center">
             <h1 className="text-xl font-bold text-toonation-primary">Toonation Helper</h1>
        </div>

        <ChatInterface onNavigate={handleNavigate} />

        {/* Toast Notification */}
        {showToast && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
            <div className="bg-toonation-primary text-black px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;