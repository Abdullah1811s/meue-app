import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { CalendarIcon, Gift, Trophy, User, MapPin, Mail } from "lucide-react";


const socket = io("http://localhost:8000");
if (socket)
  console.log("This is socket")
else
  console.log("no")
interface Participant {
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  street: string;
  town: string;
  postalCode: string;
}

interface Prize {
  id: string;
  name: string;
}

interface RaffleItem {
  name: string;
  _id: string;
  prizes: Prize[];
  participants: Participant[];
  winner: Array<{
    user: Participant;
    prize: any;
  }>;

  scheduledAt: string;
  status: "completed" | "scheduled";
  isVisible: boolean;
}

interface UpcomingRaffle {
  _id: string;
  name: string;
  prizes: Prize[];
  scheduledAt: string;
  isVisible: boolean;
  participants?: Participant[];
}

// Confetti component
const Confetti = () => {
  const [confetti, setConfetti] = useState<{ x: number; y: number; size: number; color: string; rotation: number; speed: number }[]>([]);

  useEffect(() => {
    const colors = ["#DBC166", "#FFD700", "#FFC0CB", "#87CEEB", "#90EE90"];
    const confettiPieces = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * 100,
      y: -20 - Math.random() * 100,
      size: 5 + Math.random() * 15,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speed: 3 + Math.random() * 7
    }));

    setConfetti(confettiPieces);

    const interval = setInterval(() => {
      setConfetti(prev =>
        prev.map(piece => ({
          ...piece,
          y: piece.y + piece.speed,
          rotation: piece.rotation + 5
        }))
      );
    }, 50);

    // Clean up the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {confetti.map((piece, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: piece.size,
            height: piece.size / 2,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            borderRadius: '2px',
            zIndex: 50
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: piece.y > 100 ? 0 : 1 }}
        />
      ))}
    </div>
  );
};

export default function UserDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const [raffles, setRaffles] = useState<RaffleItem[]>([]);
  const [upcomingRaffles, setUpcomingRaffles] = useState<RaffleItem[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [, setHasFetched] = useState<any>(false);
  const [withWinnerRaffles, setWithWinnerRaffles] = useState<RaffleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRaffle, setSelectedRaffle] = useState<UpcomingRaffle | null>(null);
  const [drawingRaffle, setDrawingRaffle] = useState<string | null>(null);
  const [, setDrawingParticipants] = useState<Participant[]>([]);
  const [, setDrawingPrizes] = useState<any[]>([]);
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null);
  const [currentPrize, setCurrentPrize] = useState<string | null>(null);
  const [winnerSelected, setWinnerSelected] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawSpeed, setDrawSpeed] = useState(100);

  // Toast management to prevent duplicates
  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    toast.dismiss(); // Dismiss any existing toasts
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  }, []);

  useEffect(() => {
    socket.on("visibilityChanged", (data) => {
      console.log(`📢 Raffle ${data.updatedRaffle._id} visibility changed!`);
      const updatedRaffleId = data.updatedRaffle._id;
      const newVisibility = data.updatedRaffle.isVisible;

      setUpcomingRaffles(prev => {
        const updatedRaffles = prev.map(raffle => {
          if (raffle._id === updatedRaffleId) {
            return { ...raffle, isVisible: newVisibility }
          }
          return raffle;
        });

        if (newVisibility) {
          const raffleToUpdate = prev.find(r => r._id === updatedRaffleId);
          if (raffleToUpdate && raffleToUpdate.participants && raffleToUpdate.participants.length > 0) {
            startDrawAnimation(raffleToUpdate);
          }
        }

        return updatedRaffles;
      });

      if (selectedRaffle && selectedRaffle._id === updatedRaffleId) {
        setSelectedRaffle({
          ...selectedRaffle,
          isVisible: newVisibility
        });
      }
    });

    fetchCompletedRaffles();
    fetchUpcomingRaffles();

    return () => {
      socket.off("visibilityChanged");
    };
  }, [selectedRaffle, showToast]);

  const startDrawAnimation = (raffle: UpcomingRaffle) => {
    console.log("The raffle is", raffle);
    if (!raffle.participants || raffle.participants.length === 0) return;

    setDrawingRaffle(raffle._id);
    setDrawingParticipants(raffle.participants);

    // Process prizes correctly
    const prizeNames = raffle.prizes?.map(prize =>
      typeof prize === 'string' ? prize : prize.name || 'Unnamed Prize'
    ) || [];
    setDrawingPrizes(prizeNames);

    setWinnerSelected(false);
    setShowConfetti(false);
    setIsDrawing(true);

    // Start with fast animation and gradually slow down
    let count = 0;
    const maxShuffles = 50;
    let currentSpeed = 50; // Start faster

    const shuffleInterval = setInterval(() => {
      const randomParticipantIndex = Math.floor(Math.random() * raffle.participants!.length);
      setCurrentParticipant(raffle.participants![randomParticipantIndex]);

      count++;

      // Gradually slow down the animation
      if (count > maxShuffles * 0.6) {
        currentSpeed = 100; // Slow down
        setDrawSpeed(currentSpeed);
      }

      if (count > maxShuffles * 0.8) {
        currentSpeed = 200; // Even slower
        setDrawSpeed(currentSpeed);
      }

      if (count >= maxShuffles) {
        clearInterval(shuffleInterval);
        finalizeDraw(raffle);
      }
    }, currentSpeed);
  };

  const finalizeDraw = (raffle: UpcomingRaffle) => {
    const winnerIndex = Math.floor(Math.random() * raffle.participants!.length);

    // Safely access prizes
    let prizeName = "Grand Prize";
    let prizeId = "";

    if (raffle.prizes && raffle.prizes.length > 0) {
      const prizeIndex = Math.floor(Math.random() * raffle.prizes.length);
      const selectedPrize = raffle.prizes[prizeIndex];

      if (typeof selectedPrize === 'string') {
        prizeName = selectedPrize;
      } else if (selectedPrize && typeof selectedPrize === 'object') {
        prizeName = selectedPrize.name || "Unnamed Prize";
        prizeId = selectedPrize.id || "";
      }
    }

    const winner = raffle.participants![winnerIndex];

    // Log winner details
    console.log("🎉 Winner Selected!");
    console.log("Raffle ID:", raffle._id);
    console.log("Winner Email:", winner.email);
    console.log("Prize:", prizeName);

    setTimeout(() => {
      setCurrentParticipant(winner);
      setCurrentPrize(prizeName);
      setWinnerSelected(true);
      setShowConfetti(true);
      setIsDrawing(false);

      showToast(`🎉 ${winner.email} won ${prizeName}!`, 'success');

      updateWinner(raffle._id, winner.email, { id: prizeId, name: prizeName })
        .then(() => {
          setTimeout(() => {
            fetchCompletedRaffles();
            fetchUpcomingRaffles();
            setDrawingRaffle(null);
            setShowConfetti(false);
          }, 5000); // Let the celebration last a bit longer
        })
        .catch(error => {
          console.error("Failed to update winner:", error);
          showToast("Failed to update winner", 'error');
          setDrawingRaffle(null);
          setShowConfetti(false);
        });
    }, 500);
  };

  const fetchCompletedRaffles = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Raff`);
      const completedRaffles = res.data.raff;
      console.log("these are the raffle", completedRaffles);
      const winner = completedRaffles.filter((r: RaffleItem) =>
        Array.isArray(r.winner) && r.winner.length > 0
      );

      setWithWinnerRaffles(winner);

      console.log("The winner raff", winner);
      setHasFetched(true);
    } catch (error) {
      console.error("Error fetching raffles:", error);
      showToast("Failed to fetch completed raffles", 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingRaffles = async () => {
    setUpcomingLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/Raff/notReady`);
      // Ensure prizes are properly formatted
      const formattedRaffles = res.data.scheduled.map((raffle: any) => ({
        ...raffle,
        prizes: Array.isArray(raffle.prizes)
          ? raffle.prizes.map((prize: any) =>
            typeof prize === 'string'
              ? prize
              : { id: prize.id || prize._id || '', name: prize.name || 'Unnamed Prize' }
          )
          : []
      }));
      setUpcomingRaffles(formattedRaffles);
    } catch (error) {
      console.error("Error fetching upcoming raffles:", error);
      showToast("Failed to fetch upcoming raffles", 'error');
      setUpcomingRaffles([]);
    } finally {
      setUpcomingLoading(false);
    }
  };

  const updateWinner = async (refId: string, winnerEmail: string, prize: any) => {
    const payload = {
      refId,
      winnerEmail,
      prizeId: prize.id
    };

    console.log("This is the data that is going to the backend:", payload);

    try {
      const res = await axios.put(`${API_BASE_URL}/Raff/updateRaff`, payload);
      if (res.status !== 200) throw new Error("Failed to update winner");
      console.log("Winner updated successfully:", res.data);
    } catch (error) {
      console.error("Error updating winner:", error);
      throw error;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString().split('T')[0];
  };

  const CustomCard = ({ children, className = "", isDrawing = false }: {
    children: React.ReactNode;
    className?: string;
    isDrawing?: boolean;
  }) => (
    <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden border-2 ${isDrawing
      ? "border-4 border-[#DBC166] shadow-[0_0_20px_rgba(219,193,102,0.7)]"
      : "border-2 border-[#DBC166]"
      } ${className}`}>
      {isDrawing && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#DBC166]/10 via-[#DBC166]/5 to-[#DBC166]/10 animate-pulse"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#9b9993] via-[#F5F5DC] to-[#DBC166] opacity-30 blur-sm animate-gradient"></div>
        </div>
      )}
      {children}
    </div>
  )

  return (
    <div className="container mx-auto p-4 px-12 bg-white min-h-screen">
      {/* Custom background gradients */}
      <h1 className="text-3xl font-bold text-[#DBC166] mb-8 text-center">🎉 The Menu Power Pick 🎉</h1>

      {/* Upcoming Raffles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Don't Miss Out on Our Exciting Raffles!
        </h2>
        {upcomingLoading ? (
          <div className="flex justify-center p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-[#DBC166] border-t-transparent rounded-full"
            />
          </div>
        ) : upcomingRaffles.length === 0 ? (
          <p className="col-span-full text-center p-8 text-gray-500">
            We're preparing some exciting new raffles for you. Please check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingRaffles.map((raffle) => (
              <motion.div
                key={raffle._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <CustomCard isDrawing={drawingRaffle === raffle._id}>
                  <div className="bg-[#DBC166] p-4">
                    <h3 className="text-xl font-bold text-white">{raffle.name}</h3>
                    <p className="text-white/80 flex items-center gap-2 mt-2">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDateTime(raffle.scheduledAt)}
                    </p>
                  </div>

                  {drawingRaffle === raffle._id ? (
                    <div className="p-6 bg-gradient-to-b from-[#DBC166]/10 relative">
                      {/* Background animation */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#DBC166]/5 to-white animate-pulse"></div>
                        {Array.from({ length: 20 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-[#DBC166]/40"
                            initial={{
                              x: Math.random() * 100 + '%',
                              y: Math.random() * 100 + '%',
                              scale: 0
                            }}
                            animate={{
                              x: Math.random() * 100 + '%',
                              y: Math.random() * 100 + '%',
                              scale: [0, 1, 0]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-center mb-4 relative z-10">
                        <h3 className="text-xl font-bold text-[#DBC166] mb-2">
                          🎰 Drawing Winner! 🎰
                        </h3>
                      </div>

                      <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg overflow-hidden relative z-10 border-2 border-[#DBC166]/50"
                        animate={{
                          y: winnerSelected ? 0 : [-3, 3],
                          scale: winnerSelected ? 1 : [0.98, 1.02],
                          rotate: isDrawing ? [-1, 1] : 0
                        }}
                        transition={{
                          duration: drawSpeed / 1000,
                          repeat: winnerSelected ? 0 : Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      >
                        {currentParticipant && (
                          <div className="space-y-2">
                            <motion.p
                              className="flex items-center gap-2 justify-center text-lg font-semibold text-[#DBC166]"
                              animate={{
                                textShadow: winnerSelected ? "0 0 8px rgba(219, 193, 102, 0.7)" : "none"
                              }}
                            >
                              <Mail className={`w-5 h-5 ${winnerSelected ? "animate-bounce" : ""}`} />
                              {currentParticipant.name}
                            </motion.p>
                          </div>
                        )}
                      </motion.div>

                      {winnerSelected && currentPrize && (
                        <motion.div
                          className="mt-6 text-center relative z-10"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        >
                          {showConfetti && <Confetti />}
                          <p className="text-lg font-bold text-[#DBC166] mb-2">
                            🎉 Winner Selected! 🎉
                          </p>
                          <motion.p
                            className="text-xl font-bold bg-[#DBC166] text-white px-4 py-2 rounded-full inline-block"
                            animate={{
                              scale: [1, 1.1, 1],
                              boxShadow: ["0 0 0 rgba(219,193,102,0.4)", "0 0 20px rgba(219,193,102,0.8)", "0 0 0 rgba(219,193,102,0.4)"]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Prize: {currentPrize}
                          </motion.p>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-[#DBC166]">
                          <Gift className="w-4 h-4" /> Prizes
                        </h4>
                        <ul className="space-y-1">
                          {Array.isArray(raffle.prizes) && raffle.prizes.length > 0 ? (
                            raffle.prizes.map((prize, idx) => (
                              <li key={idx} className="text-sm">
                                {typeof prize === 'string'
                                  ? prize
                                  : (prize.name || "Unnamed Prize")}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-gray-500">No prizes listed</li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-[#DBC166]">
                          <User className="w-4 h-4" /> Participants
                        </h4>
                        <p className="text-sm">
                          {raffle.participants?.length || 0} registered
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${raffle.isVisible
                          ? "bg-[#DBC166] text-white"
                          : "bg-gray-100 text-gray-600"
                          }`}>
                          {raffle.isVisible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  )}
                </CustomCard>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Raffles with Winners */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Raffles with Winners</h2>

        {loading ? (
          <div className="flex justify-center p-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-[#DBC166] border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {withWinnerRaffles.map((raffle) => (
              <motion.div
                key={raffle._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <CustomCard>
                  <div className="bg-[#DBC166] p-4">
                    <h3 className="text-xl font-bold text-white">{raffle.name}</h3>
                    <p className="text-white/80 flex items-center gap-2 mt-2">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDateTime(raffle.scheduledAt)}
                    </p>
                  </div>

                  <div className="p-4">
                    <div className="bg-gradient-to-r from-[#DBC166]/10 to-[#DBC166]/5 p-4 rounded-lg mb-4 border border-[#DBC166]/20">
                      <h4 className="font-medium mb-3 flex items-center gap-2 text-[#DBC166]">
                        <Trophy className="w-5 h-5" /> Winner
                      </h4>

                      {raffle.winner && raffle.winner.length > 0 ? (
                        <div className="space-y-4">
                          {raffle.winner.map((w, index) => (
                            <div key={index} className="space-y-2 p-3 border-b border-gray-300">
                              <p className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-[#DBC166]" />
                                {w.user.name || "No name provided"}
                              </p>
                             
                              <p className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-[#DBC166]" />
                                {w.user.province || "Unknown Province"}
                              </p>
                              <p className="flex items-center gap-2 text-sm mt-2 font-medium">
                                <Gift className="w-4 h-4 text-[#DBC166]" />
                                Prize: {typeof w.prize === "string" ? w.prize : (w.prize?.name || "Unnamed Prize")}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No winner details available.</p>
                      )}

                    </div>
                  </div>
                </CustomCard>
              </motion.div>
            ))}

            {withWinnerRaffles.length === 0 && (
              <div className="col-span-full text-center p-8 text-gray-500">
                No raffles with winners yet.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}