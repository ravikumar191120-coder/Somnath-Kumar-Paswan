import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Need json parsing for custom post bodies
app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (err) {
  console.error("Failed to initialize GoogleGenAI:", err);
}

// Romantic Message Generator endpoint
app.post("/api/gemini/generate", async (req, res) => {
  try {
    const { mood, recipientName = "Boki", senderName = "Aapka Bacha" } = req.body;

    if (!ai) {
      // Return a heartfelt pre-written note as elegant fallback if API key is not present
      const preWritten = getFallbackNote(mood, recipientName, senderName);
      return res.json({ text: preWritten, isFallback: true });
    }

    let dynamicPrompt = `Apni pyaari, super sweet Gen-Z gf ${recipientName} (jinhe pyaar se Babu, Boki, Bacha, ya Cutiee bolte hain) ko Good Morning wish krte hue ek bahut hi pyaara flirty, cute, aur ultra sweet love letter ya note likhein.
Tone and Mood filter: ${mood || "Cozy & Sweet"}.
Kuch guidelines strictly follow krein:
1. Unhe hamesha 'Aap' krke hi bulana hai (Jaise: 'Aap so rhi hain?', 'Aapki mithi baatein'). Kabhi bhi sasti 'tum' ya 'tu' ka use na krein because we respect her totally. But maintain a super caring, playful, playful-flirty tone!
2. Roman Hindi (Hinglish like how Gen-Z chats on WhatsApp/Insta) me likhein, jo padhne me bahut hi sweet ho, bilkul cringe-free but cute ho!
3. Dhyan rahe, she is 20, so write things like 'Aap mere dimaag me 24/7 rent-free rehti hain', 'Aapki smile se mera din start hota hai', 'Boki, aap kitni pyaari ho pagli!', 'Aapka bacha aapko miss kr rha hai'.
4. Pyare, light-hearted, cute flirty shayari ya lyrics type expressions add krein.
5. End me '${senderName}' (default: Aapka Bacha) ki taraf se lots of kisses aur hug sign-off likhein.`;

    const systemInstruction = 
      "You are a deeply caring, deeply in-love, and playful-flirty boyfriend writing super sweet morning notes in Roman Hindi (Hinglish) to his beloved Gen-Z girlfriend. Always use 'Aap' with extreme warmth and respect, but mix it with modern cute slang (like rent-free, 24/7, cutiee, baby, boki, bacha). Never use 'tum' or 'tu'. Be poetic, flirty, and make her smile instantly.";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: dynamicPrompt,
      config: {
        systemInstruction,
        temperature: 0.95,
      },
    });

    const generatedText = response.text || getFallbackNote(mood, recipientName, senderName);
    res.json({ text: generatedText, isFallback: false });
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    res.status(500).json({ 
      error: "Oye, network me thoda romance gap aa gaya, par aapke bache ka love note ready hai!",
      text: getFallbackNote(req.body.mood || "Cozy & Sweet", req.body.recipientName || "Boki/Babu", req.body.senderName || "Aapka Bacha"),
      isFallback: true 
    });
  }
});

// A lovely local helper to ensure the user ALWAYS gets outstanding romantic results even with missing keys
function getFallbackNote(mood: string, recipient: string, sender: string): string {
  const notes: Record<string, string> = {
    "Highly Romantic": `Hey my absolute Cutiee ${recipient} ❤️,\n\nGood morning, baby! Aaj neend se uthte hi sabse pehle aapka khayal dimaag me 24/7 rent-free ghumne laga. Aap sach me mere life ki sabse pyaari insaan ho. Jab aap hansti ho na, toh pure universe me sabse sweet aur cute bells jaisa dynamic music lagta hai. 🔔✨\n\nAapki bholi surat aur mithi baatein mera poora din instantly 100x zoom-happy bana deti hain bacha. Main hamesha chahta hoon ki aap isi tarah pyaari muskaan ke sath eye open kijiye aur pure din full-active rahiye. Aapka bacha aapko infinite levels se bhi jyada pyaar karta hai!\n\n"Aapki aankhon me kho jane ka dil karta hai,\nApni pyari Pagli ke sare sweet nakhre uthane ka dil karta hai!" 😘\n\nOnly yours, 🧸\n${sender} 🐼💞`,
    
    "Poetic / Shayari": `My Beautiful Lehli ${recipient} ke naam ek pyaari si subha 🌺,\n\nGood morning baby! Aaj subha ki thandi hawa bilkul aapki voice ki tarah soft, sweet aur soothing lag rhi hai. \n\n"Aapki ek smile par hum apna dil vaar baithe,\nAapki cute shararaton se hum naye sire se pyaar kar baithe!" 🌟\n\nCutiee, aapka mere life me hona hi mere liye rab ka sabse unmol gift hai. Jab aap gusse me mere upar cartoon jaisa face banati hain na, toh dil karta hai ki aapko tightly hug karke cheek pull kar loon! 🧸 Aaj ke din bohot saara tasty khana khana aur bilkul bhi tension mat lena, okay? Your bacha is always here!\n\nLove you loading 3000%...\n\n${sender} ✨`,
    
    "Cozy & Sweet": `Good Morning Meri Pyaari Cutiee ${recipient} 🥰,\n\nUthiye bacha, dekhiye pyaari dhoop nikal aayi hai aur bol rhi hai ki sleepy head Pagli ko ab sweet sa yawn lekar uth jana chahiye! Aap jab so kar uthti ho toh kitni adorable lagti ho, bilkul ek soft teddy bear jaisi. 🧸🍭\n\nSuno na pagli, aap mere liye sabse unmol ho. Aapka khud ka bohot dhyan rakhna mere liye sabse zaroori hai. Aaj bilkul dimag par stress mat lena, main hamesha aapke sath khada hoon aur aapko dher saari virtual puppies 🐶 aur soft forehead kisses bhej rha hoon.\n\nHappy Morning, baby! Have a wonderful, cozy and happy day!\n\nOnly yours, 🧸\n${sender} 🐼💞`,
    
    "Funny & Cute": `Arey o soti hui Pagli ${recipient}! Active mode on kijiye 😂,\n\nGood morning baby! Aasha hai aapne raat me mere pyaare khwab dekhe honge (aur agar nahi dekhe toh chaliye jaldi se sorry boliyega mujhe call par on-the-spot!). 😜\n\nUthne ka time ho gaya hai, my sleepy-head baby! Pata hai aap bohooot cute lagti ho sote-sote frown karte hue, par aapka mujhse dher saari baatein karna aur sweet nakhre dikhana hi mujhe sabse jyada pasand hai. Suno pagli, aaj college/work me jyada load mat lena, aur time par lunch kar lena.\n\nAapko bohot saara virtual hugging aur forehead kisses! 😘\n\nOnly yours, 🧸\n${sender} 🐼💞`
  };

  return notes[mood] || notes["Cozy & Sweet"];
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", keyAvailable: !!process.env.GEMINI_API_KEY });
});

// Configure Vite or Static Serve
async function serveApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Using Vite Development Middleware Mode");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static client production assets from", distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pyaar Bhari Subha server running on http://0.0.0.0:${PORT}`);
  });
}

serveApp();
