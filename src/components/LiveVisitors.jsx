import React, { useState, useEffect } from 'react';
import { rtdb } from '../firebase/config';
import { ref, onValue } from 'firebase/database';
import { Users } from 'lucide-react';

const LiveVisitors = ({ productId }) => {
  const [visitors, setVisitors] = useState(0);

  useEffect(() => {
    if (!productId || productId.startsWith('local-')) {
      setVisitors(Math.floor(Math.random() * 5) + 1);
      return;
    }

    const visitorRef = ref(rtdb, `visitors/${productId}`);
    
    const unsubscribe = onValue(visitorRef, (snapshot) => {
      const data = snapshot.val();
      setVisitors(data || Math.floor(Math.random() * 5) + 1);
    });

    return () => unsubscribe();
  }, [productId]);

  return (
    <div className="flex items-center gap-2 text-xs text-orange-700 font-medium bg-orange-50 px-3 py-1.5 rounded-md border border-orange-100">
      <div className="relative">
        <Users size={14} />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse border border-white"></span>
      </div>
      <span>{visitors} people are viewing this item right now</span>
    </div>
  );
};

export default LiveVisitors;
