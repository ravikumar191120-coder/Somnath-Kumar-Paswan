import { useState, useEffect } from "react";
import { Heart, Sparkles, Music, Calendar, Smile, Gift, Flower, Sun, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import FloatingParticles from "./components/FloatingParticles";
import LoveLetterBox from "./components/LoveLetterBox";
import MeetingCountdown from "./components/MeetingCountdown";
import SongPlayer from "./components/SongPlayer";
import GFHappinessCenter from "./components/GFHappinessCenter";
import CutePandaCouple from "./components/CutePandaCouple";

interface FlyingRose {
  id: number;
  startX: number;
  size: number;
  delay: number;
  duration: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"paigam" | "khushi" | "mulaqat" | "radio">("paigam");
  const [currentTimeStr, setCurrentTimeStr] = useState("");
  const [greeting, setGreeting] = useState("Uth jaao na my lovely Pagli! 💕");
  
  // Synchronized romantic names from settings
  const [names, setNames] = useState({ recipientName: "Lehli", senderName: "Aapka Bacha" });

  useEffect(() => {
    const loadNames = () => {
      try {
        const saved = localStorage.getItem("subha_love_config");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.recipientName && parsed.senderName) {
            setNames({
              recipientName: parsed.recipientName,
              senderName: parsed.senderName
            });
          }
        }
      } catch (e) {
        // ignore
      }
    };
    loadNames();
    const interval = setInterval(loadNames, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Rose collection state synced to localStorage
  const [roseCount, setRoseCount] = useState<number>(() => {
    const saved = localStorage.getItem("babu_rose_count_collect");
    return saved ? parseInt(saved, 10) : 5; // Start with 5 roses graciously
  });

  const [flyingRoses, setFlyingRoses] = useState<FlyingRose[]>([]);

  useEffect(() => {
    localStorage.setItem("babu_rose_count_collect", roseCount.toString());
  }, [roseCount]);

  // Clock updating in sweet Indian Standard formats or beautiful localized indicators
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours();
      let sweetGreeting = `Uth jaao na my lovely ${names.recipientName}! 💕`;

      if (hrs >= 4 && hrs < 12) {
        sweetGreeting = `Good Morning my ultra gorgeous ${names.recipientName} Cutiee! 🌅 Suno na pagli, jaldi se uth ke smile bhejiye!`;
      } else if (hrs >= 12 && hrs < 16) {
        sweetGreeting = `Good afternoon my sweet ${names.recipientName}! ☀️ Time par khaana khao aur thoda aaram karo bacha!`;
      } else if (hrs >= 16 && hrs < 20) {
        sweetGreeting = `Ek pyaari si haseen shaam Mubarak ho, ${names.recipientName}! 🌇 Kya haal hain aapke bacha?`;
      } else {
        sweetGreeting = `Aapko ek sukoon bhari sweet dreams waali raat, my lovely ${names.recipientName}! 🌌 Phone side me rakho aur so jaao baby!`;
      }
      setGreeting(sweetGreeting);

      // Localized format
      setCurrentTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [names.recipientName]);

  // Trigger floating virtual roses across the screen
  const triggerFlyingRoses = () => {
    setRoseCount((prev) => prev + 1);

    const count = 5;
    const newRoses: FlyingRose[] = [];
    for (let i = 0; i < count; i++) {
      newRoses.push({
        id: Date.now() + Math.random() + i,
        startX: 5 + Math.random() * 90, // % from left
        size: 20 + Math.random() * 25,  // px
        delay: Math.random() * 0.4,       // seconds delay
        duration: 2.5 + Math.random() * 1.5 // seconds float time
      });
    }

    setFlyingRoses((prev) => [...prev, ...newRoses]);

    // Cleanup flying roses after animation completes
    setTimeout(() => {
      setFlyingRoses((prev) => prev.filter((r) => !newRoses.includes(r)));
    }, 4500);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff1f2] via-[#ffe4e6] to-[#ffd1d9] overflow-x-hidden font-sans pb-16">
      
      {/* Absolute floating sparkles & hearts overlay background */}
      <FloatingParticles intensity="medium" />

      {/* Flyway Rose burst animated layer */}
      <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none overflow-hidden z-50">
        <AnimatePresence>
          {flyingRoses.map((rose) => (
            <motion.div
              key={rose.id}
              initial={{ y: "100vh", x: `${rose.startX}vw`, opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{
                y: "-10vh",
                x: [
                  `${rose.startX}vw`,
                  `${rose.startX + (Math.random() > 0.5 ? 8 : -8)}vw`,
                  `${rose.startX + (Math.random() > 0.5 ? -4 : 4)}vw`
                ],
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1.2, 1, 0.4],
                rotate: 360
              }}
              transition={{
                duration: rose.duration,
                delay: rose.delay,
                ease: "easeOut"
              }}
              className="absolute text-rose-500 drop-shadow-md select-none"
              style={{ fontSize: rose.size }}
            >
              🌹
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Primary container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-6 md:pt-10">
        
        {/* Soft glowing ambient top banner */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-rose-100/30 shadow-xs mb-4"
          >
            <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span className="font-mono text-[10.5px] font-semibold text-rose-950 uppercase tracking-wider">
              {names.recipientName}'s Local Time: {currentTimeStr}
            </span>
          </motion.div>

          {/* Majestic Heading */}
          <motion.h1 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-romantic italic text-3xl sm:text-5xl font-bold text-rose-950 tracking-tight leading-tight pt-1"
          >
            Good Morning, {names.recipientName}! ❤️
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs sm:text-sm text-rose-800 font-sans mt-3 max-w-md mx-auto leading-relaxed"
          >
            {greeting} Aapka din utna hi haseen aur anmol ho jitni aapki masoom muskaan hai.
          </motion.p>

          {/* Cute Animated Panda Couple Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <CutePandaCouple />
          </motion.div>
        </div>

        {/* Tab Controls Navigation */}
        <div className="flex items-center justify-center space-x-1.5 sm:space-x-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl max-w-lg mx-auto border border-rose-100/30 shadow-xs mb-8">
          {[
            { id: "paigam", label: "Love Letter 💌", icon: Heart },
            { id: "khushi", label: "Smile Box 🥰", icon: Smile },
            { id: "mulaqat", label: "Our Meet ⏳", icon: Calendar },
            { id: "radio", label: "Cute Player 🎶", icon: Music }
          ].map((tab) => {
            const IconComponent = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  triggerFlyingRoses(); // Spark floating flowers upon navigation!
                }}
                className={`flex-1 py-3 px-1 sm:px-3 text-center rounded-xl text-xs font-semibold cursor-pointer transition-all outline-none flex items-center justify-center gap-1 sm:gap-1.5 ${
                  isSel
                    ? "bg-rose-500 text-white shadow-md font-bold scale-[1.02]"
                    : "text-rose-800 hover:bg-rose-100/60"
                }`}
              >
                <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Render Tab Contents */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === "paigam" && (
              <motion.div
                key="paigam"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <LoveLetterBox onAddRose={triggerFlyingRoses} />
              </motion.div>
            )}

            {activeTab === "khushi" && (
              <motion.div
                key="khushi"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <GFHappinessCenter roseCount={roseCount} onRoseAdded={triggerFlyingRoses} />
              </motion.div>
            )}

            {activeTab === "mulaqat" && (
              <motion.div
                key="mulaqat"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <MeetingCountdown />
              </motion.div>
            )}

            {activeTab === "radio" && (
              <motion.div
                key="radio"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <SongPlayer />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Gentle Footer footer note */}
        <div className="mt-12 text-center text-[10px] sm:text-xs text-rose-700/80 max-w-sm mx-auto font-sans">
          <p className="flex justify-center items-center gap-1">
            <span>Sadaa aapko khush rakhne ki ek koshish</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
          </p>
          <p className="mt-1 font-mono tracking-wider opacity-60">
            MADE FOR YOU WITH ABSOLUTE LOVE
          </p>
        </div>

      </div>
    </div>
  );
}
