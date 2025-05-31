import { useEffect, useState } from "react";
import axios from "axios";

// Define TypeScript interfaces
interface Prize {
  name: string;
  id: string;
  quantity: number;
  endDate?: string; // Optional, since some prizes might not have an end date
}

interface Participant {
  _id: string;
  name: string;
  email: string;
  phone: string;
  TotalPoints: number;
  city: string;
  prizeWon?: string;
}

interface Raffle {
  _id: string;
  name: string;
  vendorId: string;
  prizes: Prize[];
  participants: Participant[];
  status: string;
  scheduledAt?: string;
  createdAt: string;
}
const colorGradients = [
  "from-blue-400 via-blue-600 to-blue-800",     // Blue
  "from-purple-400 via-purple-600 to-purple-800", // Purple
  "from-pink-400 via-pink-600 to-pink-800",     // Pink
  "from-red-400 via-red-600 to-red-800",        // Red
  "from-orange-400 via-orange-600 to-orange-800", // Orange
  "from-amber-400 via-amber-600 to-amber-800",  // Amber
  "from-yellow-400 via-yellow-600 to-yellow-800", // Yellow
  "from-lime-400 via-lime-600 to-lime-800",     // Lime
  "from-green-400 via-green-600 to-green-800",  // Green
  "from-emerald-400 via-emerald-600 to-emerald-800", // Emerald
  "from-teal-400 via-teal-600 to-teal-800",     // Teal
  "from-cyan-400 via-cyan-600 to-cyan-800",     // Cyan
  "from-indigo-400 via-indigo-600 to-indigo-800", // Indigo
  "from-violet-400 via-violet-600 to-violet-800", // Violet
  "from-fuchsia-400 via-fuchsia-600 to-fuchsia-800", // Fuchsia
];
// Function to calculate time remaining until a given date
const getTimeRemaining = (endDate: string): string => {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const difference = end - now;

  if (difference <= 0) return "Expired";

  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const RankCard: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [raffles, setRaffles] = useState<any[]>([]);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const response = await axios.get<{ scheduled: Raffle[] }>(
          `${API_BASE_URL}/Raff/notReady`
        );

        if (response.data.scheduled.length > 0) {

          const filteredRaffles = response.data.scheduled
            .filter(raffle =>
              raffle.prizes.every(prize =>
                (prize.endDate && new Date(prize.endDate) >= new Date()) ||
                prize.quantity > 0
              )
            )


          setRaffles(filteredRaffles);

        }
      } catch (error) {
        console.error("Error fetching raffles:", error);
      }
    };

    fetchRaffles();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-10">
      <p className="text-2xl font-semibold">Ongoing Raffles</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 w-full px-4">
        {raffles.map((raffle, index) => {
          const prize = raffle.prizes[0];
          const timeRemaining =
            prize?.endDate && new Date(prize.endDate) > new Date()
              ? getTimeRemaining(prize.endDate)
              : null;

          // Use the color gradient based on index, cycling through the available gradients
          const colorGradient = colorGradients[index % colorGradients.length];

          return (
            <div
              key={raffle._id}
              className={`relative flex flex-col items-center w-full rounded-2xl shadow-xl p-6 transition-transform transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl bg-gradient-to-b ${colorGradient}`}
            >
              {/* Rank Badge */}
              <div className="absolute -top-4 bg-gray-800 text-white text-lg px-4 py-2 rounded-full font-bold transition-transform transform duration-300 hover:scale-110">
                #{index + 1}
              </div>

              {/* Raffle Name */}
              <h3 className="mt-4 text-2xl font-bold text-white">{raffle.name}</h3>

              {/* Prize Info */}
              {prize && (
                <p className="mt-2 text-sm sm:text-base md:text-lg text-yellow-300 font-semibold">
                  Prize: {prize.name} ({prize.quantity} available)
                </p>
              )}

              {/* Time Remaining */}
              {timeRemaining && (
                <p className="mt-1 text-sm sm:text-base md:text-lg text-white">
                  {timeRemaining}
                </p>
              )}

              {/* End Date */}
              {prize?.endDate && (
                <p className="mt-1 text-sm sm:text-base text-gray-200">
                  Ends: {new Date(prize.endDate).toLocaleDateString()}
                </p>
              )}

              {/* Participants Count */}
              <p className="mt-1 text-sm sm:text-base md:text-lg text-white">
                Participants: {raffle.participants.length}
              </p>

              {/* Status */}
              <div className="mt-6 py-2 w-full text-center text-white text-xl font-bold bg-gray-700 bg-opacity-50 rounded-xl transition-colors duration-300 hover:bg-gray-900">
                {raffle.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RankCard;
