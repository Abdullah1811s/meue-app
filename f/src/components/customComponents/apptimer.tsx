import { useState, useEffect } from "react";

const AppTimer = () => {
  const TOTAL_SECONDS = 60 * 24 * 60 * 60; // 60 days in seconds
  const LOCAL_STORAGE_KEY = "appTimeData";
  const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes in ms

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch time (with force refresh option)
  const fetchTime = async (forceRefresh = false) => {
    const now = Date.now();
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    let parsedData = storedData ? JSON.parse(storedData) : null;

    // Check if stored data is stale
    const isStale = !parsedData || (now - parsedData.fetchTimestamp) > FETCH_INTERVAL;

    // Use cached data if not forcing refresh and data isn't stale
    if (!forceRefresh && parsedData && !isStale) {
      const elapsedSeconds = Math.floor((now - parsedData.fetchTimestamp) / 1000);
      setTimeLeft(Math.max(0, parsedData.timeValue - elapsedSeconds));
      setLoading(false);
      return;
    }

    try {
      // Always try to fetch fresh data first
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/time/appTime`);
      const data = await response.json();

      const newTimeData = {
        timeValue: data.appTime,
        fetchTimestamp: now,
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTimeData));
      setTimeLeft(data.appTime);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appTime:", error);
      // Fallback to cached data if API fails
      if (parsedData) {
        const elapsedSeconds = Math.floor((now - parsedData.fetchTimestamp) / 1000);
        setTimeLeft(Math.max(0, parsedData.timeValue - elapsedSeconds));
      }
      setLoading(false);
    }
  };

  // Initial fetch + periodic refresh
  useEffect(() => {
    fetchTime(true); // Force refresh on mount
    const interval = setInterval(() => fetchTime(), FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Progress circle values
  const percentage = timeLeft ? (timeLeft / TOTAL_SECONDS) * 100 : 0;
  const strokeDasharray = 283;
  const strokeDashoffset = (strokeDasharray * (100 - percentage)) / 100;

  // Format seconds into d/h/m/s
  const formatTime = (seconds: number) => {
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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {loading ? (
              <div className="text-[#DBC166] font-bold text-xs">Loading...</div>
            ) : (
              <>
                {formatTime(timeLeft!)}
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