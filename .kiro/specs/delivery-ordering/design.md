# Design Document

## Overview

The delivery ordering feature extends the existing Cape of Good Hope restaurant application with e-commerce capabilities. The design integrates seamlessly with the current menu system, adding shopping cart functionality, order management, and checkout processes while maintaining the existing Russian language interface and visual design patterns.

The solution leverages React Context for state management, extends existing TypeScript interfaces, and follows the established component architecture patterns. The design prioritizes user experience with persistent cart state, real-time total calculations, and intuitive navigation between menu browsing and cart management.

## Architecture

### State Management Architecture

The delivery ordering system uses React Context API for global state management:

- **CartContext**: Manages cart items, quantities, and cart operations
- **OrderContext**: Handles checkout process, delivery time selection, and order submission
- **Local Storage Integration**: Persists cart state across browser sessions

### Component Hierarchy

```
App
├── CartProvider (Context)
├── OrderProvider (Context)
├── Navbar (enhanced with cart icon)
├── Routes
│   ├── Menu (enhanced with add-to-cart functionality)
│   │   ├── ProductDrawer (enhanced with cart actions)
│   │   └── MenuCategories (existing)
│   ├── Cart (new page)
│   │   ├── CartItems
│   │   ├── CartSummary
│   │   └── CheckoutButton
│   └── Checkout (new page)
│       ├── DeliveryTimeSelector
│       ├── ContactForm
│       └── OrderSummary
```

### Data Flow

1. **Add to Cart**: Menu → CartContext → Local Storage → Navbar Update
2. **Cart Management**: Cart Page → CartContext → Real-time Calculations
3. **Checkout**: Cart → Checkout Page → Order Submission → Confirmation
4. **Persistence**: All cart operations sync with localStorage

## Components and Interfaces

### Core Data Models

```typescript
interface MenuItem {
	id: number
	name: string
	composition: string
	legend: string
	weight: string
	price: string
	imageUrl: string
	category: string
}

interface CartItem {
	id: number
	menuItem: MenuItem
	quantity: number
	subtotal: number
}

interface DeliveryTimeSlot {
	id: string
	date: string
	timeRange: string
	available: boolean
}

interface OrderDetails {
	items: CartItem[]
	subtotal: number
	deliveryFee: number
	total: number
	deliveryTime: DeliveryTimeSlot
	customerInfo: {
		name: string
		phone: string
		address: string
	}
}
```

### Context Interfaces

```typescript
interface CartContextType {
	items: CartItem[]
	itemCount: number
	subtotal: number
	addItem: (menuItem: MenuItem) => void
	removeItem: (itemId: number) => void
	updateQuantity: (itemId: number, quantity: number) => void
	clearCart: () => void
}

interface OrderContextType {
	deliveryFee: number
	total: number
	selectedTimeSlot: DeliveryTimeSlot | null
	availableTimeSlots: DeliveryTimeSlot[]
	selectTimeSlot: (slot: DeliveryTimeSlot) => void
	submitOrder: (orderDetails: OrderDetails) => Promise<string>
}
```

### Enhanced Components

#### Enhanced Navbar

- Adds cart icon with item count badge
- Uses ShoppingCart icon from Lucide React
- Displays cart count when items > 0
- Links to cart page on click

#### Enhanced ProductDrawer

- Integrates "Add to Cart" button
- Shows current cart quantity for the item
- Provides quantity adjustment controls
- Maintains existing product information display

#### New Cart Page

- Displays all cart items with images, names, quantities
- Provides quantity adjustment and remove functionality
- Shows subtotal, delivery fee, and total calculations
- Includes "Proceed to Checkout" button
- Handles empty cart state with appropriate messaging

#### New Checkout Page

- Delivery time slot selection with today/tomorrow options
- Customer information form with validation
- Order summary with final totals
- Order submission and confirmation handling

## Data Models

### Menu Item Standardization

All existing menu category data will be standardized to the `MenuItem` interface:

```typescript
// Existing desserts data structure enhanced
const menuItems: MenuItem[] = [
	{
		id: 1,
		name: '«Тысяча леппестков» Мильфей',
		composition: 'слоеное тесто, заварной крем,ягодный соус, сезонные фрукты',
		legend: 'По легенде десерт появился в Петербурге...',
		weight: '200 г',
		price: '440.-',
		imageUrl: '/assets/dessert-1.jpg',
		category: 'desserts',
	},
	// ... other items
]
```

### Cart State Structure

```typescript
interface CartState {
	items: CartItem[]
	lastUpdated: string
	version: number // for future migration compatibility
}
```

### Order Processing

```typescript
interface OrderSubmission {
	orderId: string
	items: CartItem[]
	customerInfo: CustomerInfo
	deliveryTime: DeliveryTimeSlot
	totals: {
		subtotal: number
		deliveryFee: number
		total: number
	}
	timestamp: string
	status: 'pending' | 'confirmed' | 'preparing' | 'delivered'
}
```

## Error Handling

### Cart Operations

- **Add Item Failures**: Display toast notification, maintain previous state
- **Quantity Updates**: Validate positive integers, handle edge cases
- **Storage Failures**: Graceful degradation with in-memory state
- **Network Issues**: Retry mechanisms for order submission

### Checkout Process

- **Form Validation**: Real-time validation with clear error messages
- **Time Slot Conflicts**: Handle unavailable slots with alternative suggestions
- **Order Submission**: Comprehensive error handling with user feedback
- **Payment Integration**: Prepared structure for future payment gateway integration

### Data Consistency

- **Cart Synchronization**: Ensure localStorage and context state alignment
- **Price Updates**: Handle potential price changes during session
- **Inventory Checks**: Framework for future inventory validation

## Testing Strategy

### Unit Testing

- **Context Providers**: Test state management logic and operations
- **Cart Operations**: Verify add, remove, update quantity functionality
- **Calculations**: Test subtotal, delivery fee, and total computations
- **Form Validation**: Validate customer information input handling

### Integration Testing

- **Cart Flow**: End-to-end cart operations from menu to checkout
- **State Persistence**: Verify localStorage integration and recovery
- **Navigation**: Test routing between menu, cart, and checkout pages
- **Order Submission**: Mock API integration and response handling

### Component Testing

- **Enhanced ProductDrawer**: Test cart integration with existing functionality
- **Cart Page**: Verify item display, quantity controls, and calculations
- **Checkout Form**: Test form validation and submission flow
- **Navbar**: Test cart icon updates and navigation

### User Experience Testing

- **Mobile Responsiveness**: Ensure cart functionality works on all screen sizes
- **Performance**: Test with large cart quantities and menu datasets
- **Accessibility**: Verify keyboard navigation and screen reader compatibility
- **Error Scenarios**: Test network failures, invalid inputs, and edge cases

### Russian Language Support

- **Localization**: Verify all new text elements use Russian language
- **Number Formatting**: Ensure price and quantity displays match existing patterns
- **Date/Time Display**: Format delivery time slots appropriately for Russian locale
