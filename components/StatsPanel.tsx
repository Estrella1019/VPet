import React from 'react';
import { UserStats } from '../types';

interface StatsPanelProps {
  stats: UserStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-sm border-2 border-white w-full max-w-sm">
      <h3 className="text-textSub text-xs uppercase tracking-widest font-black mb-4 flex items-center gap-2">
        <span>❤️</span> Status
      </h3>
      
      <div className="space-y-4">
        {/* Level */}
        <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
            <span className="text-sm text-yellow-700 font-bold">Friendship Lv.</span>
            <div className="flex items-center gap-1">
               <span className="text-xl">⭐</span>
               <span className="text-2xl font-black text-yellow-500">{stats.level}</span>
            </div>
        </div>

        {/* Intimacy Hearts */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-textSub font-bold">
            <span>Love</span>
            <span>{stats.intimacy}%</span>
          </div>
          <div className="w-full bg-gray-100 h-5 rounded-full overflow-hidden border border-gray-200 relative">
             {/* Pattern background */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIi8+CjxjaXJjbGUgY3g9IjQiIGN5PSI0IiByPSIxLjUiIGZpbGw9IiNmYmM1YzUiLz4KPC9zdmc+')] opacity-30"></div>
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out flex items-center"
              style={{ width: `${stats.intimacy}%` }}
            >
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-textSub font-bold">
            <span>Energy</span>
            <span>{stats.healthScore}%</span>
          </div>
          <div className="w-full bg-gray-100 h-5 rounded-full overflow-hidden border border-gray-200">
             <div 
              className={`h-full transition-all duration-1000 ease-out ${stats.healthScore > 50 ? 'bg-secondary' : 'bg-red-400'}`}
              style={{ width: `${stats.healthScore}%` }}
            ></div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold text-textSub">
            <p>Time Together</p>
            <p className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">{Math.floor(stats.sessionTimeMinutes)} mins</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;