import { NERLanguage } from '../types';

export interface SpeechOptions {
  lang?: NERLanguage;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
  onChunkStart?: (chunk: string, index: number, total: number) => void;
}

export interface LanguageVoiceConfig {
  code: NERLanguage;
  name: string;
  native: string;
  primaryBcp47: string;
  fallbackBcp47s: string[];
  voiceKeywords: string[];
}

export const LANGUAGE_VOICE_CONFIGS: Record<NERLanguage, LanguageVoiceConfig> = {
  en: {
    code: 'en',
    name: 'English',
    native: 'English',
    primaryBcp47: 'en-IN',
    fallbackBcp47s: ['en-US', 'en-GB', 'en-AU', 'en'],
    voiceKeywords: ['india', 'indian', 'en-in', 'english', 'natural', 'google'],
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    primaryBcp47: 'hi-IN',
    fallbackBcp47s: ['hi', 'hin'],
    voiceKeywords: ['hindi', 'hi-in', 'हिन्दी', 'hemant', 'kalpana', 'google हिन्दी'],
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    native: 'বাংলা',
    primaryBcp47: 'bn-IN',
    fallbackBcp47s: ['bn-BD', 'bn', 'ben'],
    voiceKeywords: ['bengali', 'bangla', 'bn-in', 'বাংলা', 'bashkar', 'google বাংলা'],
  },
  as: {
    code: 'as',
    name: 'Assamese',
    native: 'অসমীয়া',
    primaryBcp47: 'as-IN',
    fallbackBcp47s: ['as', 'bn-IN', 'bn-BD', 'bn', 'hi-IN'],
    voiceKeywords: ['assamese', 'as-in', 'অসমীয়া', 'bengali', 'bangla', 'bn-in'],
  },
  mni: {
    code: 'mni',
    name: 'Meitei',
    native: 'মৈতায়লোন্',
    primaryBcp47: 'mni-IN',
    fallbackBcp47s: ['mni', 'bn-IN', 'hi-IN', 'en-IN'],
    voiceKeywords: ['manipuri', 'meitei', 'mni', 'bengali', 'bn-in'],
  },
  kha: {
    code: 'kha',
    name: 'Khasi',
    native: 'Khasi',
    primaryBcp47: 'kha-IN',
    fallbackBcp47s: ['kha', 'en-IN', 'hi-IN', 'en-US'],
    voiceKeywords: ['khasi', 'en-in', 'indian', 'english'],
  },
  lus: {
    code: 'lus',
    name: 'Mizo',
    native: 'Mizo',
    primaryBcp47: 'lus-IN',
    fallbackBcp47s: ['lus', 'mzo', 'en-IN', 'hi-IN', 'en-US'],
    voiceKeywords: ['mizo', 'lus', 'en-in', 'indian', 'english'],
  },
  nag: {
    code: 'nag',
    name: 'Nagamese',
    native: 'Nagamese',
    primaryBcp47: 'nag-IN',
    fallbackBcp47s: ['nag', 'as-IN', 'bn-IN', 'en-IN', 'hi-IN'],
    voiceKeywords: ['nagamese', 'assamese', 'bengali', 'en-in', 'indian'],
  },
};

// Global reference set to prevent Chromium V8 garbage collection mid-utterance
const activeUtterances = new Set<SpeechSynthesisUtterance>();

export const NARRATOR_VOICE_ASSETS = {
  welcome: {
    en: './audio/narrator/narrator_welcome_en.mp3',
    hi: './audio/narrator/narrator_welcome_hi.mp3',
    bn: './audio/narrator/narrator_welcome_bn.mp3',
    as: './audio/narrator/narrator_welcome_as.mp3',
    mni: './audio/narrator/narrator_welcome_mni.mp3',
    kha: './audio/narrator/narrator_welcome_kha.mp3',
    lus: './audio/narrator/narrator_welcome_lus.mp3',
    nag: './audio/narrator/narrator_welcome_nag.mp3',
  },
  cues: {
    paused: './audio/narrator/narrator_paused.mp3',
    resumed: './audio/narrator/narrator_resumed.mp3',
    stopped: './audio/narrator/narrator_stopped.mp3',
    completed: './audio/narrator/narrator_completed.mp3',
    next: './audio/narrator/section_next.mp3',
    prev: './audio/narrator/section_prev.mp3',
    restart: './audio/narrator/section_restart.mp3',
    chime: './audio/narrator/narrator_chime.wav',
  },
  audition: {
    en: './audio/narrator/audition_sample_en.mp3',
    hi: './audio/narrator/audition_sample_hi.mp3',
    bn: './audio/narrator/audition_sample_bn.mp3',
  },
  assistant: {
    intro: './audio/assistant/checkin_intro.mp3',
    mood: './audio/assistant/prompt_mood.mp3',
    energy: './audio/assistant/prompt_energy.mp3',
    comfort: './audio/assistant/prompt_comfort.mp3',
    complete: './audio/assistant/checkin_complete.mp3',
  },
} as const;

class SpeechEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeakingState = false;
  private currentText = '';
  private stopRequested = false;
  private isPausedState = false;
  private currentAudio: HTMLAudioElement | null = null;
  private statusListeners: Array<(isSpeaking: boolean, text: string) => void> = [];
  private defaultRate = 0.88; // Calm, respectful pacing for cognitive and elderly care
  private keepAliveInterval: any = null;

  constructor() {
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const loadVoices = () => {
      try {
        const voiceList = window.speechSynthesis.getVoices();
        if (voiceList && voiceList.length > 0) {
          this.voices = voiceList;
        }
      } catch (e) {
        console.warn('Unable to load synthesis voices:', e);
      }
    };

    loadVoices();
    if (typeof window.speechSynthesis.addEventListener === 'function') {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    } else if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public async ensureVoicesLoaded(): Promise<SpeechSynthesisVoice[]> {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return [];
    }
    if (this.voices.length > 0) return this.voices;

    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      this.voices = list;
      return list;
    }

    // Await voiceschanged up to 250ms
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        const finalCheck = window.speechSynthesis.getVoices() || [];
        this.voices = finalCheck;
        resolve(finalCheck);
      }, 250);

      const handler = () => {
        clearTimeout(timer);
        const vList = window.speechSynthesis.getVoices() || [];
        this.voices = vList;
        resolve(vList);
      };

      if (typeof window.speechSynthesis.addEventListener === 'function') {
        window.speechSynthesis.addEventListener('voiceschanged', handler, { once: true });
      } else {
        setTimeout(handler, 100);
      }
    });
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices() || [];
    }
    return this.voices;
  }

  public subscribe(listener: (isSpeaking: boolean, text: string) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private notifyStatus(speaking: boolean, text: string = '') {
    this.isSpeakingState = speaking;
    this.currentText = speaking ? text : '';
    this.statusListeners.forEach((fn) => fn(speaking, this.currentText));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public isPaused(): boolean {
    return this.isPausedState;
  }

  public getCurrentText(): string {
    return this.currentText;
  }

  public setRate(rate: number) {
    this.defaultRate = Math.max(0.6, Math.min(1.4, rate));
  }

  /**
   * Intelligently detects whether text contains Devanagari, Bengali/Assamese, or Latin script.
   */
  public detectScript(text: string): 'devanagari' | 'bengali-assamese' | 'latin' | 'other' {
    if (/[\u0900-\u097F]/.test(text)) {
      return 'devanagari';
    }
    if (/[\u0980-\u09FF]/.test(text)) {
      return 'bengali-assamese';
    }
    if (/[a-zA-Z]/.test(text)) {
      return 'latin';
    }
    return 'other';
  }

  /**
   * Evaluates naturalness score of a voice to prioritize natural/neural human sounding voices.
   */
  private scoreVoiceQuality(voice: SpeechSynthesisVoice): number {
    let score = 0;
    const name = voice.name.toLowerCase();
    if (name.includes('natural') || name.includes('neural')) score += 50;
    if (name.includes('google')) score += 35;
    if (name.includes('siri') || name.includes('apple')) score += 30;
    if (name.includes('premium') || name.includes('enhanced') || name.includes('high quality')) score += 25;
    if (name.includes('kalpana') || name.includes('hemant') || name.includes('veena') || name.includes('sangeeta')) score += 20;
    if (voice.default) score += 10;
    if (voice.localService === false) score += 15;
    return score;
  }

  private findVoiceByBcp47(
    voices: SpeechSynthesisVoice[],
    primary: string,
    fallbacks: string[],
    keywords: string[]
  ): SpeechSynthesisVoice | null {
    if (!voices || voices.length === 0) return null;

    const lowerPrimary = primary.toLowerCase();
    const candidates: { voice: SpeechSynthesisVoice; tier: number; quality: number }[] = [];

    voices.forEach((v) => {
      const vLang = v.lang.toLowerCase();
      const vName = v.name.toLowerCase();
      const quality = this.scoreVoiceQuality(v);

      // Exact primary match
      if (vLang === lowerPrimary) {
        candidates.push({ voice: v, tier: 1, quality });
        return;
      }

      // Primary prefix match (e.g. 'hi' matches 'hi-IN' or 'en' matches 'en-US')
      if (vLang.startsWith(lowerPrimary.slice(0, 2))) {
        candidates.push({ voice: v, tier: 2, quality });
        return;
      }

      // Fallback BCP-47 match
      for (const fb of fallbacks) {
        const fbLower = fb.toLowerCase();
        if (vLang === fbLower || vLang.startsWith(fbLower.slice(0, 2))) {
          candidates.push({ voice: v, tier: 3, quality });
          return;
        }
      }

      // Keyword match in voice name
      for (const kw of keywords) {
        const kwLower = kw.toLowerCase();
        if (vName.includes(kwLower)) {
          candidates.push({ voice: v, tier: 4, quality });
          return;
        }
      }

      // If English requested, any English voice
      if (lowerPrimary.startsWith('en')) {
        if (vLang.includes('en-in') || vName.includes('india')) {
          candidates.push({ voice: v, tier: 5, quality });
        } else if (vLang.startsWith('en')) {
          candidates.push({ voice: v, tier: 6, quality });
        }
      }
    });

    if (candidates.length === 0) return null;

    // Sort by tier first (lower tier = closer match), then by voice quality score (higher = better)
    candidates.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return b.quality - a.quality;
    });

    return candidates[0].voice;
  }

  /**
   * Matches the best available SpeechSynthesisVoice for a given language code and text content.
   * GUARANTEES that returned bcp47 is supported by an actual voice or standard system default,
   * completely preventing Chrome "language-unavailable" errors.
   */
  public resolveVoiceAndLang(
    lang: NERLanguage,
    text: string
  ): { voice: SpeechSynthesisVoice | null; bcp47: string } {
    const config = LANGUAGE_VOICE_CONFIGS[lang] || LANGUAGE_VOICE_CONFIGS.en;
    const voices = this.getAvailableVoices();
    const script = this.detectScript(text);

    let matchedVoice: SpeechSynthesisVoice | null = null;

    // 1. If text is written in Devanagari script (e.g. Hindi translation)
    if (script === 'devanagari') {
      matchedVoice = this.findVoiceByBcp47(
        voices,
        'hi-IN',
        ['hi', 'hin'],
        ['hindi', 'हिन्दी', 'hemant', 'kalpana', 'google हिन्दी']
      );
      if (matchedVoice) {
        return { voice: matchedVoice, bcp47: matchedVoice.lang };
      }
    }

    // 2. If text is written in Eastern Nagari / Bengali-Assamese script
    if (script === 'bengali-assamese') {
      if (lang === 'as') {
        matchedVoice = this.findVoiceByBcp47(
          voices,
          'as-IN',
          ['as', 'bn-IN', 'bn', 'hi-IN'],
          ['assamese', 'অসমীয়া', 'bengali', 'বাংলা']
        );
      } else {
        matchedVoice = this.findVoiceByBcp47(
          voices,
          'bn-IN',
          ['bn-BD', 'bn', 'ben'],
          ['bengali', 'bangla', 'বাংলা', 'bashkar', 'google বাংলা']
        );
      }
      if (matchedVoice) {
        return { voice: matchedVoice, bcp47: matchedVoice.lang };
      }
    }

    // 3. If text is in Latin characters (English, or transliterated NER text)
    if (script === 'latin') {
      // Prioritize Indian English, then standard English
      matchedVoice = this.findVoiceByBcp47(
        voices,
        'en-IN',
        ['en-US', 'en-GB', 'en-AU', 'en'],
        ['india', 'indian', 'english', 'natural', 'google']
      );
      if (matchedVoice) {
        return { voice: matchedVoice, bcp47: matchedVoice.lang };
      }
    }

    // 4. Try requested language config
    matchedVoice = this.findVoiceByBcp47(
      voices,
      config.primaryBcp47,
      config.fallbackBcp47s,
      config.voiceKeywords
    );
    if (matchedVoice) {
      return { voice: matchedVoice, bcp47: matchedVoice.lang };
    }

    // 5. Ultimate Fallback: Default voice or first voice in browser
    const defaultVoice = voices.find((v) => v.default) || voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
    if (defaultVoice) {
      return {
        voice: defaultVoice,
        bcp47: defaultVoice.lang,
      };
    }

    // No voices enumerated yet; return standard safe code that all browsers support
    return {
      voice: null,
      bcp47: script === 'devanagari' ? 'hi-IN' : script === 'bengali-assamese' ? 'bn-IN' : 'en-US',
    };
  }

  /**
   * Breaks long text into short, natural sentence clauses (~120-150 chars).
   * This guarantees that Chrome never triggers its 15-second speech pause bug.
   */
  public chunkText(text: string): string[] {
    const clean = text
      .replace(/[#*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return [];

    // Split by Indic danda (।), period, exclamation, question mark, newline, or semicolons
    const rawSegments = clean.split(/(?<=[।!?\n])\s+|(?<=\.\s+)/);
    const chunks: string[] = [];

    for (const seg of rawSegments) {
      const trimmed = seg.trim();
      if (!trimmed) continue;

      if (trimmed.length <= 160) {
        chunks.push(trimmed);
      } else {
        // Sub-split by comma, dash or semicolon
        const subParts = trimmed.split(/(?<=[,;—-])\s+/);
        let temp = '';
        for (const part of subParts) {
          if ((temp + ' ' + part).length <= 160) {
            temp = temp ? `${temp} ${part}` : part;
          } else {
            if (temp) chunks.push(temp.trim());
            temp = part;
          }
        }
        if (temp) chunks.push(temp.trim());
      }
    }

    return chunks.length > 0 ? chunks : [clean];
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.keepAliveInterval = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 3500);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  /**
   * Main speech execution. Automatically handles voice selection, sentence chunking,
   * Chrome keep-alive, and async cancel resolution.
   */
  public async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    // 1. Cancel previous speech cleanly
    this.stopRequested = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
          // Crucial: Wait 60ms for Chromium IPC to flush the cancel command
          await new Promise((r) => setTimeout(r, 60));
        }
      } catch (e) {
        console.warn('Error during pre-speak cancel:', e);
      }
    }

    this.stopRequested = false;
    this.isPausedState = false;

    const trimmed = text.trim();
    if (!trimmed) return;

    await this.ensureVoicesLoaded();

    const lang = options.lang || 'en';
    const rate = options.rate || this.defaultRate;
    const pitch = options.pitch || 1.0;

    const chunks = this.chunkText(trimmed);
    this.notifyStatus(true, trimmed);

    if (options.onStart) {
      options.onStart();
    }

    this.startKeepAlive();

    try {
      for (let i = 0; i < chunks.length; i++) {
        if (this.stopRequested) break;

        const chunk = chunks[i];
        if (options.onChunkStart) {
          options.onChunkStart(chunk, i, chunks.length);
        }

        const { voice, bcp47 } = this.resolveVoiceAndLang(lang, chunk);

        await this.speakChunkWithWebSpeech(chunk, {
          voice,
          bcp47,
          rate,
          pitch,
        });
      }
    } catch (err) {
      console.warn('Speech execution notice:', err);
      if (options.onError) {
        options.onError(err);
      }
    } finally {
      this.stopKeepAlive();
      this.notifyStatus(false, '');
      if (options.onEnd && !this.stopRequested) {
        options.onEnd();
      }
    }
  }

  private speakChunkWithWebSpeech(
    chunk: string,
    params: {
      voice: SpeechSynthesisVoice | null;
      bcp47: string;
      rate: number;
      pitch: number;
    }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.stopRequested || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve(false);
        return;
      }

      try {
        // Resume in case Chrome was stuck in paused state
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = params.rate;
        utterance.pitch = params.pitch;
        utterance.lang = params.bcp47;

        if (params.voice) {
          utterance.voice = params.voice;
        }

        // Prevent V8 garbage collection
        activeUtterances.add(utterance);

        let finished = false;
        let timeout: any = null;

        const cleanup = () => {
          if (finished) return;
          finished = true;
          if (timeout) clearTimeout(timeout);
          activeUtterances.delete(utterance);
        };

        utterance.onend = () => {
          cleanup();
          resolve(true);
        };

        utterance.onerror = (e) => {
          cleanup();
          // Canceled or interrupted is expected on user stop/skip
          if (e.error === 'canceled' || e.error === 'interrupted') {
            resolve(true);
          } else {
            console.warn('SpeechSynthesisUtterance error event:', e.error, 'lang:', params.bcp47);
            resolve(false);
          }
        };

        // Safety timeout for chunk: if browser hangs without firing onend
        const maxDuration = Math.max(6000, chunk.length * 150);
        timeout = setTimeout(() => {
          if (!finished) {
            cleanup();
            resolve(true);
          }
        }, maxDuration);

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('speechSynthesis.speak threw error:', err);
        resolve(false);
      }
    });
  }

  /**
   * Plays a pre-rendered audio asset file (e.g. from /audio/narrator/ or /audio/assistant/).
   */
  public playAudioAsset(
    url: string,
    options?: { onStart?: () => void; onEnd?: () => void; onError?: (err: unknown) => void }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve(false);
        return;
      }

      this.stop();
      this.stopRequested = false;
      this.isPausedState = false;

      try {
        const audio = new Audio(url);
        this.currentAudio = audio;
        this.notifyStatus(true, 'Playing narrator voice asset...');

        if (options?.onStart) {
          options.onStart();
        }

        audio.onended = () => {
          this.currentAudio = null;
          this.notifyStatus(false, '');
          if (options?.onEnd) {
            options.onEnd();
          }
          resolve(true);
        };

        audio.onerror = (e) => {
          console.warn('Audio asset playback error for:', url, e);
          this.currentAudio = null;
          this.notifyStatus(false, '');
          if (options?.onError) {
            options.onError(e);
          }
          resolve(false);
        };

        audio.play().catch((err) => {
          console.warn('Audio play() rejected:', err);
          this.currentAudio = null;
          this.notifyStatus(false, '');
          resolve(false);
        });
      } catch (err) {
        console.warn('Failed to initialize audio element:', err);
        this.currentAudio = null;
        resolve(false);
      }
    });
  }

  /**
   * Plays the narrator welcome greeting voice asset in the selected language.
   */
  public async playNarratorWelcome(lang: NERLanguage = 'en'): Promise<boolean> {
    const assetUrl = NARRATOR_VOICE_ASSETS.welcome[lang] || NARRATOR_VOICE_ASSETS.welcome.en;
    return this.playAudioAsset(assetUrl);
  }

  /**
   * Plays a specific narrator spoken status cue (paused, resumed, completed, etc.).
   */
  public async playNarratorCue(cue: keyof typeof NARRATOR_VOICE_ASSETS.cues): Promise<boolean> {
    const assetUrl = NARRATOR_VOICE_ASSETS.cues[cue];
    if (!assetUrl) return false;
    return this.playAudioAsset(assetUrl);
  }

  public stop(): void {
    this.stopRequested = true;
    this.isPausedState = false;
    this.stopKeepAlive();

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('Error cancelling speech synthesis:', e);
      }
    }

    activeUtterances.clear();
    this.notifyStatus(false, '');
  }

  public pause(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.isPausedState = true;
      } catch {
        // Ignore
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
        this.isPausedState = true;
      } catch {
        // Ignore
      }
    }
  }

  public resume(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.play().catch(() => {});
        this.isPausedState = false;
      } catch {
        // Ignore
      }
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        this.isPausedState = false;
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Plays a gentle, tranquil 528Hz + 396Hz harmonic chime for calming wellness feedback.
   * Plays pre-rendered high quality chime WAV asset with synthesizer fallback.
   */
  public playCalmingChime(): void {
    if (typeof window === 'undefined') return;

    try {
      const chimeAudio = new Audio(NARRATOR_VOICE_ASSETS.cues.chime);
      chimeAudio.volume = 0.7;
      chimeAudio.play().catch(() => {
        // Fallback to Web Audio synthesis if file play was blocked
        this.playWebAudioChimeFallback();
      });
    } catch {
      this.playWebAudioChimeFallback();
    }
  }

  private playWebAudioChimeFallback(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Dual tranquil sine tones (528Hz + 396Hz)
      const frequencies = [528, 396];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.95);
      });

      setTimeout(() => {
        try {
          ctx.close();
        } catch {
          // ignore
        }
      }, 1200);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }
}

export const speechEngine = new SpeechEngine();

