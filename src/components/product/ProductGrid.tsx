import { useCartStore } from '../../stores/cartStore';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { Pagination } from './Pagination';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductGrid({ products, currentPage, totalPages, onPageChange }: ProductGridProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.inStock) {
      addItem(product);
    }
  };

  return (
    <div className={styles.gridWrapper}>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
