# Implementation Plan

- [x] 1. Create core data models and interfaces

  - Define TypeScript interfaces for MenuItem, CartItem, DeliveryTimeSlot, and OrderDetails
  - Create utility functions for price parsing and calculations
  - Set up constants for delivery fees and time slot configurations
  - _Requirements: 1.1, 2.1, 3.1, 4.1_

- [x] 2. Implement cart context and state management

  - Create CartContext with React Context API
  - Implement cart operations: addItem, removeItem, updateQuantity, clearCart
  - Add localStorage integration for cart persistence
  - Write unit tests for cart operations and state management
  - _Requirements: 1.2, 1.3, 2.2, 2.5_

- [x] 3. Standardize menu data structure across all categories

  - Update existing menu data files to use consistent MenuItem interface
  - Create utility functions to transform existing data structures
  - Ensure all menu categories (appetizers, salads, soups, etc.) use the same format
  - Write tests for data transformation utilities
  - _Requirements: 1.1_

- [x] 4. Enhance ProductDrawer with cart functionality

  - Add "Add to Cart" button to ProductDrawer component
  - Implement quantity controls for items already in cart
  - Show current cart quantity for the displayed item
  - Integrate with CartContext for cart operations
  - Write component tests for cart integration
  - _Requirements: 1.1, 1.2, 2.1, 2.2_

- [x] 5. Update Navbar with cart icon and counter

  - Add shopping cart icon using Lucide React
  - Display item count badge when cart has items
  - Implement navigation to cart page on icon click
  - Style cart icon to match existing navbar design
  - Write tests for cart icon display and navigation
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 6. Create cart page with item management

  - Build cart page component with item list display
  - Implement quantity adjustment controls for each cart item
  - Add remove item functionality with confirmation
  - Handle empty cart state with appropriate messaging
  - Write component tests for cart item management
  - _Requirements: 1.4, 2.1, 2.2, 2.3, 2.4, 1.5_

- [x] 7. Implement cart calculations and totals display

  - Create calculation utilities for subtotal, delivery fee, and total
  - Implement real-time total updates when cart changes
  - Add delivery fee logic with potential free delivery thresholds
  - Display itemized cost breakdown in cart summary
  - Write unit tests for calculation functions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 8. Create delivery time selection system

  - Build DeliveryTimeSlot data structure and generation logic
  - Create time slot selector component with today/tomorrow options
  - Implement time slot availability management
  - Add selected time slot display in order summary
  - Write tests for time slot generation and selection
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 9. Build checkout page with customer information form

  - Create checkout page component with form sections
  - Implement customer information form with validation
  - Add delivery address input with validation
  - Integrate delivery time selection into checkout flow
  - Write form validation tests and user interaction tests
  - _Requirements: 6.1, 6.2, 4.5_

- [x] 10. Implement order submission and confirmation

  - Create order submission logic with error handling
  - Build order confirmation page with order number display
  - Implement cart clearing after successful order
  - Add error handling for failed order submissions
  - Write integration tests for complete order flow
  - _Requirements: 6.3, 6.4, 6.5_

- [x] 11. Add routing for new cart and checkout pages

  - Update React Router configuration to include cart and checkout routes
  - Ensure proper navigation flow between menu, cart, and checkout
  - Add route protection to prevent direct checkout access without items
  - Test navigation flow and route accessibility
  - _Requirements: 5.2, 4.5, 6.1_

- [x] 12. Integrate cart functionality across all menu categories

  - Update all menu category components (appetizers, salads, soups, etc.) to use enhanced ProductDrawer
  - Ensure consistent cart functionality across all menu items
  - Test cart operations from different menu categories
  - Verify cart state persistence during menu navigation
  - _Requirements: 1.1, 1.2, 2.5_

- [x] 13. Implement comprehensive error handling and user feedback

  - Add toast notifications for cart operations
  - Implement error boundaries for cart and checkout components
  - Create user-friendly error messages for network failures
  - Add loading states for order submission
  - Write tests for error scenarios and recovery
  - _Requirements: 6.5, 2.4_

- [x] 14. Add responsive design and mobile optimization

  - Ensure cart page works properly on mobile devices
  - Optimize checkout form for mobile input
  - Test cart icon and navigation on different screen sizes
  - Verify touch interactions for quantity controls
  - Write responsive design tests
  - _Requirements: 5.1, 5.2_

- [ ] 15. Create end-to-end integration tests
  - Write tests for complete user journey from menu browsing to order completion
  - Test cart persistence across browser sessions
  - Verify order submission and confirmation flow
  - Test error recovery and edge cases
  - Ensure all requirements are covered by integration tests
  - _Requirements: All requirements validation_
