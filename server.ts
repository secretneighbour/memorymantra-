import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust proxy for ngrok / cloud run / mobile tunnels
  app.set("trust proxy", true);

  // Global CORS and ngrok header middleware
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning, bypass-tunnel-reminder"
    );
    // Auto-skip ngrok browser warning headers on all outgoing responses
    res.header("ngrok-skip-browser-warning", "true");
    
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: "10mb" }));

  // 1. Health check
  app.get("/api/health", (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY);
    res.json({
      status: "ok",
      hasApiKey: hasKey,
      model: "gemini-3.8-flash",
      time: new Date().toISOString(),
    });
  });

  // 2. AI Companion Endpoint
  app.post("/api/ai/companion", async (req, res) => {
    try {
      const {
        message,
        history = [],
        language = "en",
        patientContext = {},
        mode = "companion",
      } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required." });
      }

      const client = getGeminiClient();

      // Language naming guide
      const langNames: Record<string, string> = {
        en: "English",
        as: "Assamese (অসমীয়া)",
        bn: "Bengali (বাংলা)",
        hi: "Hindi (हिन्दी)",
        mni: "Meitei / Manipuri (মৈতৈলোন্)",
        bodo: "Bodo",
        kha: "Khasi",
      };
      const langLabel = langNames[language] || "English";

      // Patient background description
      const patientName = patientContext.name || "Minoti Devi";
      const patientLocation = patientContext.location || "Guwahati, Assam";
      const pendingReminders = Array.isArray(patientContext.reminders)
        ? patientContext.reminders.filter((r: any) => !r.completed)
        : [];
      const completedReminders = Array.isArray(patientContext.reminders)
        ? patientContext.reminders.filter((r: any) => r.completed)
        : [];

      // System instruction customized for elderly dementia & cognitive care in NER
      const systemInstruction = `You are "Smriti", an empathetic, gentle, reassuring AI Memory and Cognitive Companion designed specifically for elderly individuals living with mild cognitive impairment or dementia in North-Eastern India (Assam, Meghalaya, Manipur, etc.).

Patient Information:
- Name: ${patientName}
- Location: ${patientLocation}
- Primary Family Members: Daughter Priya, Son Rohan (caregiver), Granddaughter Ananya
- Next Caregiver Doctor: Dr. Debabrata Roy at Dispur Polyclinic
- Cultural Anchors: Brahmaputra river walks, Majuli heritage, Dr. Bhupen Hazarika classic folk melodies, warm Assam CTC tea, Bihu festivals, peaceful garden flowers.
- Today's Pending Schedule: ${
        pendingReminders.length > 0
          ? pendingReminders.map((r: any) => `"${r.title}" at ${r.time} (${r.doseOrNote || ""})`).join(", ")
          : "All scheduled items completed for today."
      }
- Completed Schedule: ${completedReminders.map((r: any) => `"${r.title}"`).join(", ") || "None yet"}

Crucial Guidelines:
1. Tone: Extremely warm, respectful, calming, patient, and joyful. Never make the patient feel tested, rushed, or anxious.
2. Structure: Keep responses concise (2 to 4 sentences maximum) so it is easy to read aloud and remember.
3. Language: Respond in ${langLabel}. If the user writes in English, reply in natural warm English. If the user writes or requests Assamese, Bengali, Hindi, or Meitei, respond in that language with culturally authentic warmth.
4. Dementia Care Principles:
   - Validate and reassure if they feel disoriented or worried.
   - Gently weave in positive anchors (e.g. family love, nice memories of Assam, soothing tea, music).
   - If they ask about medicine, appointments, or schedules, give clear and calm details.
   - Never use medical jargon or say "You have dementia" or "As an AI model".
   - Conclude with a supportive, affectionate sentence or gentle reminder.`;

      if (client) {
        // Build contents from previous turns + current query
        const formattedHistory = (history || [])
          .slice(-6)
          .map((item: { role: string; text: string }) => ({
            role: item.role === "assistant" || item.role === "model" ? "model" : "user",
            parts: [{ text: item.text }],
          }));

        const contents = [
          ...formattedHistory,
          {
            role: "user",
            parts: [{ text: message }],
          },
        ];

        // Multi-model fallback chain to protect against temporary 503 high demand surges
        const candidateModels = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
        let generatedReply: string | null = null;
        let successfulModel = "";

        for (const modelName of candidateModels) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
                topP: 0.9,
              },
            });

            if (response.text && response.text.trim().length > 0) {
              generatedReply = response.text.trim();
              successfulModel = modelName;
              break;
            }
          } catch (modelErr: any) {
            // Log briefly and continue to next model in fallback chain
            await new Promise((r) => setTimeout(r, 150));
          }
        }

        if (generatedReply) {
          return res.json({
            reply: generatedReply,
            provider: successfulModel,
            language: langLabel,
          });
        }
      }

      // Offline / Surge Fallback response if API key is not configured or all models are in high demand
      let fallbackText = "";
      const lower = message.toLowerCase();

      // Multilingual compassionate responses based on dialect
      if (language === 'as') {
        if (lower.includes("schedule") || lower.includes("plan") || lower.includes("afternoon") || lower.includes("আজি") || lower.includes("কাম")) {
          fallbackText = `নমস্কাৰ ${patientName}। আজি আবেলি ৪:০০ বজাত আপোনাৰ জীয়াৰী অনন্যা আহিব আৰু আপোনালোক দুয়ো মিলি ব্ৰহ্মপুত্ৰ শব্দ-খেল খেলিব। আপোনাৰ দিনটো খুব আনন্দময় হওক।`;
        } else if (lower.includes("song") || lower.includes("bihu") || lower.includes("গান") || lower.includes("বিহু") || lower.includes("ভূপেন")) {
          fallbackText = `সেইটো আছিল ড০ ভূপেন হাজৰিকাৰ এটি অতি সুমধুৰ গান, যিটো আপোনাৰ পুত্ৰ ৰোহনে আপোনাৰ স্মৃতি ভঁৰালত সংৰক্ষণ কৰিছে।`;
        } else if (lower.includes("doctor") || lower.includes("চিকিৎসক") || lower.includes("ডাঃ") || lower.includes("medicine") || lower.includes("ঔষধ")) {
          fallbackText = `আপোনাৰ ডাঃ দেৱব্ৰত ৰয়ৰ সৈতে পৰৱৰ্তী সাক্ষাৎ সোমবাৰে পুৱা ১১ বজাত দিছপুৰ পলিক্লিনিকত আছে, আৰু ৰোহন আপোনাৰ লগত থাকিব।`;
        } else {
          fallbackText = `মই আপোনাৰ ওচৰতেই আছোঁ ${patientName}। আপুনি সম্পূৰ্ণ সুৰক্ষিত আৰু আপোনাৰ পৰিয়ালৰ সকলোৱে আপোনাক বহুত মৰম কৰে। একাপ গৰম অসমীয়া চাহ খাই আৰাম কৰক।`;
        }
      } else if (language === 'bn') {
        if (lower.includes("schedule") || lower.includes("plan") || lower.includes("আজকে") || lower.includes("কাজ")) {
          fallbackText = `নমস্কার ${patientName}। আজকে বিকেলে আপনার মেয়ে অনন্যা আসছেন এবং আপনারা একসাথে সুন্দর সময় কাটাবেন। আপনার আজকের দিনটি খুব শান্তিময় হোক।`;
        } else if (lower.includes("song") || lower.includes("গান") || lower.includes("সুর")) {
          fallbackText = `সেটি ছিল ডঃ ভূপেন হাজারিকার একটি কালজয়ী মিষ্টি গান যা আপনার মেমোরি ভল্টে সংরক্ষিত রয়েছে।`;
        } else {
          fallbackText = `আমি আপনার কাছেই আছি ${patientName}। আপনি সবসময় নিরাপদ এবং সুস্থ আছেন। পরিবার ও প্রিয়জনরা সবসময় আপনার পাশে আছেন।`;
        }
      } else if (language === 'hi') {
        if (lower.includes("schedule") || lower.includes("plan") || lower.includes("आज") || lower.includes("दवा")) {
          fallbackText = `नमस्ते ${patientName} जी। आज दोपहर ४:०० बजे आपकी बेटी अनन्या आपसे मिलने आ रही हैं और आप दोनों साथ में चाय पिएंगे। आपकी सभी योजनाएं बिल्कुल व्यवस्थित हैं।`;
        } else {
          fallbackText = `मैं आपके साथ ही हूँ ${patientName} जी। आप पूरी तरह सुरक्षित हैं और आपका परिवार आपसे बहुत स्नेह करता है।`;
        }
      } else {
        // English fallback
        if (lower.includes("schedule") || lower.includes("today") || lower.includes("afternoon") || lower.includes("plan")) {
          if (pendingReminders.length > 0) {
            fallbackText = `This afternoon, you have "${pendingReminders[0].title}" scheduled at ${pendingReminders[0].time}. Your daughter Ananya is also looking forward to spending warm tea time with you.`;
          } else {
            fallbackText = `You have completed all your planned activities today, ${patientName}! You can relax and enjoy a soothing cup of warm Assam tea.`;
          }
        } else if (lower.includes("song") || lower.includes("bihu") || lower.includes("bhupen") || lower.includes("music")) {
          fallbackText = `That was Dr. Bhupen Hazarika's beautiful Brahmaputra folk melody that your son uploaded to your Heritage Vault. It always brings such warm memories.`;
        } else if (lower.includes("doctor") || lower.includes("appointment") || lower.includes("dr")) {
          fallbackText = `Your next appointment is with Dr. Debabrata Roy on Monday at 11:00 AM at Dispur Polyclinic, and Rohan will accompany you.`;
        } else if (lower.includes("medicine") || lower.includes("dawa") || lower.includes("tablet") || lower.includes("blood pressure")) {
          fallbackText = `Your morning routine medicine is marked as taken. Your next routine reminder is with your wholesome lunch. Everything is right on track.`;
        } else if (lower.includes("tea") || lower.includes("assam") || lower.includes("garden")) {
          fallbackText = `Assam tea gardens in winter are always so green and peaceful under the morning mist. Fresh tea with your family is one of your fondest joys.`;
        } else if (lower.includes("priya") || lower.includes("daughter") || lower.includes("call")) {
          fallbackText = `Your daughter Priya is calling you at 6:00 PM today for your regular warm family catch-up.`;
        } else {
          fallbackText = `I am right here with you, ${patientName}. Everything is peaceful and safe today. Remember, your loved ones are right beside you and you are doing splendidly.`;
        }
      }

      return res.json({
        reply: fallbackText,
        provider: "offline-reassurance",
        language: langLabel,
      });
    } catch (err: any) {
      console.warn("AI Companion endpoint handled with fallback:", err?.message || err);
      return res.json({
        reply: "I am right here with you. Everything is calm, safe, and peaceful today. Your family is right beside you.",
        provider: "safety-reassurance",
        language: "English",
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        cors: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
