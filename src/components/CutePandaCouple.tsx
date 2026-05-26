import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";

export default function CutePandaCouple() {
  const [tapCount, setTapCount] = useState(0);
  const [pushedHearts, setPushedHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePandaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setTapCount((prev) => prev + 1);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newHeart = {
      id: Date.now() + Math.random(),
      x,
      y,
    };
    
    setPushedHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setPushedHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  return (
    <div className="w-full max-w-sm mx-auto my-4 text-center">
      {/* Container with a soft card background */}
      <div 
        className="relative bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-rose-100/50 shadow-sm overflow-hidden cursor-pointer select-none"
        onClick={handlePandaClick}
      >
        {/* Sparkles background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <span className="absolute top-2 left-6 text-xs animate-bounce">✨</span>
          <span className="absolute bottom-4 right-8 text-xs animate-pulse">🌸</span>
          <span className="absolute top-1/2 right-4 text-xs animate-ping">🌟</span>
        </div>

        {/* Floating Hearts Container */}
        {pushedHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, scale: 0.5, x: h.x, y: h.y }}
            animate={{
              opacity: 0,
              scale: 1.5,
              y: h.y - 120,
              x: h.x + (Math.random() * 60 - 30)
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-rose-500 z-30 pointer-events-none text-lg"
          >
            💖
          </motion.div>
        ))}

        {/* Forever My Panda text */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <span className="font-romantic italic text-lg sm:text-2xl font-bold bg-gradient-to-r from-rose-700 via-pink-800 to-rose-700 bg-clip-text text-transparent block">
            ~ Forever My Panda ~
          </span>
          <span className="text-[10px] text-rose-600 font-medium block uppercase tracking-widest mt-1">
            Tap them to tickle their cute hearts page!
          </span>
        </motion.div>

        {/* The Animated Pandas SVG Drawing */}
        <div className="relative w-48 h-36 mx-auto flex items-center justify-center">
          <svg
            viewBox="0 0 200 150"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Animated Red Heart Balloon held by the sweet pandas */}
            <motion.g
              animate={{
                y: [0, -6, 0],
                rotate: [-2, 2, -2],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
            >
              {/* Balloon string */}
              <path
                d="M100,25 C95,50 102,68 100,85"
                stroke="#fda4af"
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              <path
                d="M100,25 C108,52 98,72 102,85"
                stroke="#fda4af"
                strokeWidth="1.5"
                strokeDasharray="2,2"
              />
              {/* Balloon */}
              <path
                d="M100,32 C82,10 65,30 100,55 C135,30 118,10 100,32 Z"
                fill="#ec4899"
                stroke="#fff"
                strokeWidth="1.5"
              />
              {/* Balloon tie */}
              <polygon points="98,53 102,53 100,57" fill="#ec4899" />
              {/* Sparkle on balloon */}
              <ellipse cx="90" cy="28" rx="3" ry="1.5" transform="rotate(-30 90 28)" fill="white" opacity="0.6" />
            </motion.g>

            {/* PANDA LEFT (BOY/SENDER) */}
            <motion.g
              id="panda-left"
              animate={{
                y: [0, -2, 0],
                rotate: [0, 1, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
            >
              {/* Ears */}
              <ellipse cx="65" cy="65" rx="11" ry="11" fill="#1e1b4b" />
              <ellipse cx="65" cy="65" rx="5" ry="5" fill="#f43f5e" opacity="0.3" />
              
              {/* Body / Arms */}
              <ellipse cx="78" cy="115" rx="20" ry="22" fill="#1e1b4b" />
              
              {/* White belly overlay */}
              <ellipse cx="78" cy="118" rx="14" ry="15" fill="#ffffff" />
              
              {/* Head */}
              <ellipse cx="78" cy="85" rx="22" ry="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              
              {/* Black Eye Patches */}
              <ellipse cx="70" cy="85" rx="6" ry="7" transform="rotate(-15 70 85)" fill="#1e1b4b" />
              <ellipse cx="86" cy="85" rx="6" ry="7" transform="rotate(15 86 85)" fill="#1e1b4b" />

              {/* Blinking White Eyes */}
              <motion.circle
                cx="70"
                cy="84"
                r="2.5"
                animate={{ scaleY: [1, 0.1, 1, 1, 0.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                fill="#ffffff"
              />
              <motion.circle
                cx="86"
                cy="84"
                r="2.5"
                animate={{ scaleY: [1, 0.1, 1, 1, 0.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, repeatDelay: 1 }}
                fill="#ffffff"
              />

              {/* Pink Cheeks */}
              <circle cx="64" cy="92" r="3.5" fill="#fda4af" opacity="0.8" />
              <circle cx="92" cy="92" r="3.5" fill="#fda4af" opacity="0.8" />

              {/* Nose & Sweet Mouth */}
              <path d="M76,89 L80,89 L78,91 Z" fill="#1e1b4b" />
              <path d="M75,93 Q78,95 81,93" stroke="#1e1b4b" strokeWidth="1" strokeLinecap="round" fill="none" />

              {/* Left hand holding gift */}
              <rect x="76" y="105" width="10" height="10" rx="2" fill="#f43f5e" />
              <line x1="81" y1="105" x2="81" y2="115" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="76" y1="110" x2="86" y2="110" stroke="#ffffff" strokeWidth="1.5" />
            </motion.g>

            {/* PANDA RIGHT (GIRL/BOBBY/PAGLI) */}
            <motion.g
              id="panda-right"
              animate={{
                y: [0, -3, 0],
                rotate: [0, -1, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                delay: 0.3,
                ease: "easeInOut"
              }}
            >
              {/* Ears */}
              <ellipse cx="135" cy="65" rx="11" ry="11" fill="#1e1b4b" />
              <ellipse cx="135" cy="65" rx="5" ry="5" fill="#f43f5e" opacity="0.3" />
              
              {/* Cute Red Ear Bow for Pagli */}
              <path d="M123,59 C121,55 125,53 127,56 C129,53 133,55 131,59 Z" fill="#f43f5e" />
              <circle cx="127" cy="58" r="2" fill="#fff" />

              {/* Body / Arms */}
              <ellipse cx="122" cy="115" rx="20" ry="22" fill="#1e1b4b" />
              
              {/* White belly overlay */}
              <ellipse cx="122" cy="118" rx="14" ry="15" fill="#ffffff" />
              
              {/* Head */}
              <ellipse cx="122" cy="85" rx="22" ry="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              
              {/* Black Eye Patches */}
              <ellipse cx="114" cy="85" rx="6" ry="7" transform="rotate(-15 114 85)" fill="#1e1b4b" />
              <ellipse cx="130" cy="85" rx="6" ry="7" transform="rotate(15 130 85)" fill="#1e1b4b" />

              {/* Heart Eyes for Girlfriend when clicked */}
              {tapCount > 0 ? (
                <>
                  <path d="M111,84 Q114,80 117,84 Q114,88 111,84 Z" fill="#f43f5e" />
                  <path d="M127,84 Q130,80 133,84 Q130,88 127,84 Z" fill="#f43f5e" />
                </>
              ) : (
                <>
                  {/* Blinking White Eyes */}
                  <motion.circle
                    cx="114"
                    cy="84"
                    r="2.5"
                    animate={{ scaleY: [1, 0.1, 1, 1, 0.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 0.5, repeatDelay: 1 }}
                    fill="#ffffff"
                  />
                  <motion.circle
                    cx="130"
                    cy="84"
                    r="2.5"
                    animate={{ scaleY: [1, 0.1, 1, 1, 0.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, delay: 0.5, repeatDelay: 1 }}
                    fill="#ffffff"
                  />
                </>
              )}

              {/* Rosy blush cheeks */}
              <circle cx="108" cy="92" r="4.5" fill="#f43f5e" opacity="0.6" className="animate-pulse" />
              <circle cx="136" cy="92" r="4.5" fill="#f43f5e" opacity="0.6" className="animate-pulse" />

              {/* Nose & Cute shy smiley */}
              <path d="M120,89 L124,89 L122,91 Z" fill="#1e1b4b" />
              <path d="M119,93 Q122,96 125,93" stroke="#1e1b4b" strokeWidth="1" strokeLinecap="round" fill="none" />

              {/* Right hand holding gift */}
              <rect x="114" y="105" width="10" height="10" rx="2" fill="#ec4899" />
              <line x1="119" y1="105" x2="119" y2="115" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="114" y1="110" x2="124" y2="110" stroke="#ffffff" strokeWidth="1.5" />
            </motion.g>

            {/* Little sweet details - flower in hand or floating hearts */}
            <motion.path
              d="M100,105 L100,115"
              stroke="#059669"
              strokeWidth="1.5"
              strokeLinecap="round"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            {/* Red Rose on Stem held together */}
            <circle cx="100" cy="103" r="3.5" fill="#f43f5e" />
          </svg>
        </div>

        {/* Dynamic cute messages in Hinglish */}
        <div className="mt-3 bg-pink-50/50 py-1.5 px-3 rounded-lg inline-block border border-pink-100">
          <p className="font-sans text-[11px] text-pink-800 font-semibold">
            {tapCount === 0 && "Psst.. Click the pandas to see magic! 🧸"}
            {tapCount > 0 && tapCount < 5 && "Boki & Bacha cuddled forever! 💕"}
            {tapCount >= 5 && tapCount < 10 && "Aww bacha! Cuteness overloaded! 😘"}
            {tapCount >= 10 && "Love level: Infinite! 🐼♾️🐼"}
          </p>
        </div>
      </div>
    </div>
  );
}
