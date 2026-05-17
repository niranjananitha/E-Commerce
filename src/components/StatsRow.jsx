import React from 'react';
import { Award, Target, Zap, Users } from 'lucide-react';

const StatsRow = () => {
  const stats = [
    { label: 'Competitions Joined', value: '12', icon: <Users size={24} />, color: 'text-blue-500' },
    { label: 'Current Rank', value: '#42', icon: <Target size={24} />, color: 'text-purple-500' },
    { label: 'Total Points', value: '2,450', icon: <Zap size={24} />, color: 'text-yellow-500' },
    { label: 'Day Streak', value: '7', icon: <Award size={24} />, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-t-4 border-t-primary hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-freshtext">{stat.value}</h3>
            <p className="text-freshmuted text-sm font-medium">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
