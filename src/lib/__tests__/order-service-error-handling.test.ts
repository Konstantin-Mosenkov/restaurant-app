import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
	submitOrder,
	getOrderErrorMessage,
	OrderSubmissionError,
} from '../order-service'
import type { OrderDetails } from '@/types/delivery'

// Mock order details for testing
const mockOrderDetails: OrderDetails = {
	items: [
		{
			id: 1,
			menuItem: {
				id: 1,
				name: 'Test Item',
				composition: 'Test composition',
				legend: 'Test legend',
				weight: '100g',
				price: '100.-',
				imageUrl: '/test.jpg',
				category: 'test',
			},
			quantity: 1,
			subtotal: 100,
		},
	],
	subtotal: 100,
	deliveryFee: 50,
	total: 150,
	deliveryTime: {
		id: 'test-slot',
		date: '2024-01-01',
		timeRange: '12:00-13:00',
		available: true,
	},
	customerInfo: {
		name: 'Test User',
		phone: '+7 999 123 45 67',
		address: 'Test Address 123',
	},
}

describe('Order Service Error Handling', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// Reset Math.random to ensure consistent test results
		vi.spyOn(Math, 'random').mockReturnValue(0.5)
	})

	describe('submitOrder validation', () => {
		it('should throw error for empty order', async () => {
			const emptyOrder = { ...mockOrderDetails, items: [] }

			await expect(submitOrder(emptyOrder)).rejects.toThrow(
				new OrderSubmissionError('Заказ не может быть пустым', 'EMPTY_ORDER')
			)
		})

		it('should throw error for missing customer name', async () => {
			const invalidOrder = {
				...mockOrderDetails,
				customerInfo: { ...mockOrderDetails.customerInfo, name: '' },
			}

			await expect(submitOrder(invalidOrder)).rejects.toThrow(
				new OrderSubmissionError(
					'Имя обязательно для заполнения',
					'MISSING_NAME'
				)
			)
		})

		it('should throw error for missing phone', async () => {
			const invalidOrder = {
				...mockOrderDetails,
				customerInfo: { ...mockOrderDetails.customerInfo, phone: '' },
			}

			await expect(submitOrder(invalidOrder)).rejects.toThrow(
				new OrderSubmissionError(
					'Телефон обязателен для заполнения',
					'MISSING_PHONE'
				)
			)
		})

		it('should throw error for missing address', async () => {
			const invalidOrder = {
				...mockOrderDetails,
				customerInfo: { ...mockOrderDetails.customerInfo, address: '' },
			}

			await expect(submitOrder(invalidOrder)).rejects.toThrow(
				new OrderSubmissionError(
					'Адрес доставки обязателен для заполнения',
					'MISSING_ADDRESS'
				)
			)
		})

		it('should throw error for missing delivery time', async () => {
			const invalidOrder = { ...mockOrderDetails, deliveryTime: null }

			await expect(submitOrder(invalidOrder)).rejects.toThrow(
				new OrderSubmissionError(
					'Время доставки должно быть выбрано',
					'MISSING_DELIVERY_TIME'
				)
			)
		})

		it('should throw error for invalid total', async () => {
			const invalidOrder = { ...mockOrderDetails, total: 0 }

			await expect(submitOrder(invalidOrder)).rejects.toThrow(
				new OrderSubmissionError(
					'Сумма заказа должна быть больше нуля',
					'INVALID_TOTAL'
				)
			)
		})
	})

	describe('submitOrder network simulation', () => {
		it('should succeed with valid order details', async () => {
			// Mock successful submission (Math.random returns 0.5, which is > 0.1 failure rate)
			vi.spyOn(Math, 'random').mockReturnValue(0.5)

			const orderId = await submitOrder(mockOrderDetails)

			expect(orderId).toMatch(/^ORD-\d+-[A-Z0-9]{6}$/)
		})

		it('should retry and eventually succeed', async () => {
			// Mock failure on first two attempts, success on third
			vi.spyOn(Math, 'random')
				.mockReturnValueOnce(0.05) // First attempt fails (< 0.1)
				.mockReturnValueOnce(0.05) // Second attempt fails (< 0.1)
				.mockReturnValueOnce(0.5) // Third attempt succeeds (> 0.1)

			const orderId = await submitOrder(mockOrderDetails)

			expect(orderId).toMatch(/^ORD-\d+-[A-Z0-9]{6}$/)
		})

		it('should fail after max retries', async () => {
			// Mock all attempts to fail
			vi.spyOn(Math, 'random').mockReturnValue(0.05) // Always < 0.1 (failure)

			await expect(submitOrder(mockOrderDetails)).rejects.toThrow(
				new OrderSubmissionError(
					'Не удалось оформить заказ после нескольких попыток',
					'MAX_RETRIES_EXCEEDED'
				)
			)
		})
	})

	describe('getOrderErrorMessage', () => {
		it('should return user-friendly message for network error', () => {
			const error = new OrderSubmissionError('Network failed', 'NETWORK_ERROR')
			const message = getOrderErrorMessage(error)

			expect(message).toBe(
				'Проблемы с подключением к интернету. Проверьте соединение и попробуйте снова.'
			)
		})

		it('should return user-friendly message for server error', () => {
			const error = new OrderSubmissionError('Server error', 'SERVER_ERROR')
			const message = getOrderErrorMessage(error)

			expect(message).toBe(
				'Сервер временно недоступен. Попробуйте оформить заказ через несколько минут.'
			)
		})

		it('should return user-friendly message for timeout', () => {
			const error = new OrderSubmissionError('Timeout', 'TIMEOUT')
			const message = getOrderErrorMessage(error)

			expect(message).toBe(
				'Превышено время ожидания. Проверьте подключение и попробуйте снова.'
			)
		})

		it('should return user-friendly message for validation error', () => {
			const error = new OrderSubmissionError(
				'Validation failed',
				'VALIDATION_ERROR'
			)
			const message = getOrderErrorMessage(error)

			expect(message).toBe(
				'Некорректные данные заказа. Проверьте введенную информацию.'
			)
		})

		it('should return user-friendly message for max retries exceeded', () => {
			const error = new OrderSubmissionError(
				'Max retries',
				'MAX_RETRIES_EXCEEDED'
			)
			const message = getOrderErrorMessage(error)

			expect(message).toBe(
				'Не удалось оформить заказ после нескольких попыток. Попробуйте позже или обратитесь в службу поддержки.'
			)
		})

		it('should handle TypeError with fetch', () => {
			const error = new TypeError('fetch is not defined')
			const message = getOrderErrorMessage(error)

			expect(message).toBe(
				'Проблемы с подключением к серверу. Проверьте интернет-соединение.'
			)
		})

		it('should handle AbortError', () => {
			const error = new Error('Request aborted')
			error.name = 'AbortError'
			const message = getOrderErrorMessage(error)

			expect(message).toBe('Запрос был отменен. Попробуйте снова.')
		})

		it('should handle generic Error', () => {
			const error = new Error('Generic error')
			const message = getOrderErrorMessage(error)

			expect(message).toBe(
				'Произошла техническая ошибка. Попробуйте позже или обратитесь в службу поддержки.'
			)
		})

		it('should handle unknown error types', () => {
			const error = 'String error'
			const message = getOrderErrorMessage(error)

			expect(message).toBe(
				'Произошла неизвестная ошибка при оформлении заказа. Попробуйте позже или обратитесь в службу поддержки.'
			)
		})

		it('should return original message for unknown OrderSubmissionError codes', () => {
			const error = new OrderSubmissionError(
				'Custom error message',
				'UNKNOWN_CODE'
			)
			const message = getOrderErrorMessage(error)

			expect(message).toBe('Custom error message')
		})
	})

	describe('OrderSubmissionError class', () => {
		it('should create error with message and code', () => {
			const error = new OrderSubmissionError('Test message', 'TEST_CODE')

			expect(error.message).toBe('Test message')
			expect(error.code).toBe('TEST_CODE')
			expect(error.name).toBe('OrderSubmissionError')
		})

		it('should create error with details', () => {
			const details = { attempts: 3 }
			const error = new OrderSubmissionError(
				'Test message',
				'TEST_CODE',
				details
			)

			expect(error.details).toEqual(details)
		})
	})
})
