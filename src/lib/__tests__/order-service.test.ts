import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
	submitOrder,
	getOrderErrorMessage,
	OrderSubmissionError,
} from '../order-service'
import type {
	OrderDetails,
	MenuItem,
	CartItem,
	DeliveryTimeSlot,
} from '@/types/delivery'

// Mock data
const mockMenuItem: MenuItem = {
	id: 1,
	name: 'Test Pizza',
	composition: 'Test ingredients',
	legend: 'Test legend',
	weight: '300g',
	price: '500.-',
	imageUrl: '/test.jpg',
	category: 'pizza',
}

const mockCartItem: CartItem = {
	id: 1,
	menuItem: mockMenuItem,
	quantity: 2,
	subtotal: 1000,
}

const mockDeliveryTimeSlot: DeliveryTimeSlot = {
	id: 'slot-1',
	date: '2025-07-15',
	timeRange: '12:00-13:00',
	available: true,
}

const mockOrderDetails: OrderDetails = {
	items: [mockCartItem],
	subtotal: 1000,
	deliveryFee: 200,
	total: 1200,
	deliveryTime: mockDeliveryTimeSlot,
	customerInfo: {
		name: 'Test User',
		phone: '+7 999 123 45 67',
		address: 'Test Address, 123',
	},
}

describe('Order Service', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// Reset Math.random to ensure consistent behavior
		vi.spyOn(Math, 'random').mockReturnValue(0.5)
	})

	describe('submitOrder', () => {
		it('should successfully submit a valid order', async () => {
			const orderId = await submitOrder(mockOrderDetails)

			expect(orderId).toBeDefined()
			expect(orderId).toMatch(/^ORD-\d+-[A-Z0-9]+$/)
		})

		it('should throw error for empty order', async () => {
			const emptyOrderDetails = {
				...mockOrderDetails,
				items: [],
			}

			await expect(submitOrder(emptyOrderDetails)).rejects.toThrow(
				new OrderSubmissionError('Заказ не может быть пустым', 'EMPTY_ORDER')
			)
		})

		it('should throw error for missing customer name', async () => {
			const invalidOrderDetails = {
				...mockOrderDetails,
				customerInfo: {
					...mockOrderDetails.customerInfo,
					name: '',
				},
			}

			await expect(submitOrder(invalidOrderDetails)).rejects.toThrow(
				new OrderSubmissionError(
					'Имя обязательно для заполнения',
					'MISSING_NAME'
				)
			)
		})

		it('should throw error for missing phone', async () => {
			const invalidOrderDetails = {
				...mockOrderDetails,
				customerInfo: {
					...mockOrderDetails.customerInfo,
					phone: '',
				},
			}

			await expect(submitOrder(invalidOrderDetails)).rejects.toThrow(
				new OrderSubmissionError(
					'Телефон обязателен для заполнения',
					'MISSING_PHONE'
				)
			)
		})

		it('should throw error for missing address', async () => {
			const invalidOrderDetails = {
				...mockOrderDetails,
				customerInfo: {
					...mockOrderDetails.customerInfo,
					address: '',
				},
			}

			await expect(submitOrder(invalidOrderDetails)).rejects.toThrow(
				new OrderSubmissionError(
					'Адрес доставки обязателен для заполнения',
					'MISSING_ADDRESS'
				)
			)
		})

		it('should throw error for missing delivery time', async () => {
			const invalidOrderDetails = {
				...mockOrderDetails,
				deliveryTime: null,
			}

			await expect(submitOrder(invalidOrderDetails)).rejects.toThrow(
				new OrderSubmissionError(
					'Время доставки должно быть выбрано',
					'MISSING_DELIVERY_TIME'
				)
			)
		})

		it('should throw error for invalid total', async () => {
			const invalidOrderDetails = {
				...mockOrderDetails,
				total: 0,
			}

			await expect(submitOrder(invalidOrderDetails)).rejects.toThrow(
				new OrderSubmissionError(
					'Сумма заказа должна быть больше нуля',
					'INVALID_TOTAL'
				)
			)
		})

		it('should handle network failures with retry', async () => {
			// Mock Math.random to always trigger failures
			vi.spyOn(Math, 'random').mockReturnValue(0.05) // Always trigger failure

			await expect(submitOrder(mockOrderDetails)).rejects.toThrow(
				OrderSubmissionError
			)
		}, 10000)

		it('should validate whitespace-only customer info', async () => {
			const invalidOrderDetails = {
				...mockOrderDetails,
				customerInfo: {
					name: '   ',
					phone: '   ',
					address: '   ',
				},
			}

			await expect(submitOrder(invalidOrderDetails)).rejects.toThrow(
				new OrderSubmissionError(
					'Имя обязательно для заполнения',
					'MISSING_NAME'
				)
			)
		})
	})

	describe('getOrderErrorMessage', () => {
		it('should return OrderSubmissionError message', () => {
			const error = new OrderSubmissionError('Test error', 'TEST_CODE')
			const message = getOrderErrorMessage(error)

			expect(message).toBe('Test error')
		})

		it('should return generic Error message', () => {
			const error = new Error('Generic error')
			const message = getOrderErrorMessage(error)

			expect(message).toBe('Произошла ошибка: Generic error')
		})

		it('should return default message for unknown error', () => {
			const message = getOrderErrorMessage('unknown error')

			expect(message).toBe('Произошла неизвестная ошибка при оформлении заказа')
		})

		it('should return default message for null error', () => {
			const message = getOrderErrorMessage(null)

			expect(message).toBe('Произошла неизвестная ошибка при оформлении заказа')
		})
	})

	describe('OrderSubmissionError', () => {
		it('should create error with code and details', () => {
			const error = new OrderSubmissionError('Test message', 'TEST_CODE', {
				extra: 'data',
			})

			expect(error.name).toBe('OrderSubmissionError')
			expect(error.message).toBe('Test message')
			expect(error.code).toBe('TEST_CODE')
			expect(error.details).toEqual({ extra: 'data' })
		})

		it('should create error without details', () => {
			const error = new OrderSubmissionError('Test message', 'TEST_CODE')

			expect(error.name).toBe('OrderSubmissionError')
			expect(error.message).toBe('Test message')
			expect(error.code).toBe('TEST_CODE')
			expect(error.details).toBeUndefined()
		})
	})
})
