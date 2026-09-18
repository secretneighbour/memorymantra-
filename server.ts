import express from "express";
import path from "path";
import fs from "fs";
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
      const patientStage = patientContext.stage || "Mild Cognitive Support";
      const pendingReminders = Array.isArray(patientContext.reminders)
        ? patientContext.reminders.filter((r: any) => !r.completed)
        : [];
      const completedReminders = Array.isArray(patientContext.reminders)
        ? patientContext.reminders.filter((r: any) => r.completed)
        : [];
      
      const pinnedMemories = Array.isArray(patientContext.pinnedMemories)
        ? patientContext.pinnedMemories
        : [];
      const memoryNotes = Array.isArray(patientContext.memoryNotes)
        ? patientContext.memoryNotes
        : [];
      const wellbeingNote = patientContext.wellbeing || "Feeling calm and peaceful";

      const pendingRemindersText = pendingReminders.length > 0
        ? pendingReminders.map((r: any) => `"${r.title}" at ${r.time} (${r.doseOrNote || "scheduled"})`).join(", ")
        : "All scheduled items completed for today.";
      const completedRemindersText = completedReminders.length > 0
        ? completedReminders.map((r: any) => `"${r.title}"`).join(", ")
        : "None completed yet today.";

      const pinnedText = pinnedMemories.length > 0
        ? pinnedMemories.map((p: any) => `${p.tag || "Note"}: "${p.text}"`).join("; ")
        : "Family celebration dates, doctor appointment on Monday 11:00 AM with Dr. Debabrata Roy.";

      const notesText = memoryNotes.length > 0
        ? memoryNotes.map((n: any) => `${n.title}: "${n.content}"`).join("; ")
        : "Loves Bhupen Hazarika classic folk songs, Brahmaputra river walks, Assam garden chai.";

      // Mode-specific focus
      let modeDirective = "";
      if (mode === "memory_recall") {
        modeDirective = "Special Mode: Reminiscence & Heritage Recall. Prompt the user gently with nostalgic themes of Assam / North-East (e.g. Majuli island crafts, Dr. Bhupen Hazarika's songs, family festivals like Rongali Bihu, tea garden mornings, Shillong hills).";
      } else if (mode === "calm") {
        modeDirective = "Special Mode: Calm & Grounding. Provide soothing, relaxing reassurance. Guide the user through a gentle 3-step deep breathing rhythm (e.g. 'Inhale the crisp morning air, hold gently, and exhale with ease').";
      } else if (mode === "routine") {
        modeDirective = "Special Mode: Daily Schedule & Wellness Orientation. Focus on clarifying upcoming medicines, hydration, meals, and family calls clearly, simply, and reassuringly.";
      }

      // System instruction customized for elderly dementia & cognitive care in NER
      const systemInstruction = `You are "Smriti" (স্মৃতি), an empathetic, gentle, reassuring AI Memory and Cognitive Companion designed specifically for elderly individuals living with mild cognitive impairment or dementia in North-Eastern India (Assam, Meghalaya, Manipur, etc.).

Patient Profile:
- Name: ${patientName}
- Cognitive Care Level: ${patientStage}
- Location: ${patientLocation}
- Primary Family Members: Daughter Priya, Son Rohan (primary caregiver), Granddaughter Ananya
- Primary Doctor: Dr. Debabrata Roy at Dispur Polyclinic
- Cultural Anchors: Brahmaputra river walks, Majuli heritage, Dr. Bhupen Hazarika classic folk melodies, warm Assam CTC ginger-cardamom tea, Rongali Bihu, orchid gardens.
- Today's Pending Schedule: ${pendingRemindersText}
- Completed Schedule: ${completedRemindersText}
- Pinned Anchors: ${pinnedText}
- Personal Memory Notes: ${notesText}
- Recent Wellbeing State: ${wellbeingNote}
${modeDirective ? `\nActive Focus: ${modeDirective}` : ""}

Crucial Elderly & Dementia Care Guidelines:
1. Tone: Warm, deeply respectful, calming, patient, and joyful. Never make the patient feel tested, quizzed, rushed, or anxious.
2. Structure: Keep conversational responses concise (2 to 4 sentences maximum) so it is effortless to read aloud and remember.
3. Language: Respond naturally in ${langLabel}. If English, use warm, respectful tone. If Assamese, Bengali, or Hindi, use authentic regional idioms and respect markers (e.g., Baideo/Aai/Khura/Ji).
4. Validation Therapy Principles:
   - Validate and reassure if they feel disoriented, confused, or worried.
   - Gently weave in positive anchors (family love, soothing memories of Assam, warm tea).
   - If they ask about medicine, appointments, or schedules, give clear, grounded facts.
   - Never use medical jargon or say "You have dementia" or "As an AI language model".
   - Suggest 2 to 3 short, intuitive follow-up replies that the user can tap with a single touch.

JSON Output Schema:
{
  "reply": "Empathetic, clear, and comforting response in ${langLabel}",
  "actionRoute": "/memory" | "/reminders" | "/memories" | "/games/memory" | "/family" | null,
  "actionLabel": "Action button label if relevant (e.g., 'View Today\\'s Timeline') or null",
  "suggestedReplies": ["Short suggestion 1", "Short suggestion 2", "Short suggestion 3"]
}`;

      if (client) {
        // Build contents from previous turns + current query
        const formattedHistory = (history || [])
          .slice(-8)
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

        // Multi-model fallback chain to protect against temporary surges
        const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
        let generatedReply: string | null = null;
        let actionRoute: string | undefined;
        let actionLabel: string | undefined;
        let suggestedReplies: string[] = [];
        let successfulModel = "";

        for (const modelName of candidateModels) {
          try {
            const response = await client.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.6,
                topP: 0.9,
              },
            });

            if (response.text && response.text.trim().length > 0) {
              try {
                const parsed = JSON.parse(response.text.trim());
                generatedReply = parsed.reply || response.text.trim();
                actionRoute = parsed.actionRoute || undefined;
                actionLabel = parsed.actionLabel || undefined;
                if (Array.isArray(parsed.suggestedReplies)) {
                  suggestedReplies = parsed.suggestedReplies.slice(0, 3);
                }
              } catch {
                generatedReply = response.text.trim();
              }
              successfulModel = modelName;
              break;
            }
          } catch (modelErr: any) {
            // Brief pause before trying fallback model
            await new Promise((r) => setTimeout(r, 150));
          }
        }

        if (generatedReply) {
          const lowerQ = message.toLowerCase();
          if (!actionRoute) {
            if (lowerQ.includes("schedule") || lowerQ.includes("timeline") || lowerQ.includes("plan")) {
              actionRoute = "/memory";
              actionLabel = "View Today's Timeline";
            } else if (lowerQ.includes("appointment") || lowerQ.includes("doctor") || lowerQ.includes("medicine")) {
              actionRoute = "/reminders";
              actionLabel = "Open Daily Reminders";
            } else if (lowerQ.includes("song") || lowerQ.includes("music") || lowerQ.includes("photo") || lowerQ.includes("memory") || lowerQ.includes("bihu")) {
              actionRoute = "/memories";
              actionLabel = "Open Heritage Vault";
            } else if (lowerQ.includes("game") || lowerQ.includes("play") || lowerQ.includes("exercise") || lowerQ.includes("quiz")) {
              actionRoute = "/games/memory";
              actionLabel = "Play Memory Match";
            } else if (lowerQ.includes("family") || lowerQ.includes("priya") || lowerQ.includes("rohan") || lowerQ.includes("call")) {
              actionRoute = "/family";
              actionLabel = "Open Family Circle";
            }
          }

          if (suggestedReplies.length === 0) {
            if (mode === 'memory_recall') {
              suggestedReplies = ["Tell me more about Majuli", "Play Dr. Bhupen's song", "Who is coming to visit?"];
            } else if (mode === 'calm') {
              suggestedReplies = ["Take another deep breath", "Tell me about morning tea", "What time is it now?"];
            } else if (mode === 'routine') {
              suggestedReplies = ["What is my next medicine?", "When is lunch?", "Did I finish my walk?"];
            } else {
              suggestedReplies = ["What is my next reminder?", "Tell me a soothing story", "When is family calling?"];
            }
          }

          return res.json({
            reply: generatedReply,
            provider: successfulModel,
            language: langLabel,
            actionRoute,
            actionLabel,
            suggestedReplies,
          });
        }
      }

      // Offline / Surge Fallback response if API key is not configured or models are temporarily unreachable
      let fallbackText = "";
      let fallbackRoute: string | undefined;
      let fallbackLabel: string | undefined;
      const lower = message.toLowerCase();

      // Multilingual compassionate responses based on dialect
      if (language === 'as') {
        if (lower.includes("schedule") || lower.includes("plan") || lower.includes("afternoon") || lower.includes("আজি") || lower.includes("কাম")) {
          fallbackText = `নমস্কাৰ ${patientName}। আজি আবেলি ৪:০০ বজাত আপোনাৰ জীয়াৰী অনন্যা আহিব আৰু আপোনালোক দুয়ো মিলি ব্ৰহ্মপুত্ৰ শব্দ-খেল খেলিব। আপোনাৰ দিনটো খুব আনন্দময় হওক।`;
          fallbackRoute = "/memory";
          fallbackLabel = "আজিৰ সময়সূচী চাওক";
        } else if (lower.includes("song") || lower.includes("bihu") || lower.includes("গান") || lower.includes("বিহু") || lower.includes("ভূপেন")) {
          fallbackText = `সেইটো আছিল ড০ ভূপেন হাজৰিকাৰ এটি অতি সুমধুৰ গান, যিটো আপোনাৰ পুত্ৰ ৰোহনে আপোনাৰ স্মৃতি ভঁৰালত সংৰক্ষণ কৰিছে।`;
          fallbackRoute = "/memories";
          fallbackLabel = "স্মৃতি ভঁৰাল খোলক";
        } else if (lower.includes("doctor") || lower.includes("চিকিৎসক") || lower.includes("ডাঃ") || lower.includes("medicine") || lower.includes("ঔষধ")) {
          fallbackText = `আপোনাৰ ডাঃ দেৱব্ৰত ৰয়ৰ সৈতে পৰৱৰ্তী সাক্ষাৎ সোমবাৰে পুৱা ১১ বজাত দিছপুৰ পলিক্লিনিকত আছে, আৰু ৰোহন আপোনাৰ লগত থাকিব।`;
          fallbackRoute = "/reminders";
          fallbackLabel = "ঔষধ আৰু চিকিৎসা চাওক";
        } else {
          fallbackText = `মই আপোনাৰ ওচৰতেই আছোঁ ${patientName}। আপুনি সম্পূৰ্ণ সুৰক্ষিত আৰু আপোনাৰ পৰিয়ালৰ সকলোৱে আপোনাক বহুত মৰম কৰে। একাপ গৰম অসমীয়া চাহ খাই আৰাম কৰক।`;
        }
      } else if (language === 'bn') {
        if (lower.includes("schedule") || lower.includes("plan") || lower.includes("আজকে") || lower.includes("কাজ")) {
          fallbackText = `নমস্কার ${patientName}। আজকে বিকেলে আপনার মেয়ে অনন্যা আসছেন এবং আপনারা একসাথে সুন্দর সময় কাটাবেন। আপনার আজকের দিনটি খুব শান্তিময় হোক।`;
          fallbackRoute = "/memory";
          fallbackLabel = "আজকের সময়সূচী দেখুন";
        } else if (lower.includes("song") || lower.includes("গান") || lower.includes("সুর")) {
          fallbackText = `সেটি ছিল ডঃ ভূপেন হাজারিকার একটি কালজয়ী মিষ্টি গান যা আপনার মেমোরি ভল্টে সংরক্ষিত রয়েছে।`;
          fallbackRoute = "/memories";
          fallbackLabel = "স্মৃতি ভল্ট খুলুন";
        } else {
          fallbackText = `আমি আপনার কাছেই আছি ${patientName}। আপনি সবসময় নিরাপদ এবং সুস্থ আছেন। পরিবার ও প্রিয়জনরা সবসময় আপনার পাশে আছেন।`;
        }
      } else if (language === 'hi') {
        if (lower.includes("schedule") || lower.includes("plan") || lower.includes("आज") || lower.includes("दवा")) {
          fallbackText = `नमस्ते ${patientName} जी। आज दोपहर ४:০০ बजे आपकी बेटी अनन्या आपसे मिलने आ रही हैं और आपकी सभी योजनाएं बिल्कुल व्यवस्थित हैं।`;
          fallbackRoute = "/memory";
          fallbackLabel = "आज की दिनचर्या देखें";
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
          fallbackRoute = "/memory";
          fallbackLabel = "View Today's Timeline";
        } else if (lower.includes("song") || lower.includes("bihu") || lower.includes("bhupen") || lower.includes("music")) {
          fallbackText = `That was Dr. Bhupen Hazarika's beautiful Brahmaputra folk melody that your son uploaded to your Heritage Vault. It always brings such warm memories.`;
          fallbackRoute = "/memories";
          fallbackLabel = "Open Heritage Vault";
        } else if (lower.includes("doctor") || lower.includes("appointment") || lower.includes("dr")) {
          fallbackText = `Your next appointment is with Dr. Debabrata Roy on Monday at 11:00 AM at Dispur Polyclinic, and Rohan will accompany you.`;
          fallbackRoute = "/reminders";
          fallbackLabel = "View Appointment Details";
        } else if (lower.includes("medicine") || lower.includes("dawa") || lower.includes("tablet") || lower.includes("blood pressure")) {
          fallbackText = `Your morning routine medicine is marked as taken. Your next routine reminder is with your wholesome lunch. Everything is right on track.`;
          fallbackRoute = "/reminders";
          fallbackLabel = "Open Medication List";
        } else if (lower.includes("game") || lower.includes("exercise") || lower.includes("play")) {
          fallbackText = `Let's keep your mind bright and agile! We have a delightful memory match game with traditional Assam cultural motifs ready for you.`;
          fallbackRoute = "/games/memory";
          fallbackLabel = "Start Memory Match";
        } else if (lower.includes("tea") || lower.includes("assam") || lower.includes("garden")) {
          fallbackText = `Assam tea gardens in winter are always so green and peaceful under the morning mist. Fresh tea with your family is one of your fondest joys.`;
        } else if (lower.includes("priya") || lower.includes("daughter") || lower.includes("call")) {
          fallbackText = `Your daughter Priya is calling you at 6:00 PM today for your regular warm family catch-up.`;
          fallbackRoute = "/family";
          fallbackLabel = "Open Family Circle";
        } else {
          fallbackText = `I am right here with you, ${patientName}. Everything is peaceful and safe today. Remember, your loved ones are right beside you and you are doing splendidly.`;
        }
      }

      return res.json({
        reply: fallbackText,
        provider: "offline-reassurance",
        language: langLabel,
        actionRoute: fallbackRoute,
        actionLabel: fallbackLabel,
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

  // 3. AI Caregiver & Clinical Insights Synthesizer Endpoint
  app.post("/api/ai/care-insights", async (req, res) => {
    try {
      const { patient, reminders = [], checkIns = [] } = req.body;
      const client = getGeminiClient();

      if (!client) {
        return res.json({
          status: "fallback",
          insights: "Patient demonstrated consistent cognitive engagement with familiar North-Eastern heritage exercises. Daily medications are on track.",
          caregiverTips: [
            "Maintain consistent afternoon tea routine to promote circadian rhythm.",
            "Review Assam folk music in Memory Vault before evening relaxation.",
          ],
        });
      }

      const prompt = `Analyze the following dementia care telemetry for patient "${patient?.name || 'Minoti Devi'}":
- Cognitive Activity Streak: ${patient?.stats?.streakDays || 5} days
- Completed Exercises Today: ${patient?.stats?.completedToday || 3} of ${patient?.stats?.totalToday || 4}
- Cognitive Score: ${patient?.stats?.weeklyScore || 85}%
- Reminders Adherence: ${reminders.filter((r: any) => r.completed).length} of ${reminders.length} completed
- Recent Wellbeing Check-ins: ${checkIns.map((c: any) => `${c.mood} (${c.note || ''})`).join("; ") || "Peaceful"}

Provide a concise 2-sentence clinical assessment of cognitive stability and 2 actionable recommendations for family caregivers. Return in valid JSON format:
{
  "assessment": "string",
  "recommendations": ["string", "string"]
}`;

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({
          status: "success",
          provider: "gemini-3.8-flash",
          ...parsed,
        });
      }
    } catch (err: any) {
      console.warn("AI Care insights endpoint fallback:", err?.message || err);
      return res.json({
        status: "fallback",
        assessment: "Cognitive stability and daily task engagement remain strong across routine benchmarks.",
        recommendations: [
          "Continue daily afternoon memory games to sustain attention span.",
          "Engage in supportive reminiscence conversations during family tea time.",
        ],
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

    // Explicit SPA HTML fallback handler in development for Windows/browsers
    app.use("*all", async (req, res, next) => {
      if (req.method !== "GET" || req.path.startsWith("/api")) {
        return next();
      }
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(process.cwd(), "index.html");
        let template = fs.readFileSync(indexPath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(503).send(
          "<h3>Application build missing</h3><p>Please run <code>npm run build</code> first before running in production mode, or run <code>npm run dev</code> for development.</p>"
        );
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running successfully!`);
    console.log(`  ➜ Local:   http://localhost:${PORT}/`);
    console.log(`  ➜ Network: http://127.0.0.1:${PORT}/`);
  });
}

startServer();
