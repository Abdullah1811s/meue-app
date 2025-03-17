import { useState, useEffect } from "react";

const AnalogTimer = () => {
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const totalSeconds = 60 * 24 * 60 * 60; // 60 days in seconds
  
  // Fetch mainWebTime from API
  useEffect(() => {
    const fetchTime = async () => {
      try {
        // Using fetch instead of axios to reduce dependencies
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/time/mainWebTime`);
        const data = await response.json();
        setTimeLeft(data.mainWebTime);
      } catch (error) {
        console.error("Error fetching mainWebTime:", error);
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
  
  // Calculate progress percentage
  const percentage = timeLeft ? (timeLeft / totalSeconds) * 100 : 0;
  const strokeDasharray = 283; // Full circle
  const strokeDashoffset = (strokeDasharray * (100 - percentage)) / 100;
  
  // Format time with seconds
  const formatTime = (seconds:any) => {
    if (seconds === null) return "Loading...";
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
   
    return (
      <div className="flex flex-col items-center">
        <div className="text-sm font-bold text-amber-600">{days}d {hours}h</div>
        <div className="text-xs font-medium text-amber-500">{minutes}m {secs}s</div>
      </div>
    );
  };
  
  return (
    <div className="fixed top-31 right-4 z-50">
      <div className="text-amber-600 font-medium text-xs text-center mb-1 opacity-70">Main website Time</div>
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
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#FBBF24" />
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
         
          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {loading ? (
              <div className="text-amber-600 font-bold text-xs">Loading...</div>
            ) : (
              <>
                {formatTime(timeLeft)}
                <span className="text-amber-600 font-medium text-xs mt-1 hidden md:block opacity-70">Remaining</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimer;