import { describe, it, expect, beforeEach } from 'vitest';
import { useLanguageStore } from '../../../stores/languageStore';
import i18n from '../../../i18n';

describe('Language Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useLanguageStore.setState({ language: 'ko' });
    document.documentElement.lang = 'ko';
    i18n.changeLanguage('ko');
  });

  it('should default to Korean language', () => {
    const { language } = useLanguageStore.getState();
    expect(language).toBe('ko');
  });

  it('setLanguage should update language to English', () => {
    const { setLanguage } = useLanguageStore.getState();
    setLanguage('en');

    const { language } = useLanguageStore.getState();
    expect(language).toBe('en');
  });

  it('setLanguage should sync with i18next', () => {
    const { setLanguage } = useLanguageStore.getState();
    setLanguage('en');

    expect(i18n.language).toBe('en');
  });

  it('setLanguage should update HTML lang attribute', () => {
    const { setLanguage } = useLanguageStore.getState();
    setLanguage('en');

    expect(document.documentElement.lang).toBe('en');
  });

  it('toggle should switch from ko to en', () => {
    const { toggle } = useLanguageStore.getState();
    toggle();

    const { language } = useLanguageStore.getState();
    expect(language).toBe('en');
    expect(i18n.language).toBe('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('toggle should switch from en to ko', () => {
    useLanguageStore.setState({ language: 'en' });

    const { toggle } = useLanguageStore.getState();
    toggle();

    const { language } = useLanguageStore.getState();
    expect(language).toBe('ko');
    expect(i18n.language).toBe('ko');
    expect(document.documentElement.lang).toBe('ko');
  });

  it('setLanguage back to Korean should update all synced values', () => {
    const { setLanguage } = useLanguageStore.getState();
    setLanguage('en');
    setLanguage('ko');

    const { language } = useLanguageStore.getState();
    expect(language).toBe('ko');
    expect(i18n.language).toBe('ko');
    expect(document.documentElement.lang).toBe('ko');
  });
});
