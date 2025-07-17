// Utility functions for delivery ordering system
import type { CartItem, MenuItem, DeliveryTimeSlot } from '@/types/delivery'
import { DELIVERY_CONFIG } from '@/lib/delivery-constants'

/**
 * Parse price string to number
 * Handles Russian price format like "440.-" or "1,200.-"
 */
export function parsePrice(priceString: string): number {
	// Remove currency symbols and handle Russian number format
	let cleanPrice = priceString
		.replace(/[^\d,.-]/g, '') // Remove non-numeric characters except comma, dot, dash
		.replace(/\.-$/, '') // Remove trailing ".-"
		.replace(/-$/, '') // Remove trailing dash
		.replace(/\.$/, '') // Remove trailing dot

	// Handle comma as thousands separator (Russian format)
	// If comma is followed by exactly 3 digits, it's thousands separator
	if (/,\d{3}$/.test(cleanPrice)) {
		cleanPrice = cleanPrice.replace(',', '')
	} else if (cleanPrice.includes(',')) {
		// Otherwise treat comma as decimal separator
		cleanPrice = cleanPrice.replace(',', '.')
	}

	const parsed = parseFloat(cleanPrice)
	return isNaN(parsed) ? 0 : parsed
}

/**
 * Format price number to Russian format
 */
export function formatPrice(price: number): string {
	return `${price.toLocaleString('ru-RU').replace(/\u00A0/g, ' ')}.-`
}

/**
 * Calculate subtotal for cart items
 */
export function calculateSubtotal(items: CartItem[]): number {
	return items.reduce((total, item) => total + item.subtotal, 0)
}

/**
 * Calculate item subtotal based on quantity and price
 */
export function calculateItemSubtotal(
	menuItem: MenuItem,
	quantity: number
): number {
	const itemPrice = parsePrice(menuItem.price)
	return itemPrice * quantity
}

/**
 * Calculate delivery fee based on subtotal
 * Uses constants from delivery-constants.ts
 */
export function calculateDeliveryFee(subtotal: number): number {
	return subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD
		? 0
		: DELIVERY_CONFIG.STANDARD_FEE
}

/**
 * Calculate total order amount
 */
export function calculateTotal(subtotal: number, deliveryFee: number): number {
	return subtotal + deliveryFee
}

/**
 * Check if order meets minimum amount requirement
 */
export function isMinimumOrderMet(subtotal: number): boolean {
	return subtotal >= DELIVERY_CONFIG.MINIMUM_ORDER_AMOUNT
}

/**
 * Calculate remaining amount needed for free delivery
 */
export function calculateFreeDeliveryRemaining(subtotal: number): number {
	const remaining = DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD - subtotal
	return Math.max(0, remaining)
}

/**
 * Calculate free delivery progress percentage (0-100)
 */
export function calculateFreeDeliveryProgress(subtotal: number): number {
	const progress = (subtotal / DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD) * 100
	return Math.min(100, Math.max(0, progress))
}

/**
 * Check if order qualifies for free delivery
 */
export function isFreeDeliveryEligible(subtotal: number): boolean {
	return subtotal >= DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD
}

/**
 * Create cart item from menu item
 */
export function createCartItem(
	menuItem: MenuItem,
	quantity: number = 1
): CartItem {
	return {
		id: menuItem.id,
		menuItem,
		quantity,
		subtotal: calculateItemSubtotal(menuItem, quantity),
	}
}

/**
 * Update cart item quantity and recalculate subtotal
 */
export function updateCartItemQuantity(
	cartItem: CartItem,
	newQuantity: number
): CartItem {
	return {
		...cartItem,
		quantity: newQuantity,
		subtotal: calculateItemSubtotal(cartItem.menuItem, newQuantity),
	}
}

/**
 * Format date to YYYY-MM-DD string in local timezone
 */
function formatDateToLocalString(date: Date): string {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

/**
 * Generate available delivery time slots for today and tomorrow
 */
export function generateDeliveryTimeSlots(): DeliveryTimeSlot[] {
	const slots: DeliveryTimeSlot[] = []
	const now = new Date()
	const today = new Date(now)
	const tomorrow = new Date(now)
	tomorrow.setDate(tomorrow.getDate() + 1)

	// Time slots: 11:00-13:00, 13:00-15:00, 15:00-17:00, 17:00-19:00, 19:00-21:00
	const timeRanges = [
		'11:00-13:00',
		'13:00-15:00',
		'15:00-17:00',
		'17:00-19:00',
		'19:00-21:00',
	]

	// Add today's slots (only future ones)
	const currentHour = now.getHours()
	const currentMinutes = now.getMinutes()

	timeRanges.forEach((timeRange, index) => {
		const slotStartHour = 11 + index * 2
		// Only add slot if it's at least 2 hours in the future
		const minutesUntilSlot =
			slotStartHour * 60 - (currentHour * 60 + currentMinutes)
		const isSlotAvailable = minutesUntilSlot >= 120 // At least 120 minutes (2 hours)

		if (isSlotAvailable) {
			slots.push({
				id: `today-${index}`,
				date: formatDateToLocalString(today),
				timeRange,
				available: true,
			})
		}
	})

	// Add tomorrow's slots (all available)
	timeRanges.forEach((timeRange, index) => {
		slots.push({
			id: `tomorrow-${index}`,
			date: formatDateToLocalString(tomorrow),
			timeRange,
			available: true,
		})
	})

	return slots
}

/**
 * Check if a time slot is still available based on current time
 */
export function isTimeSlotAvailable(slot: DeliveryTimeSlot): boolean {
	const now = new Date()
	const slotDate = new Date(slot.date + 'T00:00:00') // Parse as local time
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

	// If slot is for tomorrow or later, it's available
	if (slotDate > today) {
		return slot.available
	}

	// If slot is for today, check if it's still in the future with 2-hour buffer
	if (slotDate.getTime() === today.getTime()) {
		const [startTime] = slot.timeRange.split('-')
		const [startHour] = startTime.split(':').map(Number)
		const currentHour = now.getHours()
		const currentMinutes = now.getMinutes()

		const minutesUntilSlot =
			startHour * 60 - (currentHour * 60 + currentMinutes)

		return slot.available && minutesUntilSlot >= 120 // At least 120 minutes (2 hours)
	}

	// Past dates are not available
	return false
}

/**
 * Group time slots by date for display
 */
export function groupTimeSlotsByDate(
	slots: DeliveryTimeSlot[]
): Record<string, DeliveryTimeSlot[]> {
	return slots.reduce((groups, slot) => {
		const date = slot.date
		if (!groups[date]) {
			groups[date] = []
		}
		groups[date].push(slot)
		return groups
	}, {} as Record<string, DeliveryTimeSlot[]>)
}

/**
 * Get display label for date (Today/Tomorrow/Date)
 */
export function getDateDisplayLabel(dateString: string): string {
	const date = new Date(dateString + 'T00:00:00') // Parse as local time
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)

	if (date.toDateString() === today.toDateString()) {
		return 'Сегодня'
	} else if (date.toDateString() === tomorrow.toDateString()) {
		return 'Завтра'
	} else {
		return date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
		})
	}
}

/**
 * Format delivery time slot for display
 */
export function formatDeliveryTimeSlot(slot: DeliveryTimeSlot): string {
	const date = new Date(slot.date)
	const today = new Date()
	const tomorrow = new Date(today)
	tomorrow.setDate(tomorrow.getDate() + 1)

	let dayLabel = ''
	if (date.toDateString() === today.toDateString()) {
		dayLabel = 'Сегодня'
	} else if (date.toDateString() === tomorrow.toDateString()) {
		dayLabel = 'Завтра'
	} else {
		dayLabel = date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
		})
	}

	return `${dayLabel}, ${slot.timeRange}`
}

/**
 * Validate customer information
 */
export function validateCustomerInfo(
	info: Partial<{ name: string; phone: string; address: string }>
): {
	isValid: boolean
	errors: Record<string, string>
} {
	const errors: Record<string, string> = {}

	if (!info.name || info.name.trim().length < 2) {
		errors.name = 'Имя должно содержать минимум 2 символа'
	}

	if (
		!info.phone ||
		!/^[\\+]?[0-9\s\-\\(\\)]{10,}$/.test(info.phone.replace(/\s/g, ''))
	) {
		errors.phone = 'Введите корректный номер телефона'
	}

	if (!info.address || info.address.trim().length < 10) {
		errors.address = 'Адрес должен содержать минимум 10 символов'
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	}
}
