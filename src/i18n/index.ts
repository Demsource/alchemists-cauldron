import i18next from 'i18next';
import en from './locales/en.json';

export { t } from 'i18next';

export const LOCALES = ['en', 'ka', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

// Switcher labels: short code on the button, the language's own name for assistive tech.
// They are the same in every language, so they live here and not in the locale files.
export const LOCALE_LABELS: Readonly<Record<Locale, { short: string; name: string }>> = {
  en: { short: 'EN', name: 'English' },
  ka: { short: 'KA', name: 'ქართული' },
  ru: { short: 'RU', name: 'Русский' }
};

// Locale for Intl formatting. English uses en-GB to keep the day-first date order.
const INTL_LOCALES: Record<Locale, string> = { en: 'en-GB', ka: 'ka-GE', ru: 'ru-RU' };

export function getLocale(): Locale {
  return isLocale(i18next.language) ? i18next.language : DEFAULT_LOCALE;
}

export function getIntlLocale(): string {
  return INTL_LOCALES[getLocale()];
}

export async function setLocale(locale: Locale): Promise<void> {
  // Set first, so listeners of the change already see the new lang (fonts, :lang() rules).
  document.documentElement.lang = locale;
  await i18next.changeLanguage(locale);
}

export function onLocaleChange(listener: () => void): void {
  i18next.on('languageChanged', listener);
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
