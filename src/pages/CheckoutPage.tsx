import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { StepIndicator } from '../components/checkout/StepIndicator';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { OrderConfirmation } from '../components/checkout/OrderConfirmation';
import type { ShippingAddress, PaymentInfo, Order } from '../types';
import styles from './CheckoutPage.module.css';

export function CheckoutPage() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const cartItems = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const createOrder = useOrderStore((state) => state.createOrder);

  const [currentStep, setCurrentStep] = useState(0);
  const [shippingData, setShippingData] = useState<ShippingAddress | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const steps = [
    t('checkout.shipping'),
    t('checkout.payment'),
    t('checkout.confirmation'),
  ];

  const handleShippingSubmit = (data: ShippingAddress) => {
    setShippingData(data);
    setCurrentStep(1);
  };

  const handlePaymentSubmit = (paymentData: PaymentInfo) => {
    if (!shippingData) return;

    // Create the order
    const order = createOrder(cartItems, shippingData, paymentData);
    setCompletedOrder(order);

    // Clear the cart
    clearCart();

    // Advance to confirmation step
    setCurrentStep(2);
  };

  const handlePaymentPrevious = () => {
    setCurrentStep(0);
  };

  const shippingFee = 3000;
  const totalAmount = getTotal() + shippingFee;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ShippingForm
            initialData={user?.shippingAddress}
            onSubmit={handleShippingSubmit}
          />
        );
      case 1:
        return (
          <PaymentForm
            totalAmount={totalAmount}
            onSubmit={handlePaymentSubmit}
            onPrevious={handlePaymentPrevious}
          />
        );
      case 2:
        return completedOrder ? (
          <OrderConfirmation order={completedOrder} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('checkout.shipping')}</h1>
      <StepIndicator steps={steps} currentStep={currentStep} />
      {renderStepContent()}
    </div>
  );
}
