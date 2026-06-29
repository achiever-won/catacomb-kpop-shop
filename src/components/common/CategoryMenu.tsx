import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../../data/categories';
import { Category } from '../../types';
import { SubMenuPanel } from './SubMenuPanel';
import styles from './CategoryMenu.module.css';

export interface CategoryMenuProps {
  categories?: Category[];
  onSubCategorySelect?: (mainCategory: string, subCategory: string) => void;
}

export function CategoryMenu({
  categories: categoriesProp = categories,
  onSubCategorySelect,
}: CategoryMenuProps) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Detect touch device
  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none)');
    setIsTouchDevice(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback(
    (categoryName: string) => {
      if (isTouchDevice) return;

      // Clear any pending close timer
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      // Set 200ms delay before opening
      openTimerRef.current = setTimeout(() => {
        setActiveCategory(categoryName);
      }, 200);
    },
    [isTouchDevice]
  );

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return;

    // Clear any pending open timer
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    // Set 300ms delay before closing
    closeTimerRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 300);
  }, [isTouchDevice]);

  const handleTap = useCallback(
    (categoryName: string) => {
      if (!isTouchDevice) return;

      setActiveCategory((prev) => (prev === categoryName ? null : categoryName));
    },
    [isTouchDevice]
  );

  const handleSubCategorySelect = useCallback(
    (mainCategory: string, subCategory: string) => {
      if (onSubCategorySelect) {
        onSubCategorySelect(mainCategory, subCategory);
      } else {
        navigate(`/category/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subCategory)}`);
      }
      setActiveCategory(null);
    },
    [navigate, onSubCategorySelect]
  );

  const handleClose = useCallback(() => {
    setActiveCategory(null);
  }, []);

  // Close on outside click (for touch devices)
  useEffect(() => {
    if (!isTouchDevice || !activeCategory) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveCategory(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isTouchDevice, activeCategory]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <nav className={styles.categoryMenu} ref={menuRef} aria-label="Category navigation">
      {categoriesProp.map((category) => (
        <div
          key={category.name}
          onMouseEnter={() => handleMouseEnter(category.name)}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative' }}
        >
          <button
            className={`${styles.menuItem} ${activeCategory === category.name ? styles.menuItemActive : ''}`}
            onClick={() => handleTap(category.name)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveCategory((prev) =>
                  prev === category.name ? null : category.name
                );
              }
              if (e.key === 'Escape') {
                setActiveCategory(null);
              }
            }}
            aria-expanded={activeCategory === category.name}
            aria-haspopup="true"
          >
            <img
              src={`${import.meta.env.BASE_URL}${category.name === 'K-POP Goods' ? 'kpop.png' : 'webtoon.png'}`}
              alt={category.name}
              className={styles.menuImage}
            />
          </button>
          <SubMenuPanel
            category={category}
            isVisible={activeCategory === category.name}
            onClose={handleClose}
            onSubCategorySelect={handleSubCategorySelect}
          />
        </div>
      ))}
    </nav>
  );
}
