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
            .filter((raffle) =>
              raffle.prizes.map(
                (prize) =>
                  (prize.endDate && new Date(prize.endDate) > new Date()) ||
                  prize.quantity > 0
              )
            )
            .slice(0, 3); // Show max 3 raffles
        
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

      <div className="flex flex-col md:flex-row justify-center gap-10">
        {raffles.map((raffle, index) => {
          const prize = raffle.prizes[0]; // Display first prize
          const timeRemaining =
            prize?.endDate && new Date(prize.endDate) > new Date()
              ? getTimeRemaining(prize.endDate)
              : null;

          return (
            <div
              key={raffle._id}
              className={`relative flex flex-col items-center w-60 rounded-2xl shadow-xl p-6 transition-transform transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${index === 0
                  ? "bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900"
                  : index === 1
                    ? "bg-gradient-to-b from-yellow-400 via-yellow-600 to-yellow-800"
                    : "bg-gradient-to-b from-gray-300 via-gray-500 to-gray-800"
                }`}
            >
              {/* Rank Badge */}
              <div className="absolute -top-4 bg-gray-800 text-white text-lg px-4 py-2 rounded-full font-bold transition-transform transform duration-300 hover:scale-110">
                #{index + 1}
              </div>

              {/* Raffle Name */}
              <h3 className="mt-4 text-2xl font-bold">{raffle.name}</h3>

              {/* Prize Name & Quantity */}
              {prize && (
                <p className="mt-2 text-sm sm:text-base md:text-lg text-yellow-300 font-semibold">
                  Prize: {prize.name} ({prize.quantity} available)
                </p>
              )}

              {/* End Date */}
              {timeRemaining && (
                <p className="mt-1 text-sm sm:text-base md:text-lg text-white">
                  Ends In: {timeRemaining}
                </p>
              )}

              {/* Participants Count */}
              <p className="mt-1 text-sm sm:text-base md:text-lg text-white">
                Participants: {raffle.participants.length}
              </p>

              {/* Status */}
              <div className="mt-6 py-2 w-full text-center text-white text-xl font-bold bg-gray-700 rounded-xl transition-colors duration-300 hover:bg-gray-900">
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
