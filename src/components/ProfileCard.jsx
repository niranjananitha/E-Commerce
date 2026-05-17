import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Mail, MapPin, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfileCard = () => {
  const { user } = useAuth();

  const completionPercent = 70;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="relative mb-4">
          <img 
            src={user?.photoURL || 'https://via.placeholder.com/80'} 
            alt={user?.displayName} 
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <button 
            onClick={() => toast('Change photo feature coming soon!')}
            className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
          >
            <Edit2 size={12} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-freshtext">{user?.displayName}</h2>
        <p className="text-freshmuted text-sm flex items-center justify-center gap-1">
          <Mail size={14} /> {user?.email}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 text-sm text-freshmuted">
          <Calendar size={16} className="text-primary" />
          <span>Member since May 2024</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-freshmuted">
          <MapPin size={16} className="text-primary" />
          <span>India</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold mb-1">
          <span className="text-freshtext">Profile Completion</span>
          <span className="text-primary">{completionPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${completionPercent}%` }}
          ></div>
        </div>
        <button 
          onClick={() => toast.success('Profile update page!')}
          className="w-full mt-4 text-xs font-bold text-primary hover:underline"
        >
          Complete your profile to 100% →
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
