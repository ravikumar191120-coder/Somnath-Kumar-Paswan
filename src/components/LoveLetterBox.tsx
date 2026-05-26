import { useState, useEffect } from "react";
import { MailOpen, Send, Sparkles, RefreshCw, Heart, User, Check, Edit2 } from "lucide-react";
import { motion } from "motion/react";
import { LoveNoteConfig } from "../types";

interface LoveLetterBoxProps {
  onAddRose: () => void;
}

export default function LoveLetterBox({ onAddRose }: LoveLetterBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [letterText, setLetterText] = useState("");
  const [isEditingNames, setIsEditingNames] = useState(false);
  
  const [config, setConfig] = useState<LoveNoteConfig>(() => {
    const saved = localStorage.getItem("subha_love_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // use default
      }
    }
    return {
      mood: "Cozy & Sweet",
      recipientName: "Boki",
      senderName: "Aapka Bacha"
    };
  });

  const moods = [
    { name: "Cozy & Sweet", label: "Cozy & Sweet ✨", hindi: "Cute Morning 🧸" },
    { name: "Highly Romantic", label: "Highly Romantic 💖", hindi: "Dil Se Love 😘" },
    { name: "Poetic / Shayari", label: "Poetic / Shayari 🌹", hindi: "Flirty Lines 💫" },
    { name: "Funny & Cute", label: "Funny & Cute 😜", hindi: "Pagli Shararat 🤪" }
  ];

  useEffect(() => {
    localStorage.setItem("subha_love_config", JSON.stringify(config));
  }, [config]);

  // Load first fallback note on mount
  useEffect(() => {
    // Initial letter trigger matching Cozy / default
    const preWritten = `Good Morning Meri Pyaari Cutiee ${config.recipientName} 🥰,\n\nUthiye bacha, dekhiye dhoop nikal aayi hai aur bol rhi hai ki sleepy head boki ko ab uth jana chahiye! Aap so kar uthi hongi toh bohot hi pyaari lag rhi hongi, bilkul ek soft teddy bear jaisi. 🧸\n\nSuno na pagli, aap mere liye sabse unmol ho. Aapka khud ka bohot dhyan rakhna mere liye sabse zaroori hai. Aaj bilkul tension mat lena, main hamesha aapke sath khada hoon aur aapko dher saari virtual puppies 🐶 aur forehead kisses bhej rha hoon.\n\nHappy Morning, baby! Have a wonderful and cozy day!\n\nSadaa aapka hi banke,\n${config.senderName} ❤️`;
    setLetterText(preWritten);
  }, []);

  const generateNewLetter = async (selectedMood = config.mood) => {
    setLoading(true);
    setIsOpen(true);
    try {
      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: selectedMood,
          recipientName: config.recipientName,
          senderName: config.senderName
        })
      });

      const data = await response.json();
      if (data.text) {
        setLetterText(data.text);
      }
      onAddRose(); // Spark a virtual flower reward overlay when they generate of read a letter!
    } catch (err) {
      console.error("Failed to generate love letter:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentMoodIndex = moods.findIndex(m => m.name === config.mood);

  return (
    <div className="w-full max-w-2xl mx-auto my-6" id="love-letter-module">
      {/* Configuration Header for customizing Girlfriend Name and Senders Name */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-sm border border-rose-100/50 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:bg-white/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-rose-50 text-rose-500">
            <Heart className="w-5 h-5 fill-rose-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-rose-950 text-sm">
              Greeting Customizer (Aapka Pyaar)
            </h3>
            <p className="text-xs text-rose-700/80 font-sans mt-0.5">
              Apni gf ka naam aur apna signature set krein:
            </p>
          </div>
        </div>

        {isEditingNames ? (
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1.5 bg-rose-50/50 px-2 py-1 rounded-lg border border-rose-100">
              <span className="text-[10px] text-rose-600 font-medium">Babu:</span>
              <input
                type="text"
                value={config.recipientName}
                onChange={(e) => setConfig({ ...config, recipientName: e.target.value })}
                className="bg-transparent text-xs text-rose-950 font-medium focus:outline-none w-20 px-1 border-b border-rose-200"
                placeholder="GF Name"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-rose-50/50 px-2 py-1 rounded-lg border border-rose-100">
              <span className="text-[10px] text-rose-600 font-medium">Aap:</span>
              <input
                type="text"
                value={config.senderName}
                onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                className="bg-transparent text-xs text-rose-950 font-medium focus:outline-none w-24 px-1 border-b border-rose-200"
                placeholder="Your Name"
              />
            </div>
            <button
              onClick={() => {
                setIsEditingNames(false);
                generateNewLetter();
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg p-1.5 transition-all cursor-pointer shadow-xs"
              title="Save Names"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="font-medium text-rose-950">
                To: <span className="text-rose-600 font-semibold">{config.recipientName}</span>
              </div>
              <div className="text-rose-700 font-normal">
                From: <span className="text-rose-600 font-semibold">{config.senderName}</span>
              </div>
            </div>
            <button
              onClick={() => setIsEditingNames(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg p-2 transition-all cursor-pointer"
              title="Edit Names"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Interactive Physical Envelope View */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16:10] max-w-xl mx-auto flex items-center justify-center p-4">
        {/* Shadow floor */}
        <div className="absolute bottom-2 left-6 right-6 h-5 bg-rose-950/5 blur-xl rounded-full" />

        {/* Outer Box */}
        <div className="relative w-full h-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-rose-100 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100">
          
          {/* Closed Envelope view */}
          {!isOpen && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-rose-100 to-rose-200 flex flex-col items-center justify-center cursor-pointer p-6 z-[10] text-center"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Back side line flaps */}
              <div className="absolute inset-0 border-[6px] border-dashed border-white/40 rounded-2xl m-4" />
              
              {/* Wax Seal / Heart Button */}
              <motion.div 
                className="relative w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white cursor-pointer z-20"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                <Heart className="w-10 h-10 text-white fill-white" />
              </motion.div>

              <div className="mt-4 z-10">
                <h4 className="font-sans font-bold text-rose-950 text-base">To: Sweetest {config.recipientName} 🌸</h4>
                <p className="font-mono text-[10px] text-rose-800 uppercase tracking-widest mt-1 bg-white/40 py-1 px-2.5 rounded-full inline-block">
                  Aapke liye ek super sweet love letter hai
                </p>
                <div className="text-xs text-rose-600 font-sans mt-3 animate-bounce">
                  Tap to Open the Letter 💌
                </div>
              </div>
            </motion.div>
          )}

          {/* Opened Letter Paper Content */}
          <div className="w-full h-full bg-amber-50/70 p-5 md:p-7 overflow-y-auto flex flex-col font-sans relative">
            {/* Top decorative binder */}
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-rose-100/40 to-transparent" />
            <div className="absolute left-4 top-0 bottom-0 w-px bg-rose-200 border-dashed border-l" />

            <div className="pl-6 flex-1 flex flex-col justify-between">
              {/* Note Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rose-100/50">
                <span className="font-mono text-[10px] uppercase tracking-widest text-rose-800 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">
                  My Cute Note ({config.mood})
                </span>
                <span className="text-rose-500 cursor-pointer text-xs font-semibold" onClick={() => setIsOpen(false)}>
                  Close Letter 📂
                </span>
              </div>

              {/* Typed Love Text */}
              <div className="my-4 text-xs md:text-sm text-rose-950 font-medium leading-relaxed whitespace-pre-wrap flex-1 select-none font-sans italic hover:text-rose-900 transition-colors">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      className="text-rose-500"
                    >
                      <RefreshCw className="w-8 h-8" />
                    </motion.div>
                    <p className="text-xs text-rose-600 tracking-wide font-medium animate-pulse">
                      Boki ke liye super sweet flirty shayari likhi jaa rhi hai... ❤️
                    </p>
                  </div>
                ) : (
                  letterText
                )}
              </div>

              {/* Envelope Signature */}
              {!loading && (
                <div className="text-right border-t border-rose-100/50 pt-2 text-xs text-rose-700 font-sans">
                  Sadaa aapke sath, <span className="font-semibold text-rose-500">{config.senderName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gemini Live Generator control panel */}
      <div className="mt-6 bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-rose-100/50 shadow-sm">
        <h4 className="text-sm font-semibold text-rose-950 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>Dil Se Letter Generator (AI Love Pen)</span>
        </h4>
        <p className="text-xs text-rose-800 mb-4 leading-relaxed">
          Yeh system humare **Gemini AI** se seedhe connected hai. Har baar ek nayi, flirty aur super cute feeling likhi jayegi! Aap isme se apne mood ka vishay chuniye aur bacha ki smile dekte rahiye.
        </p>

        {/* Mood select pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {moods.map((m) => (
            <button
              key={m.name}
              onClick={() => {
                setConfig({ ...config, mood: m.name });
                generateNewLetter(m.name);
              }}
              disabled={loading}
              className={`p-2.5 rounded-xl text-center text-xs font-semibold cursor-pointer transition-all border outline-none ${
                config.mood === m.name
                  ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                  : "bg-white/90 text-rose-800 border-rose-100/50 hover:bg-rose-50"
              }`}
            >
              <div>{m.label.split(" ")[0] || m.label}</div>
              <div className={`text-[9px] mt-0.5 opacity-80 ${config.mood === m.name ? "text-rose-100" : "text-rose-600"}`}>
                {m.hindi}
              </div>
            </button>
          ))}
        </div>

        {/* Generate Button helper */}
        <button
          onClick={() => generateNewLetter()}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-semibold transition-all shadow-sm active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Pyaara Letter Likh Rahe Hain... ✨</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Aapke Liye Ek Naya Cute Letter Likhhein ✍️</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
