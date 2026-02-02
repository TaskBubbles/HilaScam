
import React from 'react';

interface ChaosPopupProps {
  id: number;
  top: number;
  left: number;
  message: string;
}

export const ChaosPopup: React.FC<ChaosPopupProps> = ({ top, left, message }) => {
  return (
    <div 
      className="fixed z-50 bg-gray-200 border-4 border-blue-800 shadow-2xl w-[85vw] md:w-80 flex flex-col font-sans pointer-events-auto"
      style={{ top: `${top}%`, left: `${left}%` }}
    >
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-1 flex justify-between items-center font-bold text-sm h-8">
        <span className="truncate mr-2">System Alert 0x{Math.floor(Math.random() * 9999)}</span>
        <button className="bg-red-500 w-6 h-6 flex items-center justify-center text-xs border border-white hover:bg-red-600 active:scale-95">X</button>
      </div>
      <div className="p-4 flex items-start gap-3 bg-gray-100 flex-1">
        <div className="text-4xl">❌</div>
        <div className="text-black text-sm font-bold break-words w-full">
          {message}
        </div>
      </div>
      <div className="p-2 flex justify-center bg-gray-200 border-t border-gray-300">
        <button className="w-full md:w-auto px-6 py-2 border-2 border-black bg-gray-300 shadow active:translate-y-1 text-black text-xs font-bold uppercase hover:bg-white transition-colors">
          OK
        </button>
      </div>
    </div>
  );
};
