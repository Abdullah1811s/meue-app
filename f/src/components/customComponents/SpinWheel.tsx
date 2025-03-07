
import { useState } from "react";
import { motion } from "framer-motion";
const prizes = [100, 500, 900, 160, 120, 700, 350, 60, 400, 320, 800, 200];

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [prize, setPrize] = useState(0);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    const randomSpin = Math.floor(Math.random() * 360) + 1800;
    setRotation(randomSpin);

    setTimeout(() => {
      const finalDegree = randomSpin % 360;
      const segmentSize = 360 / prizes.length;
      const winningIndex = Math.floor(finalDegree / segmentSize);
      setPrize(prizes[winningIndex]);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10">
      <div className="text-center">
       

        <button
          onClick={spinWheel}
          disabled={spinning}
          className="w-fit sm:w-fit bg-[#DBC166] mt-4 text-black px-2 sm:py-2 text-base sm:text-lg rounded-full font-medium transition-all duration-300 ease-in-out hover:bg-[#e9dbac] hover:shadow-lg hover:scale-105">
          {spinning ? "Spinning..." : "Spin & Win – Exclusive Rewards Await!🎉"}
        </button>

        {prize !== null && (
          <p className="mt-4 text-xl font-semibold text-green-600">
            🎉 You won: <span className="font-bold">{prize} points!</span>
          </p>
        )}
      </div>

      <div className="relative w-80 h-80 md:w-96 md:h-96 shadow-none">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="w-full h-full shadow-none"
        >
          <img
            src="/wheel.png"
            alt="Spin Wheel"
            width={500}
            height={500}
            className="rounded-full"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SpinWheel;
