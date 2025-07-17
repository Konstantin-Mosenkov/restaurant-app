import { describe, it, expect } from 'vitest'
import {
	parsePrice,
	formatPrice,
	calculateSubtotal,
	calculateItemSubtotal,
	calculateDeliveryFee,
	calculateTotal,
	isMinimumOrderMet,
	calculateFreeDeliveryRemaining,
	calculateFreeDeliveryProgress,
	isFreeDeliveryEligible,
	createCartItem,
	updateCartItemQuantity,
} from '../delivery-utils'
import type { CartItem, MenuItem } from '@/types/delivery'

// Mock menu item for testing
const mockMenuItem: MenuItem = {
	id: 1,
	name: 'Test Pizza',
	composition: 'Test ingredients',
	legend: 'Test legend',
	weight: '300 г',
	price: '500.-',
	imageUrl: '/test.jpg',
	category: 'pizza',
}

const mockMenuItem2: MenuItem = {
	id: 2,
	name: 'Test Salad',
	composition: 'Test ingredients',
	legend: 'Test legend',
	weight: '200 г',
	price: '350.-',
	imageUrl: '/test2.jpg',
	category: 'salads',
}

describe('Price parsing and formatting', () => {
	it('should parse Russian price format correctly', () => {
		expect(parsePrice('500.-')).toBe(500)
		expect(parsePrice('1,200.-')).toBe(1200)
		expect(parsePrice('350.-')).toBe(350)
		expect(parsePrice('2,500.-')).toBe(2500)
	})

	it('should handle various price formats', () => {
		expect(parsePrice('500')).toBe(500)
		expect(parsePrice('500-')).toBe(500)
		expect(parsePrice('500 руб')).toBe(500)
		expect(parsePrice('1,200 руб.')).toBe(1200)
	})

	it('should handle invalid price formats', () => {
		expect(parsePrice('')).toBe(0)
		expect(parsePrice('invalid')).toBe(0)
		expect(parsePrice('abc.-')).toBe(0)
	})

	it('should format price to Russian format', () => {
		expect(formatPrice(500)).toBe('500.-')
		expect(formatPrice(1200)).toBe('1 200.-')
		expect(formatPrice(2500)).toBe('2 500.-')
	})
})

describe('Cart item calculations', () => {
	it('should calculate item subtotal correctly', () => {
		expect(calculateItemSubtotal(mockMenuItem, 1)).toBe(500)
		expect(calculateItemSubtotal(mockMenuItem, 2)).toBe(1000)
		expect(calculateItemSubtotal(mockMenuItem2, 3)).toBe(1050)
	})

	it('should create cart item with correct subtotal', () => {
		const cartItem = createCartItem(mockMenuItem, 2)
		expect(cartItem.id).toBe(1)
		expect(cartItem.quantity).toBe(2)
		expect(cartItem.subtotal).toBe(1000)
		expect(cartItem.menuItem).toBe(mockMenuItem)
	})

	it('should update cart item quantity and recalculate subtotal', () => {
		const cartItem = createCartItem(mockMenuItem, 1)
		const updatedItem = updateCartItemQuantity(cartItem, 3)

		expect(updatedItem.quantity).toBe(3)
		expect(updatedItem.subtotal).toBe(1500)
		expect(updatedItem.id).toBe(cartItem.id)
		expect(updatedItem.menuItem).toBe(cartItem.menuItem)
	})
})

describe('Cart subtotal calculations', () => {
	const cartItems: CartItem[] = [
		createCartItem(mockMenuItem, 2), // 500 * 2 = 1000
		createCartItem(mockMenuItem2, 1), // 350 * 1 = 350
	]

	it('should calculate subtotal for multiple items', () => {
		expect(calculateSubtotal(cartItems)).toBe(1350)
	})

	it('should handle empty cart', () => {
		expect(calculateSubtotal([])).toBe(0)
	})

	it('should handle single item cart', () => {
		const singleItemCart = [createCartItem(mockMenuItem, 1)]
		expect(calculateSubtotal(singleItemCart)).toBe(500)
	})
})

describe('Delivery fee calculations', () => {
	it('should charge standard delivery fee for orders under threshold', () => {
		expect(calculateDeliveryFee(1000)).toBe(300) // Under 2000 threshold
		expect(calculateDeliveryFee(1999)).toBe(300) // Just under threshold
		expect(calculateDeliveryFee(500)).toBe(300) // Well under threshold
	})

	it('should provide free delivery for orders over threshold', () => {
		expect(calculateDeliveryFee(2000)).toBe(0) // Exactly at threshold
		expect(calculateDeliveryFee(2500)).toBe(0) // Over threshold
		expect(calculateDeliveryFee(5000)).toBe(0) // Well over threshold
	})

	it('should handle edge cases', () => {
		expect(calculateDeliveryFee(0)).toBe(300) // Empty cart
		expect(calculateDeliveryFee(-100)).toBe(300) // Negative amount
	})
})

describe('Total calculations', () => {
	it('should calculate total correctly', () => {
		expect(calculateTotal(1000, 300)).toBe(1300)
		expect(calculateTotal(2000, 0)).toBe(2000)
		expect(calculateTotal(1500, 300)).toBe(1800)
	})

	it('should handle zero values', () => {
		expect(calculateTotal(0, 0)).toBe(0)
		expect(calculateTotal(1000, 0)).toBe(1000)
		expect(calculateTotal(0, 300)).toBe(300)
	})
})

describe('Minimum order validation', () => {
	it('should validate minimum order amount', () => {
		expect(isMinimumOrderMet(500)).toBe(true) // Exactly at minimum
		expect(isMinimumOrderMet(600)).toBe(true) // Above minimum
		expect(isMinimumOrderMet(499)).toBe(false) // Below minimum
		expect(isMinimumOrderMet(0)).toBe(false) // Empty cart
	})
})

describe('Free delivery calculations', () => {
	it('should calculate remaining amount for free delivery', () => {
		expect(calculateFreeDeliveryRemaining(1000)).toBe(1000) // 2000 - 1000
		expect(calculateFreeDeliveryRemaining(1500)).toBe(500) // 2000 - 1500
		expect(calculateFreeDeliveryRemaining(2000)).toBe(0) // Already qualified
		expect(calculateFreeDeliveryRemaining(2500)).toBe(0) // Over qualified
	})

	it('should calculate free delivery progress percentage', () => {
		expect(calculateFreeDeliveryProgress(0)).toBe(0) // 0%
		expect(calculateFreeDeliveryProgress(1000)).toBe(50) // 50%
		expect(calculateFreeDeliveryProgress(1500)).toBe(75) // 75%
		expect(calculateFreeDeliveryProgress(2000)).toBe(100) // 100%
		expect(calculateFreeDeliveryProgress(2500)).toBe(100) // Capped at 100%
	})

	it('should check free delivery eligibility', () => {
		expect(isFreeDeliveryEligible(1999)).toBe(false) // Just under
		expect(isFreeDeliveryEligible(2000)).toBe(true) // Exactly at threshold
		expect(isFreeDeliveryEligible(2500)).toBe(true) // Over threshold
		expect(isFreeDeliveryEligible(0)).toBe(false) // Empty cart
	})
})

describe('Integration tests', () => {
	it('should handle complete cart calculation flow', () => {
		// Create a cart with items totaling 1800 (under free delivery threshold)
		const cartItems: CartItem[] = [
			createCartItem(mockMenuItem, 2), // 1000
			createCartItem(mockMenuItem2, 2), // 700
		]

		const subtotal = calculateSubtotal(cartItems) // 1700
		const deliveryFee = calculateDeliveryFee(subtotal) // 300 (not free)
		const total = calculateTotal(subtotal, deliveryFee) // 2000

		expect(subtotal).toBe(1700)
		expect(deliveryFee).toBe(300)
		expect(total).toBe(2000)
		expect(isMinimumOrderMet(subtotal)).toBe(true)
		expect(isFreeDeliveryEligible(subtotal)).toBe(false)
		expect(calculateFreeDeliveryRemaining(subtotal)).toBe(300)
	})

	it('should handle cart qualifying for free delivery', () => {
		// Create a cart with items totaling over 2000
		const cartItems: CartItem[] = [
			createCartItem(mockMenuItem, 4), // 2000
			createCartItem(mockMenuItem2, 1), // 350
		]

		const subtotal = calculateSubtotal(cartItems) // 2350
		const deliveryFee = calculateDeliveryFee(subtotal) // 0 (free)
		const total = calculateTotal(subtotal, deliveryFee) // 2350

		expect(subtotal).toBe(2350)
		expect(deliveryFee).toBe(0)
		expect(total).toBe(2350)
		expect(isMinimumOrderMet(subtotal)).toBe(true)
		expect(isFreeDeliveryEligible(subtotal)).toBe(true)
		expect(calculateFreeDeliveryRemaining(subtotal)).toBe(0)
		expect(calculateFreeDeliveryProgress(subtotal)).toBe(100)
	})
})
