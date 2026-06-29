import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

type Language = 'ko' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggle: () => void;
}

function syncLanguage(lang: Language): void {
  i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'ko',
      setLanguage: (lang: Language) => {
        syncLanguage(lang);
        set({ language: lang });
      },
      toggle: () => {
        const next: Language = get().language === 'ko' ? 'en' : 'ko';
        syncLanguage(next);
        set({ language: next });
      },
    }),
    {
      name: 'catacomb-language',
      onRehydrateStorage: () => {
        return (state?: LanguageStore) => {
          if (state) {
            syncLanguage(state.language);
          }
        };
      },
    }
  )
);
