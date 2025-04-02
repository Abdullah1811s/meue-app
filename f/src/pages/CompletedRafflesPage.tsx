import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { CalendarIcon, Gift, Trophy, User, MapPin, Mail } from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_URL_SOCKET);

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  street: string;
  town: string;
  postalCode: string;
  userType: string;
}

interface Participant {
  user: User;
  entries: number;
  _id: string;
}

interface Prize {
  _id: string;

  name: string;
}

interface RaffleItem {
  name: string;
  _id: string;
  prizes: Prize[];
  participants: Participant[];
  winner: Array<{
    user: User;
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

export default function UserDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [upcomingRaffles, setUpcomingRaffles] = useState<RaffleItem[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [withWinnerRaffles, setWithWinnerRaffles] = useState<RaffleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRaffle, setSelectedRaffle] = useState<UpcomingRaffle | null>(null);
  const [drawingRaffle, setDrawingRaffle] = useState<string | null>(null);
  const [currentParticipant, setCurrentParticipant] = useState<User | null>(null);
  const [currentPrize, setCurrentPrize] = useState<string | null>(null);
  const [winnerSelected, setWinnerSelected] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawSpeed, setDrawSpeed] = useState(100);
  const isDrawingRef = useRef(false);
  const shuffleInterval = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    toast.dismiss();
    type === 'success' ? toast.success(message) : toast.error(message);
  }, []);
  

  const fetchCompletedRaffles = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Raff`);
      const completedRaffles = res.data.raff.filter((r: RaffleItem) =>
        Array.isArray(r.winner) && r.winner.length > 0
      );
      setWithWinnerRaffles(completedRaffles);
    } catch (error) {
      console.error("Error fetching raffles:", error);
      showToast("Failed to fetch completed raffles", 'error');
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, showToast]);

  const fetchUpcomingRaffles = useCallback(async () => {
    setUpcomingLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/Raff/notReady`);
      const formattedRaffles = res.data.scheduled.map((raffle: any) => ({
        ...raffle,
        prizes: Array.isArray(raffle.prizes) ? raffle.prizes.map((prize: any) =>
          typeof prize === 'string' ? prize : { id: prize.id || prize._id || '', name: prize.name || 'Unnamed Prize' }
        ) : [],
        participants: raffle.participants || []
      }));
      setUpcomingRaffles(formattedRaffles);
    } catch (error) {
      console.error("Error fetching upcoming raffles:", error);
      showToast("Failed to fetch upcoming raffles", 'error');
      setUpcomingRaffles([]);
    } finally {
      setUpcomingLoading(false);
    }
  }, [API_BASE_URL, showToast]);
  
  // Add polling effect
  useEffect(() => {
    fetchUpcomingRaffles(); // Initial fetch
    const interval = setInterval(fetchUpcomingRaffles, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval); // Cleanup
  }, [fetchUpcomingRaffles]);

  const handleVisibilityChange = useCallback((data: any) => {
    const updatedRaffle = data.updatedRaffle;
    const newVisibility = updatedRaffle.isVisible;

    setUpcomingRaffles(prev => prev.map(r =>
      r._id === updatedRaffle._id ? { ...r, isVisible: newVisibility } : r
    ));

    if (selectedRaffle?._id === updatedRaffle._id) {
      setSelectedRaffle(prev => prev ? { ...prev, isVisible: newVisibility } : null);
    }

    if (newVisibility && updatedRaffle.participants?.length > 0 && !isDrawingRef.current) {
      startDrawAnimation(updatedRaffle);
    }
  }, [selectedRaffle]);

  const startDrawAnimation = useCallback((raffle: UpcomingRaffle) => {
    if (isDrawingRef.current || !raffle.participants || raffle.participants.length === 0) return;

    isDrawingRef.current = true;
    setIsDrawing(true);
    setDrawingRaffle(raffle._id);
    setWinnerSelected(false);
    setShowConfetti(false);

    const entryPool: User[] = [];
    raffle.participants.forEach(participant => {
      for (let i = 0; i < participant.entries; i++) {
        entryPool.push(participant.user);
      }
    });

    let count = 0;
    const maxShuffles = 50;
    let currentSpeed = 50;

    shuffleInterval.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * entryPool.length);
      setCurrentParticipant(entryPool[randomIndex]);
      count++;

      if (count > maxShuffles * 0.6) {
        currentSpeed = 100;
        setDrawSpeed(currentSpeed);
      }
      if (count > maxShuffles * 0.8) {
        currentSpeed = 200;
        setDrawSpeed(currentSpeed);
      }

      if (count >= maxShuffles) {
        clearInterval(shuffleInterval.current!);
        finalizeDraw(raffle, entryPool);
      }
    }, currentSpeed);
  }, []);

  const finalizeDraw = useCallback((raffle: UpcomingRaffle, entryPool: User[]) => {
    const winnerIndex = Math.floor(Math.random() * entryPool.length);
    const winner = entryPool[winnerIndex];
    let prizeName = "Grand Prize";
    let prizeId = "";

    if (raffle.prizes?.length > 0) {
      const prizeIndex = Math.floor(Math.random() * raffle.prizes.length);
      const selectedPrize = raffle.prizes[prizeIndex];
      if (typeof selectedPrize === 'object') {
        prizeName = selectedPrize.name || "Unnamed Prize";
        prizeId = selectedPrize._id || "";
       
      } else {
        prizeName = selectedPrize;
      }
    }

    setTimeout(() => {
      setCurrentParticipant(winner);
      setCurrentPrize(prizeName);
      setWinnerSelected(true);
      setShowConfetti(true);
      setIsDrawing(false);
      isDrawingRef.current = false;

      showToast(`🎉 ${winner.name} won ${prizeName}!`, 'success');
      updateWinner(raffle._id, winner.email, { id: prizeId, name: prizeName })
        .finally(() => {
          setTimeout(() => {
            fetchCompletedRaffles();
            fetchUpcomingRaffles();
            setDrawingRaffle(null);
            setShowConfetti(false);
          }, 5000);
        });
    }, 500);
  }, [fetchCompletedRaffles, fetchUpcomingRaffles, showToast]);

  const updateWinner = async (refId: string, winnerEmail: string, prize: any) => {
    const payload = {
      refId,
      winnerEmail,
      prizeId: prize.id
    };
 
    try {
      const res = await axios.put(`${API_BASE_URL}/Raff/updateRaff`, payload);
      console.log(res.data);
      if (res.status !== 200) throw new Error("Failed to update winner");
    } catch (error) {
      console.error("Error updating winner:", error);
      throw error;
    }
  };

  useEffect(() => {
    socket.on("visibilityChanged", handleVisibilityChange);
    fetchCompletedRaffles();
    fetchUpcomingRaffles();

    return () => {
      socket.off("visibilityChanged", handleVisibilityChange);
      if (shuffleInterval.current) clearInterval(shuffleInterval.current);
    };
  }, [fetchCompletedRaffles, fetchUpcomingRaffles, handleVisibilityChange]);

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
  );

  // Calculate total participants count (unique users)
  const getUniqueParticipantsCount = (participants: Participant[] = []) => {
    return participants.length;
  };

  // Calculate total entries count
  const getTotalEntriesCount = (participants: Participant[] = []) => {
    return participants.reduce((sum, participant) => sum + participant.entries, 0);
  };

  return (
    <div className="container mx-auto p-4 px-12 bg-white min-h-screen">
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
                          {/* && <Confetti /> */}
                          {showConfetti}
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
                          {getUniqueParticipantsCount(raffle.participants)} users ({getTotalEntriesCount(raffle.participants)} entries)
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${raffle.isVisible
                          ? "bg-[#DBC166] text-white"
                          : "bg-gray-100 text-gray-600"
                          }`}>
                          {raffle.isVisible ? "Open" : "Closed"}
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