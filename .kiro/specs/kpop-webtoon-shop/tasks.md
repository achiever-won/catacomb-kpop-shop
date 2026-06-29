# Implementation Plan: 카타콤 (Catacomb) - K-POP & K-WEBTOON Goods Shop

## Overview

This plan implements a React + TypeScript SPA e-commerce demo for K-POP and K-WEBTOON merchandise. The implementation progresses from project scaffolding and data layer through core features (products, cart, checkout) to polish (i18n, auth, order history). Each task builds incrementally on previous work, with property-based tests validating correctness properties from the design.

## Tasks

- [x] 1. Set up project structure, types, and utilities
  - [x] 1.1 Initialize Vite + React + TypeScript project with dependencies
    - Initialize the project with `npm create vite@latest` (React + TypeScript template)
    - Install dependencies: `zustand`, `react-router-dom`, `i18next`, `react-i18next`, `fast-check` (dev), `vitest` (dev), `@testing-library/react` (dev), `jsdom` (dev)
    - Configure Vitest in `vite.config.ts` with jsdom environment
    - Set up CSS custom properties for the blue theme in `src/styles/variables.css`
    - Create the folder structure: `src/components/`, `src/pages/`, `src/stores/`, `src/data/`, `src/utils/`, `src/i18n/`, `src/styles/`, `src/types/`, `src/__tests__/`
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Define TypeScript type definitions
    - Create `src/types/index.ts` with all interfaces: `Product`, `Category`, `SortOption`, `PaginatedResult`, `CartItem`, `User`, `ShippingAddress`, `RegistrationData`, `PaymentInfo`, `Order`, `OrderItem`, `OrderStatus`, `LoginResult`, `RegistrationResult`
    - _Requirements: 3.3, 6.4, 7.6, 7.7, 8.1_

  - [x] 1.3 Implement pure utility functions (validators)
    - Create `src/utils/validators.ts` with: `validateEmail`, `validatePassword`, `validateLuhn`, `validateCVV`, `validateCardExpiry`, `validateShippingForm`, `validatePaymentForm`
    - Implement Luhn algorithm for card number validation
    - Implement email format validation (RFC 5322 simplified)
    - Implement password length validation (8-64 characters)
    - Implement card expiry check against current date
    - _Requirements: 5.1, 5.8, 8.4, 8.5, 8.6, 8.7_

  - [x] 1.4 Implement pure utility functions (formatters and search)
    - Create `src/utils/formatters.ts` with: `formatCurrency`, `formatDateKorean`, `formatDateEnglish`, `formatDate`, `truncateText`
    - Create `src/utils/search.ts` with: `searchProducts`, `filterByCategory`, `sortProducts`
    - Create `src/utils/pagination.ts` with: `paginateItems`
    - Create `src/utils/order.ts` with: `generateOrderId`, `calculateEstimatedDelivery`, `calculateOrderTotal`
    - _Requirements: 3.4, 3.7, 4.1, 4.2, 7.7, 7.8, 10.2, 10.3, 11.7, 11.8_

  - [ ]* 1.5 Write property tests for validators
    - **Property 9: Luhn Validation** — verify `validateLuhn` returns true iff the Luhn checksum is divisible by 10
    - **Property 10: Card Expiry Validation** — verify expired dates return false, current/future return true
    - **Property 11: Payment Form Field Validation** — verify error count equals number of violated constraints
    - **Property 14: Registration Validation** — verify invalid emails and out-of-range passwords are rejected
    - **Validates: Requirements 5.1, 5.8, 8.4, 8.5, 8.6, 8.7**

  - [ ]* 1.6 Write property tests for formatters, search, and pagination
    - **Property 1: Pagination Invariant** — verify page size bounds, union of pages equals original list, no duplicates
    - **Property 2: Sort Correctness** — verify adjacent pair ordering for all sort options
    - **Property 3: Search Correctness** — verify all results contain query substring and no matching products are omitted
    - **Property 4: Category Filter Correctness** — verify all filtered products belong to the selected category
    - **Property 7: Currency Formatting** — verify ₩ prefix with 3-digit comma grouping, no decimals
    - **Property 8: Date Formatting by Language** — verify Korean and English date formats match expected patterns
    - **Property 12: Order ID Format** — verify generated IDs match `^ORD-\d{8}-\d{5}$`
    - **Property 13: Estimated Delivery Calculation** — verify 3-5 business days excluding weekends
    - **Property 16: Text Truncation** — verify truncation behavior at boundary
    - **Validates: Requirements 3.3, 3.4, 3.7, 4.1, 4.2, 7.7, 7.8, 10.2, 10.3, 11.7, 11.8**

- [x] 2. Implement data layer and i18n
  - [x] 2.1 Generate dummy product data
    - Create `src/data/products.ts` with a seed-based generator producing ~200 K-POP and ~200 K-WEBTOON products
    - Distribute products across 7 sub-categories each (~28-29 per sub-category)
    - Include K-POP sub-categories: Albums, Photocards, Light Sticks, Apparel, Accessories, Posters, Stationery
    - Include K-WEBTOON sub-categories: Figures, Art Books, Apparel, Phone Cases, Stickers, Keychains, Home Decor
    - Generate prices between ₩5,000–₩150,000, mark ~10% as out of stock
    - Create `src/data/categories.ts` with the category hierarchy
    - Create `src/data/demo.ts` with demo user, demo address, demo card, and 3 demo orders
    - _Requirements: 2.3, 2.4, 3.1, 3.3, 5.3, 5.4, 8.9, 9.3_

  - [x] 2.2 Set up i18n with Korean and English translations
    - Create `src/i18n/ko.json` with all Korean UI strings (labels, buttons, messages, error messages)
    - Create `src/i18n/en.json` with all English UI strings
    - Create `src/i18n/index.ts` configuring i18next with react-i18next, defaulting to Korean
    - Ensure all error messages from the Error Handling table are included in both languages
    - _Requirements: 10.1, 10.4, 11.1, 11.2, 11.3, 11.4_

  - [ ]* 2.3 Write property test for translation completeness
    - **Property 17: Translation Completeness** — verify every key in ko.json exists in en.json and vice versa
    - **Validates: Requirements 11.3**

- [ ] 3. Implement Zustand stores
  - [x] 3.1 Implement Cart Store with localStorage persistence
    - Create `src/stores/cartStore.ts` using Zustand with `persist` middleware
    - Implement `addItem` (quantity capping at 99), `removeItem`, `updateQuantity`, `clearCart`, `getTotal`, `getItemCount`
    - Handle localStorage corruption: if parsing fails, reset to empty cart
    - _Requirements: 6.1, 6.2, 6.3, 6.5, 6.6, 6.7_

  - [x] 3.2 Implement Auth Store with demo session
    - Create `src/stores/authStore.ts` using Zustand with `persist` middleware
    - Implement `login` (checks against demo credentials and registered users), `register`, `logout`, `initDemoSession`
    - Pre-filled session: auto-authenticate as "데모 사용자" on fresh session
    - Return generic error on invalid login (not field-specific)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [x] 3.3 Implement Order Store with demo orders
    - Create `src/stores/orderStore.ts` using Zustand with `persist` middleware
    - Implement `createOrder` (generates order ID, calculates delivery date, adds ₩3,000 shipping), `getOrderById`, `initDemoOrders`
    - Initialize 3 demo orders with statuses: 배송준비중, 배송중, 배송완료
    - _Requirements: 7.6, 7.7, 7.8, 9.1, 9.3_

  - [x] 3.4 Implement Language Store
    - Create `src/stores/languageStore.ts` using Zustand with `persist` middleware
    - Implement `setLanguage`, `toggle` — syncs with i18next `changeLanguage`
    - Update HTML `lang` attribute on language change
    - Default to 'ko' when no preference stored
    - _Requirements: 10.4, 11.2, 11.4, 11.6_

  - [ ]* 3.5 Write property tests for Cart Store
    - **Property 5: Cart Addition and Quantity** — verify add behavior for new items, existing items, and at max (99)
    - **Property 6: Cart Arithmetic Integrity** — verify total equals sum of subtotals, item count is correct, removal adjusts total
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.5, 6.6, 6.7**

  - [ ]* 3.6 Write property test for Language Store state preservation
    - **Property 15: Language Switch Preserves Application State** — verify toggling language does not alter cart contents or checkout progress
    - **Validates: Requirements 11.5, 11.9**

- [x] 4. Checkpoint - Core logic verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement layout and navigation components
  - [x] 5.1 Implement AppShell, Header, and Footer components
    - Create `src/components/layout/AppShell.tsx` wrapping all pages with Header and Footer
    - Create `src/components/layout/Header.tsx` with logo "카타콤", search bar, language toggle, user account link, cart icon with badge
    - Create `src/components/layout/Footer.tsx` with company name, address, customer service links, and Visa payment icon
    - Apply blue theme via CSS Modules (`Header.module.css`, `Footer.module.css`)
    - Make header sticky (fixed at top on scroll)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 5.2 Implement CategoryMenu with Amazon-style hover sub-menus
    - Create `src/components/common/CategoryMenu.tsx` displaying "K-POP Goods" and "K-WEBTOON Goods"
    - Create `src/components/common/SubMenuPanel.tsx` showing sub-categories on hover
    - Implement 200ms hover delay before showing sub-menu, 300ms delay before closing on mouse leave
    - Implement tap-to-open for touch devices (detect via `@media (hover: none)` or pointer events)
    - Visible and operable from every page (rendered in Header or below Header)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.7, 2.8_

  - [x] 5.3 Implement LanguageToggle and SearchBar components
    - Create `src/components/common/LanguageToggle.tsx` showing "한국어" / "English", toggles language via store
    - Create `src/components/common/SearchBar.tsx` with input and submit, validates minimum 2 characters
    - Wire SearchBar to navigate to `/search?q=:query` on submit
    - _Requirements: 4.1, 4.5, 11.1, 11.3_

- [x] 6. Implement product browsing pages
  - [x] 6.1 Implement ProductCard and ProductGrid components
    - Create `src/components/product/ProductCard.tsx` displaying image, truncated name (40 chars), price (₩ formatted), and "Add to Cart" button
    - Disable "Add to Cart" button for out-of-stock products
    - Create `src/components/product/ProductGrid.tsx` rendering cards in a responsive grid (min 3 columns on desktop)
    - Create `src/components/product/Pagination.tsx` with page numbers, previous/next buttons
    - _Requirements: 3.2, 3.3, 3.4, 3.8_

  - [x] 6.2 Implement ProductListingPage with sorting and pagination
    - Create `src/pages/ProductListingPage.tsx` at route `/category/:mainCategory/:subCategory?`
    - Fetch products by category using `filterByCategory`, apply sort via `sortProducts`, paginate with `paginateItems` (20 per page)
    - Add sort dropdown (price low→high, price high→low, name A-Z, newest first as default)
    - _Requirements: 2.5, 3.2, 3.4, 3.7_

  - [x] 6.3 Implement ProductDetailPage
    - Create `src/pages/ProductDetailPage.tsx` at route `/product/:productId`
    - Display product image, full name, description, price, stock status ("재고 있음" / "품절"), and "Add to Cart" button
    - Disable "Add to Cart" for out-of-stock, show 404 message for non-existent product IDs
    - _Requirements: 3.5, 3.6, 3.8_

  - [x] 6.4 Implement SearchResultsPage
    - Create `src/pages/SearchResultsPage.tsx` at route `/search`
    - Read query param `q`, run `searchProducts`, display results in ProductGrid with pagination
    - Show "검색 결과가 없습니다" if no results, show minimum length message if query < 2 chars
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 6.5 Implement HomePage
    - Create `src/pages/HomePage.tsx` at route `/`
    - Display hero banner with 카타콤 branding, featured products section, and category quick links
    - _Requirements: 1.1, 1.2_

- [x] 7. Implement cart and checkout flow
  - [x] 7.1 Implement CartPage
    - Create `src/pages/CartPage.tsx` at route `/cart`
    - Create `src/components/cart/CartItemRow.tsx` with image, name, unit price, quantity selector (1-99), subtotal, and remove button
    - Create `src/components/cart/CartSummary.tsx` displaying total and "Checkout" button
    - Show "장바구니가 비어있습니다" with continue shopping link when empty
    - Disable checkout button when cart is empty
    - _Requirements: 6.4, 6.5, 6.6, 6.8_

  - [x] 7.2 Implement CheckoutPage with multi-step flow
    - Create `src/pages/CheckoutPage.tsx` at route `/checkout` with step state management (shipping → payment → confirmation)
    - Create `src/components/checkout/StepIndicator.tsx` showing progress through steps
    - Create `src/components/checkout/ShippingForm.tsx` with fields: recipient name, street, city, postal code, phone (required), delivery notes (optional)
    - Pre-populate shipping fields with demo user's address in Pre_Filled_Session
    - Validate required fields on "Next" click using `validateShippingForm`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 7.3 Implement PaymentForm with Visa validation
    - Create `src/components/checkout/PaymentForm.tsx` with card number, cardholder name, expiry (MM/YY), CVV fields
    - Display Visa logo and accepted card badge
    - Pre-fill with demo card info in Pre_Filled_Session
    - Validate using `validatePaymentForm` (Luhn check, expiry, CVV format, required fields)
    - On valid submission: show "결제 처리 중..." loading indicator for 2 seconds, disable submit button
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9_

  - [x] 7.4 Implement OrderConfirmation component
    - Create `src/components/checkout/OrderConfirmation.tsx` displaying order number (ORD-YYYYMMDD-XXXXX), ordered items summary, total charged, estimated delivery (3-5 business days)
    - Clear cart after successful order creation
    - _Requirements: 7.7, 7.8_

- [ ] 8. Implement auth and order history pages
  - [x] 8.1 Implement LoginPage and RegisterPage
    - Create `src/pages/LoginPage.tsx` at route `/login` with email and password fields
    - Pre-fill demo credentials (demo@catacomb.kr / demo1234) on page load
    - Show generic error on invalid credentials
    - Create `src/pages/RegisterPage.tsx` at route `/register` with email, password, name, and address fields
    - Validate with field-specific error messages using `validateEmail`, `validatePassword`
    - _Requirements: 5.1, 5.2, 5.3, 5.6, 5.7, 5.8_

  - [x] 8.2 Implement OrderHistoryPage and OrderDetailPage
    - Create `src/pages/OrderHistoryPage.tsx` at route `/orders` listing past orders (date descending) with order number, date (Korean format), total, and status badge
    - Create `src/pages/OrderDetailPage.tsx` at route `/orders/:orderId` showing full order details with items, shipping address, and "Reorder" button per item
    - Show "주문 내역이 없습니다" with continue shopping link when no orders
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 9. Implement routing, error boundaries, and responsive layout
  - [x] 9.1 Set up React Router with all routes and 404 page
    - Create `src/App.tsx` with React Router configuration for all page routes
    - Create `src/pages/NotFoundPage.tsx` for 404 with link back to home
    - Initialize demo session (auth store `initDemoSession`, order store `initDemoOrders`) in App mount
    - _Requirements: 3.5, 5.4_

  - [x] 9.2 Implement Error Boundary and state recovery
    - Create `src/components/common/ErrorBoundary.tsx` wrapping the app
    - Display friendly error message in current language with "홈으로 돌아가기" / "Return to Home" button
    - Implement localStorage corruption recovery in stores (reset to defaults on parse failure)
    - Handle invalid product references in cart (remove stale items)
    - _Requirements: 1.5 (no overflow), error handling design section_

  - [x] 9.3 Apply responsive layout and blue theme refinements
    - Ensure all content renders without horizontal scrolling on 1024px–1920px viewports
    - Verify product grid has minimum 3 columns on desktop
    - Apply consistent blue theme to header, navigation, primary buttons
    - Neutral/light background for page content areas
    - _Requirements: 1.2, 1.5, 3.2_

- [x] 10. Final checkpoint - Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The project uses TypeScript throughout with Vite for builds, Zustand for state, and i18next for bilingual support
- All product data is static (generated at build time) with no backend required
- localStorage persistence enables state survival across page reloads

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "1.4", "2.1", "2.2"] },
    { "id": 3, "tasks": ["1.5", "1.6", "2.3", "3.1", "3.2", "3.3", "3.4"] },
    { "id": 4, "tasks": ["3.5", "3.6", "5.1", "5.2", "5.3"] },
    { "id": 5, "tasks": ["6.1"] },
    { "id": 6, "tasks": ["6.2", "6.3", "6.4", "6.5"] },
    { "id": 7, "tasks": ["7.1"] },
    { "id": 8, "tasks": ["7.2", "8.1", "8.2"] },
    { "id": 9, "tasks": ["7.3"] },
    { "id": 10, "tasks": ["7.4", "9.1"] },
    { "id": 11, "tasks": ["9.2", "9.3"] }
  ]
}
```
