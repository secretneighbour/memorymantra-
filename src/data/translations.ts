import { NERLanguage } from '../types';
import { translations as newTranslations, SUPPORTED_LANGUAGES, translate, TranslationDictionary, TranslationKey } from '../i18n';

export interface LanguageMeta {
  code: NERLanguage;
  name: string;
  native: string;
  displayLabel: string;
}

export const nerLanguages: readonly LanguageMeta[] = SUPPORTED_LANGUAGES.map((l) => ({
  code: l.code as NERLanguage,
  name: l.name,
  native: l.nativeName,
  displayLabel: `${l.name} — ${l.nativeName}`,
}));

export type { TranslationDictionary, TranslationKey };
export { translate };
export const translations = newTranslations;
