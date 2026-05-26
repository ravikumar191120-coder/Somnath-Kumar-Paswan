import { useState, useEffect } from "react";
import { Calendar, Heart, Hourglass, Settings, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";
import { CountdownConfig } from "../types";

export default function MeetingCountdown() {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState<CountdownConfig>(() => {
    const saved = localStorage.getItem("meet_today_countdown");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    // Default to today (2026-05-26) at 10:00 AM (local time)
    return {
      meetingDate: "2026-05-26T10:00",
      eventName: "Milne Ka Waqt 🥰 (Our Cute Meet Today)",
      specialMessage: "Bas thodi der aur my lovely Boki, fir hum sath baithe honge! 🥐☕"
    };
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    localStorage.setItem("meet_today_countdown", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(config.meetingDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [config.meetingDate]);

  return (
    <div className="w-full max-w-xl mx-auto my-6" id="mulaqat-countdown-module">
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-rose-100/50 shadow-sm relative overflow-hidden">
        {/* Glow backdrop circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-200/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-rose-100/50 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" />
              <h3 className="font-sans font-bold text-rose-950 text-sm">
                {config.eventName}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs text-rose-600 hover:text-rose-700 font-sans flex items-center gap-1 cursor-pointer bg-rose-50 px-2 py-1 rounded-lg"
            >
              {isEditing ? <Check className="w-3 h-3" /> : <Settings className="w-3 h-3" />}
              <span>{isEditing ? "Done" : "Change Date"}</span>
            </button>
          </div>

          {/* Quick Date Configuration Form */}
          {isEditing && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-white/80 rounded-xl p-4 mb-6 border border-rose-100"
            >
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-semibold text-rose-900 uppercase mb-1">Meetup ka Title:</label>
                  <input
                    type="text"
                    value={config.eventName}
                    onChange={(e) => setConfig({ ...config, eventName: e.target.value })}
                    className="w-full text-xs bg-rose-50/50 border border-rose-100 rounded-lg px-2.5 py-2 font-sans focus:outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-rose-900 uppercase mb-1">Meetup ki Date & Time:</label>
                  <input
                    type="datetime-local"
                    value={config.meetingDate}
                    onChange={(e) => setConfig({ ...config, meetingDate: e.target.value })}
                    className="w-full text-xs bg-rose-50/50 border border-rose-100 rounded-lg px-2.5 py-2 font-mono focus:outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-rose-900 uppercase mb-1">Special Message / Note:</label>
                  <input
                    type="text"
                    value={config.specialMessage}
                    onChange={(e) => setConfig({ ...config, specialMessage: e.target.value })}
                    className="w-full text-xs bg-rose-50/50 border border-rose-100 rounded-lg px-2.5 py-2 font-sans focus:outline-none focus:border-rose-300"
                    placeholder="Boki ke liye ek sweet note"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Countdown timer columns */}
          {timeLeft.isOver ? (
            <div className="text-center py-6">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto shadow-md mb-3"
              >
                <Heart className="w-8 h-8 text-white fill-white" />
              </motion.div>
              <h4 className="font-sans font-bold text-rose-950 text-base">Milne Ka Time Aa Gaya! 🎉</h4>
              <p className="text-xs text-rose-700 mt-1 italic">
                Aapka bacha bas aapse milne hi wala hai cutiee! Stay excited! 😘
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-4 gap-3 text-center mb-6">
                {[
                  { value: timeLeft.days, label: "Days", labelHindi: "Din" },
                  { value: timeLeft.hours, label: "Hours", labelHindi: "Ghante" },
                  { value: timeLeft.minutes, label: "Minutes", labelHindi: "Mint" },
                  { value: timeLeft.seconds, label: "Seconds", labelHindi: "Sknd" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/70 p-3 rounded-xl border border-rose-100/50 shadow-xs">
                    <div className="font-mono text-xl sm:text-2xl font-bold text-rose-950 tracking-tight leading-none">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] font-sans text-rose-900 font-semibold mt-1">
                      {item.label}
                    </div>
                    <div className="text-[8px] font-sans text-rose-500 italic mt-0.5">
                      {item.labelHindi}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar to meeting */}
              <div className="w-full bg-rose-100/40 rounded-full h-1.5 overflow-hidden mb-4">
                <div 
                  className="bg-gradient-to-r from-rose-400 to-pink-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(100, Math.max(5, (14 - timeLeft.days) * 7.14))}%` }}
                />
              </div>

              {/* Special loving caption */}
              <div className="bg-rose-50/50 rounded-xl p-3 border border-dashed border-rose-100 flex items-center gap-2">
                <Hourglass className="w-4 h-4 text-rose-500 flex-shrink-0 animate-spin" style={{ animationDuration: "8s" }} />
                <p className="text-xs text-rose-800 font-sans italic mt-0.5 leading-tight">
                  "{config.specialMessage}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
