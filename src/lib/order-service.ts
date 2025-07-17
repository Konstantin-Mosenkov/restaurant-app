import type { OrderDetails, OrderSubmission } from '@/types/delivery'

// Order submission errors
export class OrderSubmissionError extends Error {
	constructor(message: string, public code: string, public details?: any) {
		super(message)
		this.name = 'OrderSubmissionError'
	}
}

// Order service configuration
const ORDER_CONFIG = {
	API_TIMEOUT: 10000, // 10 seconds
	MAX_RETRY_ATTEMPTS: 3,
	RETRY_DELAY: 1000, // 1 second
}

// Generate unique order ID
function generateOrderId(): string {
	const timestamp = Date.now()
	const random = Math.random().toString(36).substring(2, 8).toUpperCase()
	return `ORD-${timestamp}-${random}`
}

// Simulate network delay
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

// Validate order details before submission
function validateOrderDetails(orderDetails: OrderDetails): void {
	// Check if order has items
	if (!orderDetails.items || orderDetails.items.length === 0) {
		throw new OrderSubmissionError('Заказ не может быть пустым', 'EMPTY_ORDER')
	}

	// Check customer info
	if (!orderDetails.customerInfo.name.trim()) {
		throw new OrderSubmissionError(
			'Имя обязательно для заполнения',
			'MISSING_NAME'
		)
	}

	if (!orderDetails.customerInfo.phone.trim()) {
		throw new OrderSubmissionError(
			'Телефон обязателен для заполнения',
			'MISSING_PHONE'
		)
	}

	if (!orderDetails.customerInfo.address.trim()) {
		throw new OrderSubmissionError(
			'Адрес доставки обязателен для заполнения',
			'MISSING_ADDRESS'
		)
	}

	// Check delivery time
	if (!orderDetails.deliveryTime) {
		throw new OrderSubmissionError(
			'Время доставки должно быть выбрано',
			'MISSING_DELIVERY_TIME'
		)
	}

	// Check totals
	if (orderDetails.total <= 0) {
		throw new OrderSubmissionError(
			'Сумма заказа должна быть больше нуля',
			'INVALID_TOTAL'
		)
	}
}

// Simulate order submission to API
async function submitOrderToAPI(
	orderSubmission: OrderSubmission
): Promise<string> {
	// Simulate network delay
	await delay(1500 + Math.random() * 1000)

	// Simulate occasional failures for testing
	const failureRate = 0.1 // 10% failure rate
	if (Math.random() < failureRate) {
		const errorTypes = [
			{
				code: 'NETWORK_ERROR',
				message: 'Ошибка сети. Проверьте подключение к интернету.',
			},
			{
				code: 'SERVER_ERROR',
				message: 'Ошибка сервера. Попробуйте позже.',
			},
			{
				code: 'VALIDATION_ERROR',
				message: 'Ошибка валидации данных.',
			},
		]

		const error = errorTypes[Math.floor(Math.random() * errorTypes.length)]
		throw new OrderSubmissionError(error.message, error.code)
	}

	// Return the order ID on success
	return orderSubmission.orderId
}

// Main order submission function with retry logic
export async function submitOrder(orderDetails: OrderDetails): Promise<string> {
	// Validate order details
	validateOrderDetails(orderDetails)

	// Create order submission object
	const orderSubmission: OrderSubmission = {
		orderId: generateOrderId(),
		items: orderDetails.items,
		customerInfo: orderDetails.customerInfo,
		deliveryTime: orderDetails.deliveryTime!,
		totals: {
			subtotal: orderDetails.subtotal,
			deliveryFee: orderDetails.deliveryFee,
			total: orderDetails.total,
		},
		timestamp: new Date().toISOString(),
		status: 'pending',
	}

	let lastError: Error | null = null

	// Retry logic
	for (let attempt = 1; attempt <= ORDER_CONFIG.MAX_RETRY_ATTEMPTS; attempt++) {
		try {
			const orderId = await Promise.race([
				submitOrderToAPI(orderSubmission),
				new Promise<never>((_, reject) =>
					setTimeout(
						() =>
							reject(
								new OrderSubmissionError('Превышено время ожидания', 'TIMEOUT')
							),
						ORDER_CONFIG.API_TIMEOUT
					)
				),
			])

			return orderId
		} catch (error) {
			lastError = error as Error
			console.warn(`Order submission attempt ${attempt} failed:`, error)

			// Don't retry for validation errors
			if (
				error instanceof OrderSubmissionError &&
				[
					'EMPTY_ORDER',
					'MISSING_NAME',
					'MISSING_PHONE',
					'MISSING_ADDRESS',
					'MISSING_DELIVERY_TIME',
					'INVALID_TOTAL',
				].includes(error.code)
			) {
				throw error
			}

			// Wait before retrying (except on last attempt)
			if (attempt < ORDER_CONFIG.MAX_RETRY_ATTEMPTS) {
				await delay(ORDER_CONFIG.RETRY_DELAY * attempt)
			}
		}
	}

	// All attempts failed
	if (lastError instanceof OrderSubmissionError) {
		throw lastError
	}

	throw new OrderSubmissionError(
		'Не удалось оформить заказ после нескольких попыток',
		'MAX_RETRIES_EXCEEDED',
		{ attempts: ORDER_CONFIG.MAX_RETRY_ATTEMPTS }
	)
}

// Get user-friendly error message
export function getOrderErrorMessage(error: unknown): string {
	if (error instanceof OrderSubmissionError) {
		// Return user-friendly messages based on error codes
		switch (error.code) {
			case 'NETWORK_ERROR':
				return 'Проблемы с подключением к интернету. Проверьте соединение и попробуйте снова.'
			case 'SERVER_ERROR':
				return 'Сервер временно недоступен. Попробуйте оформить заказ через несколько минут.'
			case 'TIMEOUT':
				return 'Превышено время ожидания. Проверьте подключение и попробуйте снова.'
			case 'VALIDATION_ERROR':
				return 'Некорректные данные заказа. Проверьте введенную информацию.'
			case 'MAX_RETRIES_EXCEEDED':
				return 'Не удалось оформить заказ после нескольких попыток. Попробуйте позже или обратитесь в службу поддержки.'
			case 'EMPTY_ORDER':
				return 'Корзина пуста. Добавьте товары для оформления заказа.'
			case 'MISSING_NAME':
				return 'Укажите ваше имя для оформления заказа.'
			case 'MISSING_PHONE':
				return 'Укажите номер телефона для связи.'
			case 'MISSING_ADDRESS':
				return 'Укажите адрес доставки.'
			case 'MISSING_DELIVERY_TIME':
				return 'Выберите время доставки.'
			case 'INVALID_TOTAL':
				return 'Некорректная сумма заказа. Обновите страницу и попробуйте снова.'
			default:
				return error.message
		}
	}

	if (error instanceof Error) {
		// Handle common JavaScript errors
		if (error.name === 'TypeError' && error.message.includes('fetch')) {
			return 'Проблемы с подключением к серверу. Проверьте интернет-соединение.'
		}

		if (error.name === 'AbortError') {
			return 'Запрос был отменен. Попробуйте снова.'
		}

		return `Произошла техническая ошибка. Попробуйте позже или обратитесь в службу поддержки.`
	}

	return 'Произошла неизвестная ошибка при оформлении заказа. Попробуйте позже или обратитесь в службу поддержки.'
}
