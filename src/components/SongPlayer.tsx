import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, HelpCircle, Radio } from "lucide-react";
import { motion } from "motion/react";
import { RomanticTrack } from "../types";
import { romanticSynth } from "../utils/audioSynth";

export default function SongPlayer() {
  const [playlist] = useState<RomanticTrack[]>([
    {
      id: "chime-box",
      name: "Boki's Sweet Lullaby (Cute Music Box Synth) 🧸💖",
      artist: "Handcrafted with absolute love by Aapka Bacha",
      url: "synth", // uses Web Audio
      duration: "Infinite",
      isSynth: true,
      color: "from-rose-500 to-pink-500"
    },
    {
      id: "guitar-romance",
      name: "Pehla Nasha (Acoustic Guitar Cover) 🎸✨",
      artist: "Chords of sweetness for my lovely Cutiee",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // stable sound Helix sample
      duration: "6:12",
      isSynth: false,
      color: "from-amber-400 to-orange-500"
    },
    {
      id: "piano-romance",
      name: "Tum Se Hi (Boki's Special Piano Cover) 🎹💕",
      artist: "Soft romance instrumental for my sweet Pagli",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: "5:44",
      isSynth: false,
      color: "from-purple-500 to-indigo-500"
    }
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(372); // Seconds (approx for audio sample)
  const [recentNotePlayed, setRecentNotePlayed] = useState("");
  const [sparkles, setSparkles] = useState<Array<{ id: number; left: string; size: string; color: string }>>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentTrack = playlist[currentTrackIndex];

  // Sync state with DOM Audio Element
  useEffect(() => {
    // Stop synthe if playing and track changed or unmounted
    romanticSynth.stop();

    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (currentTrack.isSynth) {
      setTrackDuration(999); // infinite progress
      setCurrentTime(120);   // decorative center
    } else {
      // Create HTML audio safely
      const audioObj = new Audio(currentTrack.url);
      audioObj.volume = isMuted ? 0 : volume;
      audioRef.current = audioObj;

      // Event listeners
      audioObj.addEventListener("timeupdate", () => {
        setCurrentTime(audioObj.currentTime);
      });
      audioObj.addEventListener("loadedmetadata", () => {
        setTrackDuration(audioObj.duration || 372);
      });
      audioObj.addEventListener("ended", () => {
        handleNext();
      });
    }

    return () => {
      romanticSynth.stop();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentTrackIndex]);

  // Sync volume with players
  useEffect(() => {
    const val = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    romanticSynth.setVolume(val);
  }, [volume, isMuted]);

  // Handle Play/Pause
  const handlePlayPause = () => {
    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);

    if (currentTrack.isSynth) {
      if (nextPlayState) {
        romanticSynth.start((freq, label) => {
          setRecentNotePlayed(label);
          // Spark physical notes visual ripple
          const newSparkle = {
            id: Date.now() + Math.random(),
            left: `${15 + Math.random() * 70}%`,
            size: `${20 + Math.random() * 30}px`,
            color: ["#f43f5e", "#fb7185", "#fba5b9", "#f59e0b", "#fbcfe8"][Math.floor(Math.random() * 5)]
          };
          setSparkles((prev) => [newSparkle, ...prev.slice(0, 15)]);
        });
      } else {
        romanticSynth.stop();
      }
    } else {
      if (audioRef.current) {
        if (nextPlayState) {
          audioRef.current.play().catch((err) => {
            console.warn("Autoplay / audio stream blocked, using synth fallback as beautiful alternative:", err);
            // fallback gracefully to our beautiful romantic music box!
            setCurrentTrackIndex(0);
          });
        } else {
          audioRef.current.pause();
        }
      }
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const formatTime = (secs: number) => {
    if (currentTrack.isSynth) return "∞";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Canvas visualizer logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Array<{ x: number; y: number; r: number; color: string; speedY: number }> = [];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 35;
      const spacing = canvas.width / barCount;

      // Draw aesthetic music bars based on play state
      for (let i = 0; i < barCount; i++) {
        let height = 8;
        if (isPlaying) {
          // Dynamic calculated frequency-like waves
          const time = Date.now() * 0.003;
          height = 10 + Math.sin(i * 0.35 + time) * 22 + Math.cos(i * 0.15 + time * 1.5) * 12;
          height = Math.max(6, height);
        }

        // Draw double side visualizer
        const grd = ctx.createLinearGradient(0, canvas.height / 2 - height, 0, canvas.height / 2 + height);
        grd.addColorStop(0, "rgba(244, 63, 94, 0.7)"); // rose primary
        grd.addColorStop(0.5, "rgba(236, 72, 153, 0.3)"); // center pink
        grd.addColorStop(1, "rgba(244, 63, 94, 0.7)");

        ctx.fillStyle = grd;
        ctx.fillRect(i * spacing, canvas.height / 2 - height / 2, spacing - 2, height);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="w-full max-w-xl mx-auto my-6" id="romantic-music-player">
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-rose-100/50 shadow-sm relative overflow-hidden">
        
        {/* Audio Visualizer strip */}
        <div className="w-full h-18 bg-rose-50/50 rounded-xl overflow-hidden mb-4 border border-rose-100/40 relative">
          <canvas ref={canvasRef} className="w-full h-full" width={380} height={72} />
          
          {/* Recent Chime Note indication banner */}
          {currentTrack.isSynth && isPlaying && recentNotePlayed && (
            <div className="absolute inset-x-2 bottom-1 flex items-center justify-center">
              <span className="text-[10px] bg-rose-500 text-white font-mono uppercase tracking-widest px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                🎶 Chime Note: {recentNotePlayed}
              </span>
            </div>
          )}

          {/* Floating visual music bubbles */}
          {sparkles.map((star) => (
            <motion.div
              key={star.id}
              initial={{ y: 55, opacity: 0.95, scale: 0.2 }}
              animate={{ y: -15, opacity: 0, scale: 1.5 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              className="absolute pointer-events-none rounded-full flex items-center justify-center text-xs"
              style={{ left: star.left, color: star.color, width: star.size, height: star.size }}
            >
              ❤️
            </motion.div>
          ))}
        </div>

        {/* Info panel */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Music className={`w-7 h-7 ${isPlaying ? "animate-bounce" : ""}`} />
            </div>
            {currentTrack.isSynth && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 animate-pulse">
                <Radio className="w-2.5 h-2.5" />
                <span>Synth</span>
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-sans font-bold text-rose-950 text-sm truncate">
              {currentTrack.name}
            </h4>
            <p className="text-xs text-rose-700 font-sans truncate mt-0.5">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Seekbar and timers */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[10px] text-rose-800 font-mono font-medium mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(trackDuration)}</span>
          </div>
          {/* Progress bar timeline */}
          <div className="w-full bg-rose-100/50 rounded-full h-1 relative overflow-hidden">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all" 
              style={{ width: `${(currentTime / trackDuration) * 100}%` }}
            />
          </div>
        </div>

        {/* Music Buttons strip */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 transition-all cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-14 h-1 bg-rose-200 rounded-full appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-100 text-rose-700 transition-all cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-rose-50/50 hover:bg-rose-100 text-rose-700 transition-all cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Helper Synth Explanation Banner */}
        {currentTrack.isSynth && (
          <div className="mt-4 bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-800 font-sans italic leading-relaxed flex gap-1.5 animate-pulse">
            <span className="text-amber-500 text-base leading-none">🧸</span>
            <span>
              <strong>Cute Chime Box:</strong> Yeh chimes aapke bache ke digital love frequencies par continuously run hote hain. Agar net block ya slow bhi ho jaye na, tab bhi boki ki smile ki tarah non-stop aur flawlessly bajega! 🥰
            </span>
          </div>
        )}
      </div>

      {/* Mini playlist track selection list */}
      <div className="mt-3 bg-white/40 backdrop-blur-md rounded-xl p-3 border border-rose-100/30 flex flex-col gap-2">
        <span className="text-[10px] text-rose-900 font-semibold uppercase tracking-wider px-1">Selecet babu ki favorite list 🎶:</span>
        <div className="flex flex-col gap-1">
          {playlist.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(false);
              }}
              className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between pointer-events-auto transition-all cursor-pointer ${
                currentTrackIndex === idx ? "bg-rose-100 text-rose-950 font-bold" : "hover:bg-rose-50 text-rose-800"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="truncate">{track.name}</span>
              </div>
              <span className="font-mono text-[10px] pl-2 text-rose-700/80">{track.duration}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
