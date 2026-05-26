import { useState } from "react";
import { Smile, Sparkles, Heart, Gift, Moon, Sun, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GFHappinessCenterProps {
  roseCount: number;
  onRoseAdded: () => void;
}

export default function GFHappinessCenter({ roseCount, onRoseAdded }: GFHappinessCenterProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [compliment, setCompliment] = useState<string>("");
  const [isJarOpening, setIsJarOpening] = useState(false);

  // Customized, highly respectful sweet replies in Roman Hindi using "Aap"
  const moodReplies: Record<string, { emoji: string; reply: string; title: string }> = {
    sleepy: {
      emoji: "😴",
      title: "Neend aa rhi h?",
      reply: "Oye sleepy baby! Aap sote hue bhi kitni pyaari lagti ho pagli! Chaliye ek kaam kijiye, bistar se uthiye aur cute sa yawn karke apna din start kijiye. Aapka bacha aapki pyaari si smile dekhne ke liye tadap raha hai!"
    },
    missing: {
      emoji: "🥺",
      title: "Missing Me?",
      reply: "Hey bacha! Main bhi har ek second aapke hi bare me soch raha hoon. Aap jab bhi mujhe miss karein, dil par haath rakhna aur yaad rkhna ki aapka bacha sirf aapka hai. We are holding hands in spirit, cutiee! ❤️"
    },
    happy: {
      emoji: "🥰",
      title: "Bohot Happy!",
      reply: "Aapki khushi hi mere jahan ki ultimate goal hai, Boki! Jab aap khush hoti hain, toh mera din automagically 100x better ho jata hai. Nazar na lage meri sweet boki ko! Isi tarah din-bhar cute nakhre dikhati rahiye!"
    },
    lazy: {
      emoji: "🦦",
      title: "Lazy Mood?",
      reply: "Otter baby mode on! Lazy hona toh aapka full birthright hai cutiee. Aaj bilkul koi kaam karne ki zarurat nahi hai bacha, bas soft pillows me snuggle karke leti rahiye. Aapka bacha aapke sare nakhre uthane ke liye ready hai!"
    },
    sad: {
      emoji: "😢",
      title: "Thoda Udas?",
      reply: "Suno na baby... can you do me a favor? Apne dono cheeks ko halka sa pull kijiye aur upar smile kijiye! Aapki aankhon me udasi bilkul achi nahi lagti pagli. Aapki smile world ki sabse sweet cheez hai, so let's cheer up! I am always here with you."
    }
  };

  const compliments = [
    "Aap mere dimaag me 24/7 rent-free ghumti rehti ho, baby! 🥰",
    "Aapki smile dekh kar pure phone ki battery 100% charge ho jati hai bacha! ⚡",
    "Boki, aap itni pyaari pagli ho ki aapka face dekhte hi mera gussa bhaag jata hai! 🌸",
    "Aap is poore world ki sabse cute aur sweet bacha ho. Dil khush ho jata hai! 😍",
    "Mujhe lagta hai mere life ke saare luck points aapko meri gf banane me select ho gaye! 🍀",
    "Aapki soothing aawaz bilkul mere favorite song ki tarah sweet hai! 🎶",
    "Cutiee, aapke nakhre bhi utne hi pyaare hain jitni aapki mithi masoom muskaan! ✨",
    "Aap mere life ki cute si sunshine ho bacha, aapke bina sab cloudy lagta hai! 🌤️",
    "Yeh website sirf boki ki sweet smile dekhne ke liye banayi hai aapke bache ne! 💗",
    "Aapki aankhein stars ki tarah chamakti hain jab aap khush hoti ho pagli! ⭐",
    "Mere dil ke heart rate monitor me aapki smile se hi peaks aate hain baby! Peak Romance! 📈",
    "Aap jaisa cutiee toh rab ne banake bilkul recipe hi delete kar di! Unique limited edition! 👑"
  ];

  const pickCompliment = () => {
    setIsJarOpening(true);
    // Dynamic transition delay
    setTimeout(() => {
      const idx = Math.floor(Math.random() * compliments.length);
      setCompliment(compliments[idx]);
      setIsJarOpening(false);
      onRoseAdded(); // Reward flower trigger
    }, 600);
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6" id="happiness-module">
      {/* Rose bouquet counter banner */}
      <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/15 to-pink-500/10 backdrop-blur-md rounded-2xl p-5 border border-rose-200/50 text-center shadow-xs mb-6">
        <span className="text-[10px] text-rose-800 font-bold uppercase tracking-widest block mb-2">
          🌹 Boki Ka Red Rose Bucket (Virtual Roses Collection)
        </span>
        <div className="flex items-center justify-center gap-3">
          <motion.div 
            animate={{ scale: roseCount > 0 ? [1, 1.2, 1] : 1 }}
            className="text-4xl"
          >
            🌹
          </motion.div>
          <div>
            <div className="text-2xl font-bold font-mono text-rose-950">
              {roseCount}
            </div>
            <div className="text-[10px] text-rose-700/90 font-sans">
              Roses collected by Boki today!
            </div>
          </div>
        </div>
        <p className="text-xs text-rose-800/80 mt-3 font-sans leading-relaxed">
          Oye cutiee, is page par kisi bhi button ko click karne se screen par roses fly karenge! Aur agar aapko direct load bhejra hai, toh click <strong>"Boki Ko Rose Bhejein"</strong> button!
        </p>
        <button
          onClick={onRoseAdded}
          className="mt-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-2.5 px-6 text-xs font-semibold cursor-pointer transition-all active:scale-95 shadow-sm inline-flex items-center gap-1.5"
        >
          <span>Boki Ko Rose Bhejein ✨🌹</span>
        </button>
      </div>

      {/* Babu Mood check-in */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-rose-100/50 shadow-sm mb-6">
        <h4 className="text-sm font-semibold text-rose-950 mb-3 flex items-center gap-1.5">
          <Smile className="w-4 h-4 text-rose-500" />
          <span>Boki, Aapka Aaj Ka Mood Kaisa Hai?</span>
        </h4>
        <p className="text-xs text-rose-800 mb-4 font-sans leading-relaxed">
          Apna morning feel tap krein aur apne bache ki taraf se ek super sweet response paayein:
        </p>

        {/* Mood select grid */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {Object.entries(moodReplies).map(([key, data]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedMood(key);
                onRoseAdded();
              }}
              className={`p-2 rounded-xl text-center transition-all border outline-none cursor-pointer hover:bg-rose-50 flex flex-col items-center gap-1 ${
                selectedMood === key
                  ? "bg-rose-100 text-rose-950 border-rose-300 shadow-xs"
                  : "bg-white/80 text-rose-900 border-rose-100/60"
              }`}
            >
              <span className="text-xl">{data.emoji}</span>
              <span className="text-[9px] font-semibold text-rose-950 truncate max-w-full">
                {data.title.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Dynamic customized mood response */}
        <AnimatePresence mode="wait">
          {selectedMood && (
            <motion.div
              key={selectedMood}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-rose-50/70 border border-rose-100 rounded-xl p-4 relative overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 text-5xl opacity-10">
                {moodReplies[selectedMood].emoji}
              </div>
              <div className="flex items-center gap-1.5 font-bold text-rose-950 text-xs mb-1.5">
                <span>{moodReplies[selectedMood].emoji}</span>
                <span>{moodReplies[selectedMood].title} - Aapke Liye:</span>
              </div>
              <p className="text-xs text-rose-900 font-sans italic leading-relaxed">
                "{moodReplies[selectedMood].reply}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Love Compliment Jar */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-rose-100/50 shadow-sm relative overflow-hidden">
        <h4 className="text-sm font-semibold text-rose-950 mb-3 flex items-center gap-1.5">
          <Gift className="w-4 h-4 text-rose-500 fill-rose-100" />
          <span>Pyaar Ka Matka (Morning Love Jar)</span>
        </h4>
        <p className="text-xs text-rose-800 mb-4 font-sans leading-relaxed">
          Is matke me bohot saare mithaas se bhare compliments chhupaye hain. Ek tap kijiye aur aapko khusi dene wali baat khulegi:
        </p>

        <div className="flex flex-col items-center justify-center p-3 text-center">
          {/* Visual jar icon with light bouncy spring */}
          <motion.div
            animate={{ y: isJarOpening ? [0, -10, 0] : 0 }}
            className="text-5xl cursor-pointer select-none pb-4 drop-shadow-md"
            onClick={pickCompliment}
          >
            🍯🏺
          </motion.div>

          <button
            onClick={pickCompliment}
            disabled={isJarOpening}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 hover:border-rose-300 rounded-xl py-2 px-5 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 bg-amber-50"
          >
            {isJarOpening ? "Chitthi Khul Rhi Hai..." : "Matke Se Compliment Kholiye 📜"}
          </button>

          {/* Compliment Display Box */}
          <AnimatePresence>
            {compliment && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-5 bg-gradient-to-br from-amber-50 to-rose-50/50 p-4 rounded-xl border border-rose-100 font-sans max-w-md"
              >
                <div className="flex items-center justify-center gap-1 text-[10px] text-rose-700 font-semibold tracking-wider uppercase mb-1">
                  <Star className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span>Aapke Liye Paigam</span>
                  <Star className="w-3 h-3 text-rose-500 fill-rose-500" />
                </div>
                <p className="text-xs md:text-sm font-medium text-rose-950 italic leading-relaxed">
                  "{compliment}"
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
