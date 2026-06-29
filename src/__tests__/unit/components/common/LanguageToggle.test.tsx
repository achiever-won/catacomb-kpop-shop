import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageToggle } from '../../../../components/common/LanguageToggle';
import { useLanguageStore } from '../../../../stores/languageStore';

describe('LanguageToggle', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'ko' });
  });

  it('displays "한국어" when language is ko', () => {
    render(<LanguageToggle />);
    expect(screen.getByRole('button')).toHaveTextContent('한국어');
  });

  it('displays "English" when language is en', () => {
    useLanguageStore.setState({ language: 'en' });
    render(<LanguageToggle />);
    expect(screen.getByRole('button')).toHaveTextContent('English');
  });

  it('calls toggle when clicked', () => {
    const toggleSpy = vi.fn();
    useLanguageStore.setState({ language: 'ko', toggle: toggleSpy });

    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole('button'));

    expect(toggleSpy).toHaveBeenCalledOnce();
  });
});
