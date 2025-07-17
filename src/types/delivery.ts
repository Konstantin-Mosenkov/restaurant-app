// Core data models for delivery ordering system

export interface MenuItem {
	id: number
	name: string
	composition: string
	legend: string
	weight: string
	price: string
	imageUrl: string
	category: string
}

export interface CartItem {
	id: number
	menuItem: MenuItem
	quantity: number
	subtotal: number
}

export interface DeliveryTimeSlot {
	id: string
	date: string
	timeRange: string
	available: boolean
}

export interface CustomerInfo {
	name: string
	phone: string
	address: string
}

export interface OrderDetails {
	items: CartItem[]
	subtotal: number
	deliveryFee: number
	total: number
	deliveryTime: DeliveryTimeSlot | null
	customerInfo: CustomerInfo
}

// Context interfaces for state management
export interface CartContextType {
	items: CartItem[]
	itemCount: number
	subtotal: number
	deliveryFee: number
	total: number
	addItem: (menuItem: MenuItem) => void
	removeItem: (itemId: number) => void
	updateQuantity: (itemId: number, quantity: number) => void
	clearCart: () => void
}

export interface OrderContextType {
	deliveryFee: number
	total: number
	selectedTimeSlot: DeliveryTimeSlot | null
	availableTimeSlots: DeliveryTimeSlot[]
	selectTimeSlot: (slot: DeliveryTimeSlot) => void
	submitOrder: (orderDetails: OrderDetails) => Promise<string>
}

// Order submission and processing types
export interface OrderSubmission {
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

// Cart state structure for localStorage
export interface CartState {
	items: CartItem[]
	lastUpdated: string
	version: number
}
