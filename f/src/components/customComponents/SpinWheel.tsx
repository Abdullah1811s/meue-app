import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaClock, FaDice } from "react-icons/fa";
import { useSelector } from "react-redux";

// Type definitions
interface Offering {
  _id: string;
  name: string;
  quantity?: any;
  startDate?: string;
  endDate?: string;
}

interface Vendor {
  _id: string;
  vendorInfo: string;
  offerings: Offering[];
}

interface Admin {
  adminInfo: string;
  offerings: Offering[];
}

interface VendorData {
  admin?: Admin;
  _id: string;
  vendor?: Vendor;
}

interface SegmentData {
  label: string;
  vendorId: string;
  labelId: string;
  vId: string;
  type: "Vendor" | "Admin";
}

const SpinWheel = () => {
  const { id } = useParams<{ id: string }>();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [rotation, setRotation] = useState<number>(0);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [vendor, setVendor] = useState<VendorData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>();
  const [prize, setPrize] = useState<SegmentData | null>(null);
  const [isAble, setIsAble] = useState<boolean>(false);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const isPaid = useSelector((state: any) => state.auth.isPaid);

  // Fetch wheel data function
  const fetchWheelData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/wheel`);

      const processedData = res.data.data.map((entry: any) => {
        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Process vendor offerings
        const filteredVendorOfferings = entry.vendor?.offerings?.filter((offering: any) => {
          if (!offering.endDate) return true; // Keep if no end date

          const endDate = new Date(offering.endDate);
          endDate.setHours(0, 0, 0, 0); // Normalize to midnight

          // Keep if end date is in the future (after today)
          return endDate > today;
        }) || [];

        // Process admin offerings
        const filteredAdminOfferings = entry.admin?.offerings?.filter((offering: any) => {
          if (!offering.endDate) return true; // Keep if no end date

          const endDate = new Date(offering.endDate);
          endDate.setHours(0, 0, 0, 0); // Normalize to midnight

          // Keep if end date is in the future (after today)
          return endDate > today;
        }) || [];

        return {
          ...entry,
          vendor: entry.vendor ? {
            ...entry.vendor,
            offerings: filteredVendorOfferings
          } : null,
          admin: entry.admin ? {
            ...entry.admin,
            offerings: filteredAdminOfferings
          } : null
        };
      });
     
      setVendor(processedData);
    } catch (error: any) {
      console.error("Error fetching wheel data:", error);
      if (error.response) {
        console.error(`Error: ${error.response.data.message || "An error occurred while fetching wheel data."}`);
      } else if (error.request) {
        toast.error("No response from the server. Please check your network connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!nextSpinTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const diff = nextSpinTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextSpinTime]);

  // Fetch user data function
  const fetchUser = async () => {
    if (!id) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/users/${id}`);

      if (res.data.user.numberOfTimesWheelRotate === 1 && res.data.user.firstSpinTime) {
        const nextSpin = new Date(res.data.user.firstSpinTime);
        nextSpin.setHours(nextSpin.getHours() + 8);
        setNextSpinTime(nextSpin);
      }
      setUser(res.data.user);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || "An error occurred while fetching user data."}`);
      } else if (error.request) {
        toast.error("No response from the server. Please check your network connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Initialize data
  useEffect(() => {
    fetchWheelData();
    if (id) {
      fetchUser();
    }
  }, [id]);

  // Process segment data from API response
  const segmentData = vendor.flatMap((v) => {
    const today = new Date();

    // Filter vendor offerings based on quantity and date
    const vendorOfferings =
      v.vendor?.offerings
        ?.filter(
          (offering) =>

            (!offering.endDate || new Date(offering.endDate) > today)
        )
        .map((offering) => ({
          label: offering.name,
          vendorId: v._id,
          labelId: offering._id,
          vId: v.vendor?.vendorInfo || "",
          type: "Vendor" as const,
        })) || [];

    // Filter admin offerings based on quantity and date
    const adminOfferings =
      v.admin?.offerings
        ?.filter(
          (offering) =>

            (!offering.endDate || new Date(offering.endDate) > today)
        )
        .map((offering) => ({
          label: offering.name,
          vendorId: v._id,
          labelId: offering._id,
          vId: v.admin?.adminInfo || "",
          type: "Admin" as const,
        })) || [];

    return [...vendorOfferings, ...adminOfferings];
  });

  // Update winner in database and UI
  const updateWinner = async (p: SegmentData) => {
    const details = segmentData.filter((s) => s.labelId === p.labelId);
    if (details.length === 0) {
      toast.success("🎉 Keep spinning! More surprises on the way! 🚀");
      return;
    }

    const payload = { ...details[0], id };

    try {
      setIsAble(true);
      await axios.put(`${API_BASE_URL}/wheel/update`, payload);

      // Update local state to reflect changes
      setVendor((prevVendor) => {
        return prevVendor.map((v) => {
          // Update vendor offerings - only modify quantity if it exists
          const updatedVendorOfferings = v.vendor?.offerings?.map((offering) => {
            if (offering._id === p.labelId) {
              // Only decrease quantity if it exists
              const newQuantity = offering.quantity !== undefined 
                ? offering.quantity - 1 
                : undefined;
              
              return {
                ...offering,
                quantity: newQuantity
              };
            }
            return offering;
          }).filter((offering) => {
            // Keep the offering if:
            // 1. It has no quantity (unlimited) AND no end date OR end date not passed
            // OR
            // 2. It has quantity > 0 AND (no end date OR end date not passed)
            const isExpired = offering.endDate && new Date(offering.endDate) <= new Date();
            const hasQuantity = offering.quantity !== undefined;
            
            if (hasQuantity) {
              return offering?.quantity > 0 && !isExpired;
            }
            return !isExpired; // Keep unlimited offers unless expired
          }) || [];

          // Update admin offerings - same logic as vendor offerings
          const updatedAdminOfferings = v.admin?.offerings?.map((offering) => {
            if (offering._id === p.labelId) {
              const newQuantity = offering.quantity !== undefined 
                ? offering.quantity - 1 
                : undefined;
              
              return {
                ...offering,
                quantity: newQuantity
              };
            }
            return offering;
          }).filter((offering) => {
            const isExpired = offering.endDate && new Date(offering.endDate) <= new Date();
            const hasQuantity = offering.quantity !== undefined;
            
            if (hasQuantity) {
              return offering?.quantity > 0 && !isExpired;
            }
            return !isExpired; // Keep unlimited offers unless expired
          }) || [];

          return {
            ...v,
            vendor: v.vendor ? { ...v.vendor, offerings: updatedVendorOfferings } : undefined,
            admin: v.admin ? { ...v.admin, offerings: updatedAdminOfferings } : undefined
          };
        }).filter((v) =>
          // Keep vendor if either vendor or admin has offerings
          (v.vendor?.offerings?.length ?? 0) > 0 ||
          (v.admin?.offerings?.length ?? 0) > 0
        );
      });

      toast.success(`🎉 Jackpot! You just won ${payload.label}! 🎁🔥 Check your email or spam folder!`);
        setTimeout(() => {
          window.location.reload();
        }, 300)
    } catch (error: any) {
      console.error("Error updating winner:", error);
      toast.error("Failed to update prize. Please try again later.");
    } finally {
      setIsAble(false);
    }
  };

  // Generate wheel SVG elements
  const generateWheel = () => {
    const segments = segmentData.length;
    if (segments === 0) {
      return (
        <text
          x="250"
          y="170"
          fill="#7D7D7D"
          fontWeight="bold"
          fontSize="20"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          Spin for fun!😁 More are coming soon! 🚀
        </text>
      );
    }

    const segmentAngle = 360 / segments;
    const centerX = 250;
    const centerY = 250;
    const radius = 230; // Increased radius for a bigger wheel
    const wheelSegments = [];

    // Generate wheel segments
    segmentData.forEach((segment, index) => {
      const startAngle = index * segmentAngle - 90;
      const endAngle = (index + 1) * segmentAngle - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;
      const pathData = [
        `M ${centerX},${centerY}`,
        `L ${x1},${y1}`,
        `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`,
        "Z"
      ].join(" ");
      const isEven = index % 2 === 0;

      // Create the segment path
      wheelSegments.push(
        <path
          key={`segment-${index}`}
          d={pathData}
          fill={isEven ? "#ffde3b" : "#000"}
          stroke="#fff"
          strokeWidth="1"
        />
      );

      // Add the text label with improved text wrapping
      const textAngle = startAngle + segmentAngle / 2;
      const textRad = (textAngle * Math.PI) / 180;

      // Position text closer to the outer edge for more space
      const textRadius = radius * 0.65;
      const textX = centerX + textRadius * Math.cos(textRad);
      const textY = centerY + textRadius * Math.sin(textRad);

      let textRotation = textAngle;
      if (textAngle > 90 && textAngle < 270) {
        textRotation += 180;
      }

      // Word wrapping logic
      const words = segment.label.split(' ');
      const maxWordsPerLine = Math.max(1, Math.min(3, Math.ceil(words.length / 3)));

      // Split into lines with more intelligent word distribution
      const lines = [];
      for (let i = 0; i < words.length; i += maxWordsPerLine) {
        lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
      }

      // Dynamic font sizing based on segment angle and text length
      // const maxLineLength = Math.max(...lines.map(line => line.length));
      const fontSize = 10
      // Math.max(10, Math.min(16, 24 - (maxLineLength * 0.3) - (segments * 0.2)));

      // Render each line with proper spacing
      lines.forEach((line, lineIndex) => {
        const lineOffset = (lineIndex - (lines.length - 1) / 2) * fontSize * 1.2;
        wheelSegments.push(
          <text
            key={`text-${index}-line${lineIndex}`}
            x={textX}
            y={textY + lineOffset}
            fill={isEven ? "#d00" : "#ffde3b"}
            fontWeight="bold"
            fontSize={fontSize}
            textAnchor="middle"
            alignmentBaseline="middle"
            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
          >
            {line}
          </text>
        );
      });
    });

    // Add outer ring
    wheelSegments.push(
      <circle
        key="outer-ring"
        cx={centerX}
        cy={centerY}
        r={radius + 10}
        fill="none"
        stroke="#d4af37"
        strokeWidth="20"
      />
    );

    return wheelSegments;
  };

  // Handle spin wheel action
  const spinWheel = async () => {
    if (!isPaid) {
      toast.error("Please complete payment to spin the wheel and win exciting rewards!", {
        icon: <FaDice color="#facc15" size={24} />,
      });
      return;
    }

    // Refresh user data
    await fetchUser();

    if (spinning || isAble) return;
    if (nextSpinTime && new Date() < nextSpinTime) {
      toast.error(`Please wait ${timeLeft} before spinning again.`, {
        icon: <FaClock className="text-yellow-500" />,
      });
      return;
    }
    // Check if the user has exceeded the maximum number of spins
    if (user?.numberOfTimesWheelRotate >= 2) {
      toast.error("You've reached your daily spin limit. Try again tomorrow!", {
        icon: <FaClock className="text-yellow-500" />,
      });
      return;
    }

    // Not enough segments to spin
    if (segmentData.length === 0) {
      toast.error("No prizes available to win right now. Please check back later!");
      return;
    }

    setSpinning(true);
    setPrize(null);

    // Calculate random spin (between 5-8 full rotations plus random position)
    const randomSpin = Math.floor(Math.random() * 360) + (1800 + Math.floor(Math.random() * 1080));
    setRotation(rotation + randomSpin);

    // Determine winner after animation completes
    setTimeout(async () => {
      const finalDegree = (rotation + randomSpin) % 360;
      const segmentSize = 360 / segmentData.length;

      let winningIndex = Math.floor(((360 - finalDegree) % 360) / segmentSize);
      if (winningIndex >= segmentData.length) {
        winningIndex = 0;
      }

      const winningPrize = segmentData[winningIndex];
      setPrize(winningPrize);

      // Update winner in database
      await updateWinner(winningPrize);

      // Update user spin count
      try {
        if (id) {
          const updatedUser = await axios.put(`${API_BASE_URL}/users/${id}/increment-spin`);
          if (updatedUser.data.message && updatedUser.data.message.includes('Please wait')) {
            // Handle cooldown message
            toast.error(updatedUser.data.message);
            return;
          }
          setUser(updatedUser.data.user);
        }
      } catch (error: any) {
        console.error("Error updating user spin count:", error);

        if (error.response) {
          // Handle specific error messages from the backend
          const errorMessage = error.response.data.message;

          if (errorMessage.includes("Please wait") && errorMessage.includes("hour(s) before spinning again")) {
            // 8-hour delay message
            toast.error(errorMessage);
          } else if (errorMessage.includes("You've reached your daily limit")) {
            // 24-hour reset message
            toast.error("Maximum spin limit reached. Please try again after 24 hours.");
          } else {
            // Generic error
            toast.error("An error occurred while updating your spin count.");
          }
        } else {
          // Network or other errors
          toast.error("An error occurred while updating your spin count.");
        }
      }


      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <div className="text-center">
        <button
          onClick={spinWheel}
          disabled={spinning || isAble || isLoading}
          className={`w-fit sm:w-fit bg-[#DBC166] mt-4 text-black px-4 py-1 sm:py-2 text-base sm:text-lg rounded-full font-medium transition-all duration-300 ease-in-out 
            ${spinning || isAble || isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#e9dbac] hover:shadow-lg hover:scale-105"}`}
        >
          {isLoading ? "Loading..." :
            spinning ? "Spinning..." :
              isAble ? "Processing..." :
                "Spin & Win – Exclusive Rewards Await! 🎉"}
        </button>

        {prize !== null && (
          <p className="mt-4 text-xl font-semibold text-green-600">
            🎉 You won: <span className="font-bold">{prize?.label || "Oops... Nothing!🎭"}</span>
            <br />
            <span className="text-sm font-normal">Please check your email for details</span>
          </p>
        )}
      </div>

      {/* Wheel Container - Made larger */}
      <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] shadow-none" role="img" aria-label="Spinning wheel game">
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          aria-hidden="true"
        >
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-600"></div>
        </div>

        {/* Rotating Wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="w-full h-full shadow-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 500 500"
            width="100%"
            height="100%"
            className="rounded-full"
          >
            {generateWheel()}
          </svg>
        </motion.div>

        {/* Fixed center image */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 z-10"
          aria-hidden="true"
        >
          {/* Black background circle */}
          <div className="absolute w-full h-full rounded-full bg-black"></div>

          {/* Center image */}
          <img
            src="/centerWheel.webp"
            alt=""
            className="absolute w-full h-full rounded-full object-cover"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Spins remaining indicator */}
      {user && (
        <div className="text-center mt-2 text-sm text-gray-600">
          Spins today: {user.numberOfTimesWheelRotate || 0}/2
        </div>
      )}
    </div>
  );
};

export default SpinWheel;