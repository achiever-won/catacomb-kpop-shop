import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { CategoryMenu } from './components/common/CategoryMenu';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { FaqPage } from './pages/info/FaqPage';
import { ContactPage } from './pages/info/ContactPage';
import { ShippingInfoPage } from './pages/info/ShippingInfoPage';
import { ReturnPolicyPage } from './pages/info/ReturnPolicyPage';
import { TermsPage } from './pages/info/TermsPage';
import { PrivacyPage } from './pages/info/PrivacyPage';
import { CompanyInfoPage } from './pages/info/CompanyInfoPage';
import { useAuthStore } from './stores/authStore';
import { useOrderStore } from './stores/orderStore';
import { useCartStore } from './stores/cartStore';
import './i18n';
import './styles/variables.css';

export default function App() {
  const initDemoSession = useAuthStore((state) => state.initDemoSession);
  const initDemoOrders = useOrderStore((state) => state.initDemoOrders);
  const removeStaleItems = useCartStore((state) => state.removeStaleItems);

  useEffect(() => {
    initDemoSession();
    initDemoOrders();
    removeStaleItems();
  }, [initDemoSession, initDemoOrders, removeStaleItems]);

  return (
    <ErrorBoundary>
      <AppShell>
        <CategoryMenu />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:mainCategory/:subCategory?" element={<ProductListingPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          <Route path="/info/faq" element={<FaqPage />} />
          <Route path="/info/contact" element={<ContactPage />} />
          <Route path="/info/shipping" element={<ShippingInfoPage />} />
          <Route path="/info/returns" element={<ReturnPolicyPage />} />
          <Route path="/info/terms" element={<TermsPage />} />
          <Route path="/info/privacy" element={<PrivacyPage />} />
          <Route path="/info/company" element={<CompanyInfoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </ErrorBoundary>
  );
}
