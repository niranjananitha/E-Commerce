import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  
  const topUsers = [
    { rank: 1, name: 'Aditya Kumar', points: 12500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya' },
    { rank: 2, name: 'Sanya Mirza', points: 11200, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya' },
    { rank: 3, name: 'Rahul Dravid', points: 9800, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
    { rank: 42, name: user?.displayName || 'You', points: 2450, avatar: user?.photoURL, isUser: true },
    { rank: 4, name: 'Priya Singh', points: 9500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { rank: 5, name: 'Vikram Seth', points: 8900, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' },
  ].sort((a, b) => {
    if (a.isUser) return 0; // Keep user visible
    return a.rank - b.rank;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-freshtext flex items-center gap-2">
          <TrendingUp size={20} className="text-secondary" /> Leaderboard
        </h3>
        <button className="text-xs font-bold text-primary hover:underline">See full →</button>
      </div>

      <div className="space-y-4">
        {topUsers.map((item, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
              item.isUser ? 'bg-primary bg-opacity-5 border border-primary border-opacity-20' : 'hover:bg-gray-50'
            }`}
          >
            <span className={`w-6 text-sm font-bold ${item.rank <= 3 ? 'text-secondary' : 'text-freshmuted'}`}>
              #{item.rank}
            </span>
            <img src={item.avatar || 'https://via.placeholder.com/32'} alt={item.name} className="w-8 h-8 rounded-full border border-gray-200" />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${item.isUser ? 'text-primary' : 'text-freshtext'}`}>
                {item.name}
              </p>
              <p className="text-xs text-freshmuted">{item.points.toLocaleString()} pts</p>
            </div>
            {item.rank <= 3 && (
              <div className={`w-2 h-2 rounded-full ${item.rank === 1 ? 'bg-yellow-400' : item.rank === 2 ? 'bg-gray-300' : 'bg-orange-300'}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
