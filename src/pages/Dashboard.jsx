import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsRow from '../components/StatsRow';
import EventCard from '../components/EventCard';
import ProfileCard from '../components/ProfileCard';
import Leaderboard from '../components/Leaderboard';
import { ArrowRight, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const featuredEvents = [
    {
      id: 1,
      title: "Global Tech Hackathon 2024",
      organizer: "Google for Developers",
      type: "Hackathon",
      deadline: "24 May 2024",
      participants: "12,450",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "UI/UX Design Challenge",
      organizer: "Figma Community",
      type: "Design",
      deadline: "1 June 2024",
      participants: "8,900",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "Data Science Masters",
      organizer: "Kaggle",
      type: "Competition",
      deadline: "15 June 2024",
      participants: "5,200",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 4,
      title: "Algorithm Wizard 2.0",
      organizer: "CodeChef",
      type: "Coding",
      deadline: "10 June 2024",
      participants: "15,000",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const comingSoon = (name) => {
    toast(`${name} coming soon!`, { icon: '🚀' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Hero Section */}
        <div className="mb-10">
          <HeroSection />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content (Left/Center) */}
          <div className="flex-1 space-y-10">
            {/* Stats */}
            <section>
              <h2 className="text-xl font-bold text-freshtext mb-6">Your Performance</h2>
              <StatsRow />
            </section>

            {/* Featured Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-freshtext">Recommended for You</h2>
                <button 
                  onClick={() => comingSoon('Explore All')}
                  className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight size={16} />
                </button>
              </div>
              
              <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                {featuredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:w-80 space-y-8">
            <ProfileCard />
            <Leaderboard />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <span className="text-2xl font-bold font-display mb-6 block">
                <span className="text-secondary">Un</span>
                <span className="text-primary">stop</span>
              </span>
              <p className="text-freshmuted text-sm leading-relaxed mb-6">
                The ultimate platform for competitions, hackathons, and growth. Empowering the next generation of leaders.
              </p>
              <div className="flex gap-4">
                {[Twitter, Instagram, Linkedin, Facebook].map((Icon, idx) => (
                  <button key={idx} className="p-2 bg-slate-50 rounded-full text-freshmuted hover:text-primary transition-all">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-freshtext mb-6 uppercase text-xs tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm text-freshmuted">
                <li><a href="#" className="hover:text-primary">Competitions</a></li>
                <li><a href="#" className="hover:text-primary">Hackathons</a></li>
                <li><a href="#" className="hover:text-primary">Quizzes</a></li>
                <li><a href="#" className="hover:text-primary">Learning</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-freshtext mb-6 uppercase text-xs tracking-widest">Company</h4>
              <ul className="space-y-4 text-sm text-freshmuted">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
                <li><a href="#" className="hover:text-primary">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-freshtext mb-6 uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-4 text-sm text-freshmuted">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-50 text-center">
            <p className="text-xs text-freshmuted">
              &copy; {new Date().getFullYear()} Unstop Clone. All rights reserved. Created with ❤️ for winners.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
