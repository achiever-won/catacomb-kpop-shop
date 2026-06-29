import { Category } from '../../types';
import styles from './SubMenuPanel.module.css';

export interface SubMenuPanelProps {
  category: Category;
  isVisible: boolean;
  onClose: () => void;
  onSubCategorySelect: (mainCategory: string, subCategory: string) => void;
}

export function SubMenuPanel({
  category,
  isVisible,
  onClose,
  onSubCategorySelect,
}: SubMenuPanelProps) {
  const handleClick = (subCategory: string) => {
    onSubCategorySelect(category.name, subCategory);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, subCategory: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(subCategory);
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.panel} ${isVisible ? styles.panelVisible : ''}`}
      role="menu"
      aria-label={`${category.name} sub-categories`}
    >
      <div className={styles.categoryTitle}>{category.name}</div>
      <ul className={styles.subCategoryList}>
        {category.subCategories.map((subCategory) => (
          <li key={subCategory}>
            <button
              className={styles.subCategoryItem}
              role="menuitem"
              onClick={() => handleClick(subCategory)}
              onKeyDown={(e) => handleKeyDown(e, subCategory)}
              tabIndex={isVisible ? 0 : -1}
            >
              {subCategory}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
