import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import OrderConfirmation from '../order-confirmation'
import type {
	OrderDetails,
	MenuItem,
	CartItem,
	DeliveryTimeSlot,
} from '@/types/delivery'

// Mock react-router-dom
const mockNavigate = vi.fn()
const mockLocation = {
	state: null as any,
}

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom')
	return {
		...actual,
		useNavigate: () => mockNavigate,
		useLocation: () => mockLocation,
		Link: ({ children, to, ...props }: any) => (
			<a href={to} {...props}>
				{children}
			</a>
		),
	}
})

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
	date: '15 июля 2025',
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

const mockOrderConfirmationState = {
	orderId: 'ORD-1721030400000-ABC123',
	orderDetails: mockOrderDetails,
}

const renderOrderConfirmation = (state = mockOrderConfirmationState) => {
	mockLocation.state = state

	return render(
		<BrowserRouter>
			<OrderConfirmation />
		</BrowserRouter>
	)
}

describe('Order Confirmation Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockNavigate.mockClear()
		mockLocation.state = null
	})

	it('should redirect to home if no order data is provided', () => {
		renderOrderConfirmation(undefined)

		expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
	})

	it('should redirect to home if order ID is missing', () => {
		renderOrderConfirmation({
			orderId: '',
			orderDetails: mockOrderDetails,
		})

		expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
	})

	it('should redirect to home if order details are missing', () => {
		renderOrderConfirmation({
			orderId: 'ORD-123',
			orderDetails: null as any,
		})

		expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
	})

	it('should display success message and order details', () => {
		renderOrderConfirmation()

		// Success message
		expect(screen.getByText('Заказ успешно оформлен!')).toBeInTheDocument()
		expect(
			screen.getByText(
				'Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.'
			)
		).toBeInTheDocument()

		// Order ID
		expect(screen.getByText('ORD-1721030400000-ABC123')).toBeInTheDocument()

		// Customer information
		expect(screen.getByText('Test User')).toBeInTheDocument()
		expect(screen.getByText('+7 999 123 45 67')).toBeInTheDocument()
		expect(screen.getByText('Test Address, 123')).toBeInTheDocument()
		expect(screen.getByText('15 июля 2025, 12:00-13:00')).toBeInTheDocument()
	})

	it('should display order items correctly', () => {
		renderOrderConfirmation()

		// Item details
		expect(screen.getByText('Test Pizza')).toBeInTheDocument()
		expect(screen.getByText('300g • 500.-')).toBeInTheDocument()
		expect(screen.getByText('2 × 500.-')).toBeInTheDocument()
		expect(screen.getByText('= 1000.-')).toBeInTheDocument()
	})

	it('should display order summary with correct calculations', () => {
		renderOrderConfirmation()

		// Order summary
		expect(screen.getByText('Количество позиций:')).toBeInTheDocument()
		expect(screen.getByText('1')).toBeInTheDocument() // 1 unique item
		expect(screen.getByText('Общее количество:')).toBeInTheDocument()
		expect(screen.getByText('2')).toBeInTheDocument() // total quantity
		expect(screen.getByText('Сумма заказа:')).toBeInTheDocument()
		expect(screen.getByText('1000.-')).toBeInTheDocument()
		expect(screen.getByText('Доставка:')).toBeInTheDocument()
		expect(screen.getByText('200.-')).toBeInTheDocument()
		expect(screen.getByText('Итого:')).toBeInTheDocument()
		expect(screen.getByText('1200.-')).toBeInTheDocument()
	})

	it('should display next steps information', () => {
		renderOrderConfirmation()

		expect(screen.getByText('Что дальше?')).toBeInTheDocument()
		expect(
			screen.getByText('• Мы свяжемся с вами для подтверждения заказа')
		).toBeInTheDocument()
		expect(
			screen.getByText('• Приготовление займет 30-45 минут')
		).toBeInTheDocument()
		expect(
			screen.getByText('• Доставка осуществляется в указанное время')
		).toBeInTheDocument()
		expect(screen.getByText('• Оплата при получении')).toBeInTheDocument()
	})

	it('should navigate to menu when "Продолжить покупки" is clicked', () => {
		renderOrderConfirmation()

		const continueShoppingButton = screen.getByText('Продолжить покупки')
		fireEvent.click(continueShoppingButton)

		expect(mockNavigate).toHaveBeenCalledWith('/menu')
	})

	it('should have working "На главную" link', () => {
		renderOrderConfirmation()

		const homeLink = screen.getByText('На главную')
		expect(homeLink.closest('a')).toHaveAttribute('href', '/')
	})

	it('should handle multiple items correctly', () => {
		const multipleItemsOrderDetails = {
			...mockOrderDetails,
			items: [
				mockCartItem,
				{
					id: 2,
					menuItem: {
						...mockMenuItem,
						id: 2,
						name: 'Test Pasta',
						price: '400.-',
					},
					quantity: 1,
					subtotal: 400,
				},
			],
			subtotal: 1400,
			total: 1600,
		}

		renderOrderConfirmation({
			orderId: 'ORD-123',
			orderDetails: multipleItemsOrderDetails,
		})

		// Should show both items
		expect(screen.getByText('Test Pizza')).toBeInTheDocument()
		expect(screen.getByText('Test Pasta')).toBeInTheDocument()

		// Should show correct totals
		expect(screen.getByText('2')).toBeInTheDocument() // 2 unique items
		expect(screen.getByText('3')).toBeInTheDocument() // total quantity (2+1)
		expect(screen.getByText('1400.-')).toBeInTheDocument() // subtotal
		expect(screen.getByText('1600.-')).toBeInTheDocument() // total
	})

	it('should handle missing delivery time gracefully', () => {
		const orderDetailsWithoutDeliveryTime = {
			...mockOrderDetails,
			deliveryTime: null,
		}

		renderOrderConfirmation({
			orderId: 'ORD-123',
			orderDetails: orderDetailsWithoutDeliveryTime,
		})

		// Should still render other information
		expect(screen.getByText('Test User')).toBeInTheDocument()
		expect(screen.getByText('+7 999 123 45 67')).toBeInTheDocument()
		expect(screen.getByText('Test Address, 123')).toBeInTheDocument()

		// Delivery time should not be shown
		expect(
			screen.queryByText('15 июля 2025, 12:00-13:00')
		).not.toBeInTheDocument()
	})

	it('should display order ID in monospace font', () => {
		renderOrderConfirmation()

		const orderIdElement = screen.getByText('ORD-1721030400000-ABC123')
		expect(orderIdElement).toHaveClass('font-mono')
	})

	it('should display success icon', () => {
		renderOrderConfirmation()

		// Check for CheckCircle icon (we can't easily test the actual icon, but we can check for its container)
		const successSection = screen
			.getByText('Заказ успешно оформлен!')
			.closest('div')
		expect(successSection).toHaveClass('bg-green-50')
	})
})
