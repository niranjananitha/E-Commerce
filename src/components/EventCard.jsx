import React from 'react';
import { Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const EventCard = ({ event }) => {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-44 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {event.type}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-freshmuted font-medium mb-2">
          <Calendar size={14} />
          <span>Deadline: {event.deadline}</span>
        </div>
        <h4 className="text-lg font-bold text-freshtext mb-1 line-clamp-1">{event.title}</h4>
        <p className="text-sm text-freshmuted mb-4">{event.organizer}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-xs text-freshmuted">
            <Users size={14} />
            <span>{event.participants} registered</span>
          </div>
          <button 
            onClick={() => toast.success(`Registered for ${event.title}!`)}
            className="bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
