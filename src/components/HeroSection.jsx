import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const HeroSection = () => {
  const { user } = useAuth();

  const comingSoon = (name) => {
    toast(`${name} coming soon!`, { icon: '🚀' });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 md:p-12 text-white shadow-xl">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl"></div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Welcome back, {user?.displayName?.split(' ')[0]}!
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
            You're ranked <span className="font-bold underline">#42</span> this week. Keep going and climb the leaderboard!
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <button 
              onClick={() => comingSoon('Explore')}
              className="bg-white text-primary px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              Explore Competitions <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => comingSoon('Profile')}
              className="border-2 border-white border-opacity-50 text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-primary transition-all active:scale-95"
            >
              View Profile
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 animate-bounce duration-[3000ms]">
          <div className="relative p-4 md:p-8 bg-white bg-opacity-20 backdrop-blur-lg rounded-full border border-white border-opacity-30">
            <Trophy size={120} className="text-white drop-shadow-2xl" strokeWidth={1.5} />
            <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-full shadow-lg">
              <div className="w-4 h-4 rounded-full bg-white animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
