import i18next from 'i18next';
import en from './locales/en.json';

export { t } from 'i18next';

export const LOCALES = ['en', 'ka', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

// English is the source of keys; ka / ru are added with the translations.
const resources = {
  en: { translation: en }
} as const;

// Resources are bundled, so init finishes synchronously and the first render is translated.
export function initI18n(locale: Locale = DEFAULT_LOCALE): void {
  void i18next.init({
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: LOCALES,
    resources,
    initAsync: false,
    // UI text is set via textContent, never as HTML, so no escaping is needed.
    interpolation: { escapeValue: false }
  });
  document.documentElement.lang = locale;
}
