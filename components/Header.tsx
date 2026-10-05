import React from 'react';
import { HistoryIcon } from './icons/HistoryIcon';

interface HeaderProps {
  onViewProgress?: () => void;
  onNewAnalysis: () => void;
  currentView?: string;
}

export const Header: React.FC<HeaderProps> = ({ onViewProgress, onNewAnalysis, currentView }) => {
  return (
    <header className="w-full p-4 flex justify-between items-center bg-black sticky top-0 z-10 border-b border-gray-800">
      <h1 className="text-2xl font-bold tracking-tighter text-white cursor-pointer" onClick={onNewAnalysis}>
        Looks Maxxi <span className="text-cyan-400">BP</span>
      </h1>
      <div className="flex items-center space-x-4">
        {onViewProgress && currentView !== 'progress' && (
          <button onClick={onViewProgress} className="text-gray-400 hover:text-white transition-colors" title="History">
            <HistoryIcon />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
