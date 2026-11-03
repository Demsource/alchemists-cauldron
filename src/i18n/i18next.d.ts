import 'i18next';
import type en from './locales/en.json';

// Typed keys: t('unknown.key') fails tsc.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof en };
  }
}
