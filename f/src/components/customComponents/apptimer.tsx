import { useState, useEffect } from "react";

const AppTimer = () => {
  const totalSeconds = 30 * 24 * 60 * 60; // 30 days in seconds
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 
  // Fetch appTime from API
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/time/appTime`);
        const data = await response.json();
        setTimeLeft(data.appTime);
      } catch (error) {
        console.error("Error fetching appTime:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTime();
  }, []);
 
  // Countdown logic
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev:any) => (prev ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);
 
  // Progress calculation
  const percentage = timeLeft ? (timeLeft / totalSeconds) * 100 : 0;
  const strokeDasharray = 283; // Full circle length
  const strokeDashoffset = (strokeDasharray * (100 - percentage)) / 100;
 
  // Format time with seconds
  const formatTime = (seconds:number) => {
    if (seconds === null) return "Loading...";
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
   
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm font-bold text-[#DBC166]">{days}d {hours}h</div>
        <div className="text-xs font-medium text-[#DBC166]">{minutes}m {secs}s</div>
      </div>
    );
  };
 
  return (
    <div className="fixed top-31 left-4 z-50">
      <div className="text-[#DBC166] font-medium text-xs text-center mb-1 opacity-70">App Launch Time</div>
      <div className="bg-white bg-opacity-40 rounded-lg shadow-lg p-2 transition-all duration-300 hover:scale-105 hover:bg-opacity-60">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
          {/* SVG Circular Timer */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
              opacity="0.2"
            />
           
            {/* Progress Circle with Gradient */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DBC166" />
                <stop offset="100%" stopColor="#F4E077" />
              </linearGradient>
            </defs>
           
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear opacity-70"
            />
          </svg>
         
          {/* Timer Text - Centered with responsive visibility */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {loading ? (
              <div className="text-[#DBC166] font-bold text-xs">Loading...</div>
            ) : (
              <>
                {formatTime(timeLeft)}
                <span className="text-[#DBC166] font-medium text-xs mt-1 hidden md:block opacity-70">Remaining</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTimer;