import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchBar } from '../../../../components/common/SearchBar';
import '../../../../i18n';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderSearchBar() {
  return render(
    <MemoryRouter>
      <SearchBar />
    </MemoryRouter>
  );
}

describe('SearchBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders an input and a submit button', () => {
    renderSearchBar();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows error when submitting with fewer than 2 characters', () => {
    renderSearchBar();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(screen.getByRole('alert')).toHaveTextContent('최소 2글자 이상 입력해주세요');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows error when submitting with empty input', () => {
    renderSearchBar();

    fireEvent.submit(screen.getByRole('search'));

    expect(screen.getByRole('alert')).toHaveTextContent('최소 2글자 이상 입력해주세요');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('navigates to /search?q=query on valid submit', () => {
    renderSearchBar();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'album' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(mockNavigate).toHaveBeenCalledWith('/search?q=album');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('encodes special characters in the query', () => {
    renderSearchBar();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '포토 카드' } });
    fireEvent.submit(screen.getByRole('search'));

    expect(mockNavigate).toHaveBeenCalledWith(
      `/search?q=${encodeURIComponent('포토 카드')}`
    );
  });

  it('trims whitespace before validating', () => {
    renderSearchBar();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '  a  ' } });
    fireEvent.submit(screen.getByRole('search'));

    // "a" after trim is only 1 character, so validation fails
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('clears error when user types after an error', () => {
    renderSearchBar();

    // Trigger error
    fireEvent.submit(screen.getByRole('search'));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // User starts typing
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'al' } });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
