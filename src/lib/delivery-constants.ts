// Constants for delivery ordering system

// Delivery fee configuration
export const DELIVERY_CONFIG = {
	STANDARD_FEE: 300, // Standard delivery fee in rubles
	FREE_DELIVERY_THRESHOLD: 2000, // Minimum order amount for free delivery
	MINIMUM_ORDER_AMOUNT: 500, // Minimum order amount to place order
} as const

// Time slot configuration
export const TIME_SLOT_CONFIG = {
	ADVANCE_BOOKING_HOURS: 2, // Minimum hours in advance for booking
	DELIVERY_HOURS: {
		START: 11, // 11:00 AM
		END: 21, // 9:00 PM
	},
	SLOT_DURATION: 2, // 2 hours per slot
	MAX_DAYS_AHEAD: 1, // Only today and tomorrow
} as const

// Cart configuration
export const CART_CONFIG = {
	MAX_QUANTITY_PER_ITEM: 10,
	MAX_ITEMS_IN_CART: 50,
	STORAGE_KEY: 'cape-delivery-cart',
	STORAGE_VERSION: 1,
} as const

// Order status configuration
export const ORDER_STATUS = {
	PENDING: 'pending',
	CONFIRMED: 'confirmed',
	PREPARING: 'preparing',
	DELIVERED: 'delivered',
} as const

// Validation rules
export const VALIDATION_RULES = {
	CUSTOMER_NAME: {
		MIN_LENGTH: 2,
		MAX_LENGTH: 50,
	},
	PHONE: {
		MIN_LENGTH: 10,
		PATTERN: /^[\\+]?[0-9\s\-\\(\\)]{10,}$/,
	},
	ADDRESS: {
		MIN_LENGTH: 10,
		MAX_LENGTH: 200,
	},
} as const

// UI configuration
export const UI_CONFIG = {
	TOAST_DURATION: 3000, // 3 seconds
	DEBOUNCE_DELAY: 300, // 300ms for search/input debouncing
	ANIMATION_DURATION: 200, // 200ms for transitions
} as const

// Error messages in Russian
export const ERROR_MESSAGES = {
	NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
	ORDER_SUBMISSION_FAILED: 'Не удалось отправить заказ. Попробуйте еще раз.',
	INVALID_CUSTOMER_INFO: 'Проверьте правильность введенных данных.',
	CART_EMPTY: 'Корзина пуста. Добавьте товары для оформления заказа.',
	TIME_SLOT_UNAVAILABLE: 'Выбранное время недоступно. Выберите другое время.',
	MINIMUM_ORDER_NOT_MET: `Минимальная сумма заказа ${DELIVERY_CONFIG.MINIMUM_ORDER_AMOUNT} руб.`,
} as const

// Success messages in Russian
export const SUCCESS_MESSAGES = {
	ITEM_ADDED_TO_CART: 'Товар добавлен в корзину',
	ITEM_REMOVED_FROM_CART: 'Товар удален из корзины',
	CART_UPDATED: 'Корзина обновлена',
	ORDER_PLACED: 'Заказ успешно оформлен',
} as const
