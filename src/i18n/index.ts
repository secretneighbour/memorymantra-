import { LanguageCode, SupportedLanguage, TranslationDictionary, TranslationKey } from './types';
import { en } from './translations/en';
import { as } from './translations/as';
import { bn } from './translations/bn';
import { hi } from './translations/hi';
import { mni } from './translations/mni';
import { kha } from './translations/kha';
import { lus } from './translations/lus';
import { nag } from './translations/nag';

export * from './types';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', state: 'Pan-India', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', state: 'Assam', flag: '🦏' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', state: 'Tripura / Assam', flag: '🌾' },
  { code: 'mni', name: 'Meitei (Manipuri)', nativeName: 'মৈতৈলোন্', state: 'Manipur', flag: '🪷' },
  { code: 'kha', name: 'Khasi', nativeName: 'Ka Ktien Khasi', state: 'Meghalaya', flag: '🌧️' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng', state: 'Mizoram', flag: '🌄' },
  { code: 'nag', name: 'Nagamese', nativeName: 'Nagamese', state: 'Nagaland', flag: '🌿' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', state: 'National', flag: '🇮🇳' },
];

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en,
  as,
  bn,
  hi,
  mni,
  kha,
  lus,
  nag,
};

/**
 * Single source of truth translation accessor.
 * Supports string interpolation with params like `{count}` or `{name}`.
 * Gracefully falls back to English if the key is missing or blank in the target language.
 * Logs a clear warning in development if a key is missing.
 */
export function translate(lang: LanguageCode, key: TranslationKey, params?: Record<string, string | number>): string {
  const dict = translations[lang] || translations.en;
  let text = dict[key];

  if (!text) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[i18n Audit Warning] Missing translation key "${key}" for language "${lang}". Falling back to English.`);
    }
    text = translations.en[key] || key;
  }

  if (params && typeof text === 'string') {
    return Object.entries(params).reduce((acc, [k, v]) => {
      return acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }, text);
  }

  return text;
}

/**
 * Development Audit Utility to check if any language is missing keys present in English.
 */
export function auditTranslations(): { [lang in LanguageCode]?: string[] } {
  const enKeys = Object.keys(en) as TranslationKey[];
  const missingByLang: { [lang in LanguageCode]?: string[] } = {};

  (Object.keys(translations) as LanguageCode[]).forEach((lang) => {
    if (lang === 'en') return;
    const currentDict = translations[lang];
    const missing = enKeys.filter((key) => !currentDict[key]);
    if (missing.length > 0) {
      missingByLang[lang] = missing;
    }
  });

  return missingByLang;
}
