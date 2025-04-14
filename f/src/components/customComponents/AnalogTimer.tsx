import { useState, useEffect } from "react";
const TOTAL_SECONDS = 45 * 24 * 60 * 60; // 45 days in seconds
const LOCAL_STORAGE_KEY = "mainWebTimeData";
const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes in ms

const AnalogTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch from API (with localStorage fallback)
  const fetchTime = async (forceFetch = false) => {
    const now = Date.now();
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    let storedData = stored ? JSON.parse(stored) : null;

    // Check if stored data is expired or forced to refresh
    const isStale = !storedData || (now - storedData.fetchTimestamp) > FETCH_INTERVAL;

    if (!forceFetch && storedData && !isStale) {
      const elapsed = Math.floor((now - storedData.fetchTimestamp) / 1000);
      setTimeLeft(Math.max(0, storedData.timeValue - elapsed));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/time/mainWebTime`);
      const data = await res.json();

      const newTime = {
        timeValue: data.mainWebTime,
        fetchTimestamp: now,
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTime));
      setTimeLeft(data.mainWebTime);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching time:", error);
      // Fallback to stored data if API fails
      if (storedData) {
        const elapsed = Math.floor((now - storedData.fetchTimestamp) / 1000);
        setTimeLeft(Math.max(0, storedData.timeValue - elapsed));
      }
      setLoading(false);
    }
  };

  // Initial fetch + periodic refresh
  useEffect(() => {
    fetchTime(true); // Force fetch on mount to get latest time
    const interval = setInterval(() => fetchTime(), FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);


  // Timer formatting
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "Loading...";

    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
      <div className="flex flex-col items-center">
        <div className="text-sm font-bold text-amber-600">
          {days}d {hours}h
        </div>
        <div className="text-xs font-medium text-amber-500">
          {minutes}m {secs}s
        </div>
      </div>
    );
  };

  // Progress calculation
  const percentage = timeLeft ? (timeLeft / TOTAL_SECONDS) * 100 : 0;
  const strokeDasharray = 283;
  const strokeDashoffset = (strokeDasharray * (100 - percentage)) / 100;

  return (
    <div className="fixed top-31 right-4 z-50">
      <div className="text-amber-600 font-medium text-xs text-center mb-1 opacity-70">
        Main website Time
      </div>

      <div className="bg-white bg-opacity-40 rounded-lg shadow-lg p-2 transition-all duration-300 hover:scale-105 hover:bg-opacity-60">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
              opacity="0.2"
            />
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
                <span className="text-amber-600 font-medium text-xs mt-1 hidden md:block opacity-70">
                  Remaining
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalogTimer;
