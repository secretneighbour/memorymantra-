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

        const response = await client.models.generateContent({
          model: "gemini-3.8-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const replyText = response.text || `I am right here with you, ${patientName}. You are doing wonderful today.`;
        return res.json({
          reply: replyText,
          provider: "gemini-3.8-flash",
          language: langLabel,
        });
      }

      // Offline / Fallback response if API key is not configured
      let fallbackText = `I am right here with you, ${patientName}. `;
      const lower = message.toLowerCase();

      if (lower.includes("schedule") || lower.includes("today") || lower.includes("afternoon") || lower.includes("plan")) {
        if (pendingReminders.length > 0) {
          fallbackText += `This afternoon, you have "${pendingReminders[0].title}" scheduled at ${pendingReminders[0].time}. Your daughter Ananya is also looking forward to spending tea time with you.`;
        } else {
          fallbackText += `You have completed all your planned activities today! You can relax with a warm cup of Assam tea.`;
        }
      } else if (lower.includes("song") || lower.includes("bihu") || lower.includes("bhupen") || lower.includes("music")) {
        fallbackText += `That was Dr. Bhupen Hazarika's beautiful Brahmaputra melody that your son uploaded to your Heritage Vault. It always brings such peaceful memories.`;
      } else if (lower.includes("doctor") || lower.includes("appointment") || lower.includes("dr")) {
        fallbackText += `Your next appointment is with Dr. Debabrata Roy on Monday at 11:00 AM at Dispur Polyclinic, and Rohan will accompany you.`;
      } else if (lower.includes("medicine") || lower.includes("dawa") || lower.includes("tablet")) {
        fallbackText += `Your morning blood pressure medicine is marked as taken. Your next routine reminder is at 1:00 PM with your wholesome lunch.`;
      } else {
        fallbackText += `Everything is peaceful and safe today. Remember, your loved ones are right beside you and you are doing splendidly.`;
      }

      return res.json({
        reply: fallbackText,
        provider: "local-rule-engine",
        language: langLabel,
      });
    } catch (err: any) {
      console.error("AI Companion error:", err);
      return res.status(500).json({
        error: "Failed to generate AI response",
        details: err?.message || String(err),
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
