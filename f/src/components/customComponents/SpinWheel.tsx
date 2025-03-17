import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
interface Offering {
  _id: string;
  name: string;
  quantity?: number;
  startDate?: string;
  endDate?: string;
}

interface Vendor {
  _id: any;
  vendorInfo: string;
  offerings: Offering[];
}

interface VendorData {
  _id: string;
  vendor: Vendor;

}




const SpinWheel = () => {
  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [rotation, setRotation] = useState<any>(0);
  const [spinning, setSpinning] = useState<any>(false);
  const [vendor, setVendor] = useState<VendorData[]>([]);
  const [hasFetched, setHasFetched] = useState<boolean>(true);
  const [user, setuser] = useState<any>();
  const [prize, setPrize] = useState<any>(null);


  const fetchWheelData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/wheel`);
      setVendor(res.data.data);

      setHasFetched(false);
    }
    catch (error: any) {
      console.error("Error fetching wheel data:", error);
      if (error.response) {
        console.error(`Error: ${error.response.data.message || "An error occurred while fetching wheel data."}`);
      } else if (error.request) {
        toast.error("No response from the server. Please check your network connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }

  const fetchUser = async () => {
    if (id) {
      try {
        const res = await axios.get(`${API_BASE_URL}/users/${id}`);
        setuser(res.data.user);
      }
      catch (error: any) {
        console.error("Error fetching wheel data:", error);
        if (error.response) {
          toast.error(`Error: ${error.response.data.message || "An error occurred while fetching wheel data."}`);
        } else if (error.request) {
          toast.error("No response from the server. Please check your network connection.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }

  }

  useEffect(() => {
    if (hasFetched) {

      fetchWheelData()
    }
    else
      console.log("the data has been fetched already");
  }, [])

  const segmentData = vendor.flatMap((v) =>
    v.vendor.offerings.map((offering) => ({
      label: offering.name,
      vendorId: v._id,
      labelId: offering._id,
      vId: v.vendor.vendorInfo

    }))
  );


  const updateWinner = async (p: Record<string, any>) => {

    const details = segmentData.filter((s) => s.labelId == p.labelId);
    const payload = { ...details[0], id };
  
    if (details.length > 0) {
      try {
        const res = await axios.put(`${API_BASE_URL}/wheel/update`, payload);
        const prize = res.data.data.prizeWon;
        toast.success(`🎉 Jackpot! You just won ${prize}! 🎁🔥 Check your email or spam folder!`);
      } catch (error: any) {
        console.error("Error updating winner:", error);
        if (error.response) {

          toast.error(`Error: ${error.response.data.message || "An error occurred while updating the winner."}`);
        } else if (error.request) {
          toast.error("No response from the server. Please check your network connection.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    }
    else {
      toast.success("🎉 Keep spinning! More surprises on the way! 🚀");

    }
  }
  const generateWheel = () => {
    const segments = segmentData.length;
    const segmentAngle = 360 / segments;
    const centerX = 250;
    const centerY = 250;
    const radius = 200; // Reduced radius to make the wheel smaller
    const wheelSegments = [];
  
    // Check if there are no segments or no text to show
    if (segments === 0 || !segmentData.some(segment => segment.label)) {
      return (
        <text
          x={centerX}
          y={centerY - 80} // Adjusted to position "Spin for Fun!" on top
          fill="#7D7D7D" // A neutral gray  
          fontWeight="bold"
          fontSize="20"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          Spin for fun!😁 More are coming soon! 🚀
        </text>
      );
    }
  
    // Generate wheel segments if there are segments with text
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
  
      // Add the text label
      const textAngle = startAngle + segmentAngle / 2;
      const textRad = (textAngle * Math.PI) / 180;
      const textX = centerX + (radius * 0.5) * Math.cos(textRad);
      const textY = centerY + (radius * 0.6) * Math.sin(textRad);
      let textRotation = textAngle;
      if (textAngle > 90 && textAngle < 270) {
        textRotation += 180;
      }
  
      // Split the label into lines
      const words = segment.label.split(' ');
      const line1 = words.slice(0, Math.ceil(words.length / 3)).join(' ');
      const line2 = words.slice(Math.ceil(words.length / 3), Math.ceil((2 * words.length) / 3)).join(' ');
      const line3 = words.slice(Math.ceil((2 * words.length) / 3)).join(' ');
  
      // Calculate dynamic font size based on text length
      const maxLength = Math.max(line1.length, line2.length, line3.length);
      const fontSize = Math.max(10, 16 - (maxLength * 0.5)); // Adjust font size dynamically
  
      // Render the text lines
      wheelSegments.push(
        <text
          className="text-wrap"
          key={`text-${index}-line1`}
          x={textX}
          y={textY - 15} // Adjust Y position for the first line
          fill={isEven ? "#d00" : "#ffde3b"}
          fontWeight="bold"
          fontSize={fontSize} // Dynamic font size
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${textRotation}, ${textX}, ${textY})`}
        >
          {line1}
        </text>
      );
  
      wheelSegments.push(
        <text
          className="text-wrap"
          key={`text-${index}-line2`}
          x={textX}
          y={textY} // Adjust Y position for the second line
          fill={isEven ? "#d00" : "#ffde3b"}
          fontWeight="bold"
          fontSize={fontSize} // Dynamic font size
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${textRotation}, ${textX}, ${textY})`}
        >
          {line2}
        </text>
      );
  
      if (line3) {
        wheelSegments.push(
          <text
            className="text-wrap"
            key={`text-${index}-line3`}
            x={textX}
            y={textY + 15} // Adjust Y position for the third line
            fill={isEven ? "#d00" : "#ffde3b"}
            fontWeight="bold"
            fontSize={fontSize} // Dynamic font size
            textAnchor="middle"
            alignmentBaseline="middle"
            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
          >
            {line3}
          </text>
        );
      }
    });
  
    // Add outer ring
    wheelSegments.push(
      <circle
        key="outer-ring"
        cx={centerX}
        cy={centerY}
        r={radius + 10}
        fill="#2222"
        stroke="#d4af37"
        strokeWidth="20"
      />
    );
  
    return wheelSegments;
  };



  const spinWheel = async () => {
    fetchUser()
    if (spinning) return;

    // Check if the user has exceeded the maximum number of spins
    if (user?.numberOfTimesWheelRotate > 23) {
      toast.error("Maximum spin limit reached. Please try again after 24 hours.");
      return;
    }

    setSpinning(true);
    setPrize(null);

    const randomSpin = Math.floor(Math.random() * 360) + 1800;
    setRotation(rotation + randomSpin);

    setTimeout(async () => {
      const finalDegree = (rotation + randomSpin) % 360;
      const segmentSize = 360 / segmentData.length;

      let winningIndex = Math.floor(((360 - finalDegree) % 360) / segmentSize);
      if (winningIndex >= segmentData.length) {
        winningIndex = 0;
      }

      setPrize(segmentData[winningIndex]);
      updateWinner(segmentData[winningIndex]);
      try {
        const updatedUser = await axios.put(`${API_BASE_URL}/users/${id}/increment-spin`);
        setuser(updatedUser.data.user);
      } catch (error) {
        console.error("Error updating user spin count:", error);
        toast.error("An error occurred while updating your spin count.");
      }

      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <div className="text-center">
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="w-fit sm:w-fit bg-[#DBC166] mt-4 text-black px-4 py-1 sm:py-2 text-base sm:text-lg rounded-full font-medium transition-all duration-300 ease-in-out hover:bg-[#e9dbac] hover:shadow-lg hover:scale-105"
        >
          {spinning ? "Spinning..." : "Spin & Win – Exclusive Rewards Await!🎉"}
        </button>
        {prize !== null && (
          <p className="mt-4 text-xl font-semibold text-green-600">
            🎉 You won: <span className="font-bold">{prize?.label || "Oops... Nothing!🎭"} please wait for email</span>

          </p>
        )}
      </div>
      <div className="relative w-80 h-80 md:w-96 md:h-96 shadow-none">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-8.6 -translate-y-1/2 w-0 h-0 z-10">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-bla-600"></div>
        </div>

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="w-full h-full shadow-none"
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

        {/* Fixed center image that doesn't rotate */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 z-10">
          {/* Black background circle */}
          <div className="absolute w-full h-full rounded-full bg-black"></div>

          {/* Center image */}
          <img
            src="/centerWheel.png"
            alt="Center Logo"
            className="absolute w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;