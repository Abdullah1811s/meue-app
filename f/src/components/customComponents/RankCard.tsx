"use client";
import TitleCard from "./TitleCard";
import { Hourglass } from "lucide-react";

const RankCard = () => {
  const players = [
    {
      rank: "#1",
      region: "Asia",
      name: "Saymi",
      rp: "2131 RP",
      rankName: "Platinum",
      img: "/profile1.png",
      bg: "bg-gradient-to-b from-blue-500 via-blue-700 to-blue-900",
    },
    {
      rank: "#2",
      region: "Europe",
      name: "Nodror",
      rp: "2331 RP",
      rankName: "Gold",
      img: "/profile2.png",
      bg: "bg-gradient-to-b from-yellow-400 via-yellow-600 to-yellow-800",
    },
    {
      rank: "#3",
      region: "America",
      name: "Smiley",
      rp: "1131 RP",
      rankName: "Silver",
      img: "/profile3.png",
      bg: "bg-gradient-to-b from-gray-300 via-gray-500 to-gray-800",
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-10">
      <TitleCard title="Countdown Timers for Ongoing Raffles and Games" IconComponent={Hourglass} />
      <p className="text-2xl font-semibold">
        League will end in <span className="text-yellow-500 font-extrabold">03:12:59</span>
      </p>

      <div className="flex flex-col md:flex-row justify-center gap-10">
        {players.map((player, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-center w-60 rounded-2xl shadow-xl p-6 transition-transform transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${player.bg}`}
          >
            {/* Rank Badge with Hover Effect */}
            <div className="absolute -top-4 bg-gray-800 text-white text-lg px-4 py-2 rounded-full font-bold transition-transform transform duration-300 hover:scale-110">
              {player.rank}
            </div>

            {/* Player Image */}
            <img
              src={player.img}
              alt={player.name}
              width={100}
              height={100}
              className="rounded-full mt-6"
            />

            {/* Player Details */}
            <h3 className="mt-4 text-2xl font-bold">{player.region}</h3>
            <p className="mt-2 text-sm sm:text-base md:text-lg">{player.name}</p>
            <p className="mt-1 text-sm sm:text-base md:text-lg">{player.rp}</p>

            {/* Rank Name with Hover Effect */}
            <div className="mt-6 py-2 w-full text-center text-white text-xl font-bold bg-gray-700 rounded-xl transition-colors duration-300 hover:bg-gray-900">
              {player.rankName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankCard;
