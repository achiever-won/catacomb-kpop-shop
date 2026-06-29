# Requirements Document

## Introduction

카타콤 (Catacomb) is a demo home shopping site specializing in K-POP and K-WEBTOON merchandise/goods. The site provides a full e-commerce experience including product browsing with Amazon-style category navigation, shopping cart management, user accounts, and checkout with Visa payment integration. The site uses a blue color theme and features approximately 200 dummy products per category to simulate a realistic shopping environment. Since this is a demo, user authentication is pre-filled to simulate an already-logged-in state.

## Glossary

- **Catacomb_Site**: The 카타콤 demo e-commerce web application
- **Product_Catalog**: The collection of all dummy merchandise organized by categories and sub-categories
- **Category_Menu**: The Amazon-style hierarchical navigation menu with main categories and detailed sub-menus
- **Shopping_Cart**: The temporary storage for products a user intends to purchase
- **Checkout_Flow**: The multi-step process from cart review through payment completion
- **Visa_Payment_Gateway**: The simulated Visa card payment processing interface
- **User_Account**: The registered user profile containing personal and login information
- **Pre_Filled_Session**: The demo authentication state where login credentials are automatically populated
- **Product_Card**: The visual component displaying a single product's image, name, price, and quick-action buttons
- **Sub_Menu**: A secondary navigation panel showing detailed category breakdowns within a main category
- **Language_Toggle**: The UI control in the header that allows switching the site interface between Korean (한국어) and English

## Requirements

### Requirement 1: Site Layout and Blue Theme

**User Story:** As a visitor, I want the site to have a professional blue-themed design with clear branding, so that I can immediately recognize the 카타콤 brand and navigate comfortably.

#### Acceptance Criteria

1. THE Catacomb_Site SHALL display the company name "카타콤" and logo in the site header, where both are visible without scrolling on initial page load
2. THE Catacomb_Site SHALL use a blue color palette as the primary theme, where the header, navigation, and primary action buttons use blue-family hues and the overall page background uses a neutral or light complementary color
3. THE Catacomb_Site SHALL include a header present on every page containing the logo, search bar, user account link, and cart icon arranged in a single horizontal bar
4. THE Catacomb_Site SHALL include a footer present on every page containing the company name, business address, customer service links, and payment method icons (including Visa)
5. THE Catacomb_Site SHALL render all page content without horizontal scrolling or element overflow on viewports from 1024 pixels wide up to 1920 pixels wide
6. WHILE the page is scrolled, THE Catacomb_Site SHALL keep the header visible at the top of the viewport

### Requirement 2: Amazon-Style Category Menu Navigation

**User Story:** As a shopper, I want to browse products through a hierarchical menu with detailed sub-menus, so that I can quickly find merchandise in specific categories.

#### Acceptance Criteria

1. THE Category_Menu SHALL display main categories "K-POP Goods" and "K-WEBTOON Goods" as top-level items
2. WHEN a user hovers over a main category for at least 200 milliseconds, THE Category_Menu SHALL display a Sub_Menu panel showing the sub-categories for that category within 300 milliseconds
3. THE Sub_Menu for "K-POP Goods" SHALL include the following sub-categories: Albums, Photocards, Light Sticks, Apparel, Accessories, Posters, and Stationery
4. THE Sub_Menu for "K-WEBTOON Goods" SHALL include the following sub-categories: Figures, Art Books, Apparel, Phone Cases, Stickers, Keychains, and Home Decor
5. WHEN a user clicks a sub-category, THE Catacomb_Site SHALL navigate to a product listing page displaying only products belonging to that sub-category
6. THE Category_Menu SHALL be visible and operable from every page of the Catacomb_Site without requiring navigation to a different page
7. WHEN a user moves the pointer away from both the main category item and the Sub_Menu panel for more than 300 milliseconds, THE Category_Menu SHALL close the Sub_Menu panel
8. IF the user is on a touch device where hover is unavailable, THEN THE Category_Menu SHALL display the Sub_Menu panel upon tap of a main category item

### Requirement 3: Product Catalog with Dummy Data

**User Story:** As a shopper, I want to see a large selection of products in each category, so that the site feels like a real, fully-stocked e-commerce store.

#### Acceptance Criteria

1. THE Product_Catalog SHALL contain between 180 and 220 dummy products per main category, with each product assigned to one sub-category within its main category
2. WHEN a product listing page loads, THE Catacomb_Site SHALL display Product_Cards in a grid layout with a minimum of 3 columns on desktop viewports
3. THE Product_Card SHALL display the product image, product name (truncated to 40 characters with ellipsis if longer), price in KRW (₩), and an "Add to Cart" button
4. THE Product_Catalog SHALL support pagination with 20 products per page, displaying page number controls, previous button, and next button below the product grid
5. WHEN a user clicks a Product_Card, THE Catacomb_Site SHALL navigate to a product detail page for the selected product
6. THE product detail page SHALL display the product image, name, description, price in KRW (₩), stock status as either "재고 있음" (In Stock) or "품절" (Out of Stock), and an "Add to Cart" button
7. THE Product_Catalog SHALL support sorting by price (low to high, high to low) and by name (alphabetical A-Z), with the default sort order being newest first when no sort option is selected
8. IF a product has a stock status of "품절" (Out of Stock), THEN THE Catacomb_Site SHALL disable the "Add to Cart" button on both the Product_Card and the product detail page

### Requirement 4: Product Search

**User Story:** As a shopper, I want to search for specific products by keyword, so that I can find items without browsing through categories.

#### Acceptance Criteria

1. WHEN a user enters a search term of at least 2 characters and submits the search form, THE Catacomb_Site SHALL display products matching the search term in a results page
2. THE search functionality SHALL perform a case-insensitive partial match against product name and product description fields
3. THE search results page SHALL display matching products using the same Product_Card grid layout with pagination of 20 products per page
4. IF no products match the search term, THEN THE Catacomb_Site SHALL display a "검색 결과가 없습니다" (No results found) message
5. IF a user submits the search form with fewer than 2 characters, THEN THE Catacomb_Site SHALL display a message indicating the minimum search term length requirement

### Requirement 5: User Registration and Login with Pre-Filled Demo State

**User Story:** As a demo user, I want the site to appear as if I am already logged in, so that I can immediately experience the full shopping flow without manual registration.

#### Acceptance Criteria

1. THE Catacomb_Site SHALL provide a user registration form with fields for email (maximum 254 characters), password (minimum 8 characters, maximum 64 characters), name (maximum 50 characters), and shipping address (street address, city, postal code)
2. THE Catacomb_Site SHALL provide a login form with fields for email and password
3. WHEN the login page loads, THE Pre_Filled_Session SHALL auto-populate the email and password fields with demo credentials so the user can submit without typing
4. WHEN the Catacomb_Site loads in a new browser session, THE Pre_Filled_Session SHALL simulate an authenticated state showing "Demo User" as the logged-in user in the header
5. WHILE a user is in the Pre_Filled_Session state, THE Catacomb_Site SHALL display the user name and a logout option in the header
6. WHEN a user clicks logout, THE Catacomb_Site SHALL clear the session and show login/register options in the header
7. IF a user submits the login form with credentials that do not match any registered account or the demo account, THEN THE Catacomb_Site SHALL display an error message indicating invalid email or password without specifying which field is incorrect
8. IF a user submits the registration form with an email that is not in valid email format or a password shorter than 8 characters, THEN THE Catacomb_Site SHALL display a validation error message indicating the specific field requirement that was not met

### Requirement 6: Shopping Cart Management

**User Story:** As a shopper, I want to add products to my cart and manage quantities, so that I can prepare my purchase before checkout.

#### Acceptance Criteria

1. WHEN a user clicks "Add to Cart" on a Product_Card or product detail page, THE Shopping_Cart SHALL add the selected product with a quantity of 1 and display a confirmation message or visual indicator
2. WHEN a product already exists in the Shopping_Cart and the user adds the same product again, THE Shopping_Cart SHALL increment the quantity by 1 up to a maximum of 99 per item
3. IF a user attempts to add more than 99 of the same product, THEN THE Shopping_Cart SHALL not increment the quantity and SHALL display a message indicating the maximum quantity has been reached
4. THE Shopping_Cart page SHALL display each item with its image, name, unit price, quantity selector (allowing values from 1 to 99), and subtotal (unit price × quantity)
5. WHEN a user changes the quantity of a cart item, THE Shopping_Cart SHALL update the item subtotal and the cart total within 500 milliseconds
6. WHEN a user removes an item from the Shopping_Cart, THE Shopping_Cart SHALL delete the item and recalculate the cart total
7. THE Shopping_Cart SHALL display the total number of distinct items as a badge on the cart icon in the header
8. IF the Shopping_Cart is empty, THEN THE Catacomb_Site SHALL display a message "장바구니가 비어있습니다" (Your cart is empty) with a link to continue shopping

### Requirement 7: Checkout Flow

**User Story:** As a shopper, I want a clear multi-step checkout process, so that I can review my order, enter shipping info, and complete payment confidently.

#### Acceptance Criteria

1. WHEN a user clicks "Checkout" from the Shopping_Cart page, THE Checkout_Flow SHALL navigate to a shipping information step displaying a step progress indicator showing the current step as active
2. THE Checkout_Flow shipping step SHALL display a form with required fields for recipient name, address (street, city, postal code), phone number, and an optional delivery notes field
3. IF a user clicks "Next" on the shipping step with any required field empty or invalid, THEN THE Checkout_Flow SHALL highlight the invalid fields and display a validation error for each
4. WHILE in the Pre_Filled_Session state, THE Checkout_Flow SHALL pre-populate shipping fields with the demo user's saved address
5. WHEN a user completes the shipping step and clicks "Next", THE Checkout_Flow SHALL navigate to the payment step
6. THE Checkout_Flow payment step SHALL display an order summary with all items, quantities, subtotals, a shipping fee of ₩3,000, and the grand total in KRW (₩)
7. WHEN a user completes payment, THE Checkout_Flow SHALL display an order confirmation page with a generated order number in the format "ORD-YYYYMMDD-XXXXX"
8. THE order confirmation page SHALL display a summary of ordered items, total amount charged, and estimated delivery date (3-5 business days from order date)

### Requirement 8: Visa Payment Integration

**User Story:** As a shopper, I want to pay using my Visa card, so that I can complete purchases with a familiar payment method.

#### Acceptance Criteria

1. THE Visa_Payment_Gateway SHALL display a payment form with fields for card number (16 digits), cardholder name (maximum 50 characters), expiration date (MM/YY format), and CVV (3 digits)
2. THE Visa_Payment_Gateway SHALL display the Visa logo and accepted card badge
3. WHEN a user submits the payment form with valid card details, THE Visa_Payment_Gateway SHALL simulate a successful payment processing with a 2-second delay
4. IF a user submits the payment form with a card number that is not exactly 16 digits or fails the Luhn check, THEN THE Visa_Payment_Gateway SHALL display a validation error message indicating an invalid card number
5. IF a user submits the payment form with an expiration date earlier than the current month, THEN THE Visa_Payment_Gateway SHALL display a validation error message indicating the card is expired
6. IF a user submits the payment form with any required field empty, THEN THE Visa_Payment_Gateway SHALL highlight the empty fields and display a validation error message indicating that all fields are required
7. IF a user submits the payment form with a CVV that is not exactly 3 digits, THEN THE Visa_Payment_Gateway SHALL display a validation error message indicating an invalid CVV
8. WHEN payment processing is simulated, THE Visa_Payment_Gateway SHALL display a loading indicator with text "결제 처리 중..." (Processing payment...) and disable the submit button until processing completes
9. WHILE in the Pre_Filled_Session state, THE Visa_Payment_Gateway SHALL pre-fill the card number, cardholder name, expiration date, and CVV fields with demo card information

### Requirement 9: Order History

**User Story:** As a returning shopper, I want to view my past orders, so that I can track purchases and reorder items.

#### Acceptance Criteria

1. WHEN a user navigates to the order history page, THE Catacomb_Site SHALL display a list of past orders sorted by date descending (most recent first), showing order number, date in Korean format (YYYY년 MM월 DD일), total amount in KRW (₩), and status where status is one of: 배송준비중 (Preparing), 배송중 (Shipping), 배송완료 (Delivered), or 주문취소 (Cancelled)
2. WHEN a user clicks an order in the list, THE Catacomb_Site SHALL display the order detail including all purchased items with product name, quantity, unit price, and subtotal, as well as the shipping address, order date, order status, and a "Reorder" button for each item that adds that item to the Shopping_Cart
3. WHILE in the Pre_Filled_Session state, THE Catacomb_Site SHALL display 3 sample past orders as demo data with at least two distinct statuses from the defined status values
4. IF a user has no past orders, THEN THE Catacomb_Site SHALL display a message "주문 내역이 없습니다" (No order history) with a link to continue shopping

### Requirement 10: Default Korean Language Interface

**User Story:** As a Korean-speaking user, I want the site interface to default to Korean, so that I can navigate and shop comfortably in my primary language.

#### Acceptance Criteria

1. THE Catacomb_Site SHALL display all static UI labels, buttons, navigation items, and system messages in Korean, while product names and descriptions may contain mixed Korean and English text
2. THE Catacomb_Site SHALL format currency values using the Korean Won format (₩ followed by comma-separated numbers with 3-digit grouping and no decimal places)
3. THE Catacomb_Site SHALL display dates in the Korean format (YYYY년 MM월 DD일)
4. THE Catacomb_Site SHALL set the HTML document lang attribute to "ko" for accessibility compliance

### Requirement 11: Bilingual Language Switching (Korean/English)

**User Story:** As a bilingual or English-speaking user, I want to switch the site interface between Korean and English, so that I can navigate and shop in my preferred language.

#### Acceptance Criteria

1. THE Catacomb_Site SHALL display a language toggle in the site header showing the currently active language as either "한국어" or "English"
2. THE Catacomb_Site SHALL default to Korean (한국어) as the active language when no language preference has been set
3. WHEN a user clicks the language toggle, THE Catacomb_Site SHALL switch all static UI labels, buttons, navigation items, and system messages to the selected language within 500 milliseconds without requiring a full page reload
4. WHEN the language is switched, THE Catacomb_Site SHALL update the HTML document lang attribute to "ko" for Korean or "en" for English
5. THE Catacomb_Site SHALL keep product names and descriptions in their original language regardless of the selected interface language
6. WHILE the user navigates between pages within the same session, THE Catacomb_Site SHALL maintain the selected language preference without reverting to the default language
7. WHEN a user selects English, THE Catacomb_Site SHALL display currency values using the Korean Won format (₩ followed by comma-separated numbers with 3-digit grouping and no decimal places) regardless of the selected language
8. WHEN a user selects English, THE Catacomb_Site SHALL display dates in the format "MMMM DD, YYYY" (for example, "January 15, 2025")
9. IF the language toggle is activated while the Shopping_Cart or Checkout_Flow is in progress, THEN THE Catacomb_Site SHALL switch the interface language without clearing cart contents or resetting checkout progress
