import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Checkout from '../checkout'
import * as orderService from '@/lib/order-service'
import type { MenuItem, CartItem } from '@/types/delivery'

// Mock the order service
vi.mock('@/lib/order-service', () => ({
	submitOrder: vi.fn(),
	getOrderErrorMessage: vi.fn(),
	OrderSubmissionError: class extends Error {
		constructor(message: string, public code: string) {
			super(message)
			this.name = 'OrderSubmissionError'
		}
	},
}))

// Mock react-router-dom navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom')
	return {
		...actual,
		useNavigate: () => mockNavigate,
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

// Mock the useCart hook directly
vi.mock('@/contexts/CartContext', () => ({
	useCart: () => ({
		items: [mockCartItem],
		itemCount: 2,
		subtotal: 1000,
		deliveryFee: 200,
		total: 1200,
		addItem: vi.fn(),
		removeItem: vi.fn(),
		updateQuantity: vi.fn(),
		clearCart: vi.fn(),
	}),
	CartProvider: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
}))

const renderCheckout = () => {
	return render(
		<BrowserRouter>
			<Checkout />
		</BrowserRouter>
	)
}

describe('Checkout Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockNavigate.mockClear()
	})

	it('should render checkout form with all required fields', () => {
		renderCheckout()

		expect(screen.getByText('Оформление заказа')).toBeInTheDocument()
		expect(screen.getByLabelText(/Имя/)).toBeInTheDocument()
		expect(screen.getByLabelText(/Телефон/)).toBeInTheDocument()
		expect(screen.getByLabelText(/Адрес доставки/)).toBeInTheDocument()
		expect(screen.getByText('Оформить заказ')).toBeInTheDocument()
	})

	it('should display order summary with correct totals', () => {
		renderCheckout()

		expect(screen.getByText('1000.-')).toBeInTheDocument() // subtotal
		expect(screen.getByText('200.-')).toBeInTheDocument() // delivery fee
		expect(screen.getByText('1200.-')).toBeInTheDocument() // total
	})

	it('should validate required fields before submission', async () => {
		renderCheckout()

		const submitButton = screen.getByText('Оформить заказ')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(
				screen.getByText('Имя обязательно для заполнения')
			).toBeInTheDocument()
			expect(
				screen.getByText('Телефон обязателен для заполнения')
			).toBeInTheDocument()
			expect(
				screen.getByText('Адрес доставки обязателен для заполнения')
			).toBeInTheDocument()
		})

		// Should not call submitOrder if validation fails
		expect(orderService.submitOrder).not.toHaveBeenCalled()
	})

	it('should validate name length', async () => {
		renderCheckout()

		const nameInput = screen.getByLabelText(/Имя/)
		fireEvent.change(nameInput, { target: { value: 'A' } })

		const submitButton = screen.getByText('Оформить заказ')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(
				screen.getByText('Имя должно содержать минимум 2 символа')
			).toBeInTheDocument()
		})
	})

	it('should validate phone format', async () => {
		renderCheckout()

		const phoneInput = screen.getByLabelText(/Телефон/)
		fireEvent.change(phoneInput, { target: { value: '123' } })

		const submitButton = screen.getByText('Оформить заказ')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(
				screen.getByText('Введите корректный номер телефона')
			).toBeInTheDocument()
		})
	})

	it('should validate address length', async () => {
		renderCheckout()

		const addressInput = screen.getByLabelText(/Адрес доставки/)
		fireEvent.change(addressInput, { target: { value: 'Short' } })

		const submitButton = screen.getByText('Оформить заказ')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(
				screen.getByText('Адрес должен содержать минимум 10 символов')
			).toBeInTheDocument()
		})
	})

	it('should clear field errors when user starts typing', async () => {
		renderCheckout()

		// Trigger validation errors
		const submitButton = screen.getByText('Оформить заказ')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(
				screen.getByText('Имя обязательно для заполнения')
			).toBeInTheDocument()
		})

		// Start typing in name field
		const nameInput = screen.getByLabelText(/Имя/)
		fireEvent.change(nameInput, { target: { value: 'Test' } })

		// Error should be cleared
		expect(
			screen.queryByText('Имя обязательно для заполнения')
		).not.toBeInTheDocument()
	})

	it('should successfully submit order with valid data', async () => {
		const mockOrderId = 'ORD-123456'
		vi.mocked(orderService.submitOrder).mockResolvedValue(mockOrderId)

		renderCheckout()

		// Fill in valid form data
		fireEvent.change(screen.getByLabelText(/Имя/), {
			target: { value: 'Test User' },
		})
		fireEvent.change(screen.getByLabelText(/Телефон/), {
			target: { value: '+7 999 123 45 67' },
		})
		fireEvent.change(screen.getByLabelText(/Адрес доставки/), {
			target: { value: 'Test Address, 123' },
		})

		// Mock time slot selection (this would normally be done through DeliveryTimeSelector)
		// For this test, we'll assume a time slot is selected

		const submitButton = screen.getByText('Оформить заказ')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(orderService.submitOrder).toHaveBeenCalledWith(
				expect.objectContaining({
					items: [mockCartItem],
					subtotal: 1000,
					deliveryFee: 200,
					total: 1200,
					customerInfo: {
						name: 'Test User',
						phone: '+7 999 123 45 67',
						address: 'Test Address, 123',
					},
				})
			)
		})

		// Should navigate to confirmation page
		expect(mockNavigate).toHaveBeenCalledWith('/order-confirmation', {
			state: {
				orderId: mockOrderId,
				orderDetails: expect.any(Object),
			},
		})
	})

	it('should handle order submission errors', async () => {
		const mockError = new Error('Network error')
		vi.mocked(orderService.submitOrder).mockRejectedValue(mockError)
		vi.mocked(orderService.getOrderErrorMessage).mockReturnValue('Ошибка сети')

		// Mock window.alert
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

		renderCheckout()

		// Fill in valid form data
		fireEvent.change(screen.getByLabelText(/Имя/), {
			target: { value: 'Test User' },
		})
		fireEvent.change(screen.getByLabelText(/Телефон/), {
			target: { value: '+7 999 123 45 67' },
		})
		fireEvent.change(screen.getByLabelText(/Адрес доставки/), {
			target: { value: 'Test Address, 123' },
		})

		const submitButton = screen.getByText('Оформить заказ')
		fireEvent.click(submitButton)

		await waitFor(() => {
			expect(orderService.submitOrder).toHaveBeenCalled()
		})

		// Should show error message
		expect(alertSpy).toHaveBeenCalledWith('Ошибка сети')

		// Should not navigate
		expect(mockNavigate).not.toHaveBeenCalled()

		alertSpy.mockRestore()
	})

	it('should show loading state during submission', async () => {
		// Mock a delayed submission
		vi.mocked(orderService.submitOrder).mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve('ORD-123'), 1000))
		)

		renderCheckout()

		// Fill in valid form data
		fireEvent.change(screen.getByLabelText(/Имя/), {
			target: { value: 'Test User' },
		})
		fireEvent.change(screen.getByLabelText(/Телефон/), {
			target: { value: '+7 999 123 45 67' },
		})
		fireEvent.change(screen.getByLabelText(/Адрес доставки/), {
			target: { value: 'Test Address, 123' },
		})

		const submitButton = screen.getByText('Оформить заказ')
		fireEvent.click(submitButton)

		// Should show loading state
		expect(screen.getByText('Оформляем заказ...')).toBeInTheDocument()
		expect(submitButton).toBeDisabled()

		// Wait for submission to complete
		await waitFor(
			() => {
				expect(mockNavigate).toHaveBeenCalled()
			},
			{ timeout: 2000 }
		)
	})

	it('should navigate back to cart when "Вернуться в корзину" is clicked', () => {
		renderCheckout()

		const backButton = screen.getByText('Вернуться в корзину')
		fireEvent.click(backButton)

		expect(mockNavigate).toHaveBeenCalledWith('/cart')
	})
})
