import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/components/ui/toast'
import { DeliveryTimeSelector } from '@/components/ui/delivery-time-selector'
import { CartItemCard } from '@/pages/cart/components/cart-item-card'
import { CartSummary } from '@/pages/cart/components/cart-summary'
import type { DeliveryTimeSlot, CartItem } from '@/types/delivery'

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<BrowserRouter>
		<ToastProvider>
			<CartProvider>{children}</CartProvider>
		</ToastProvider>
	</BrowserRouter>
)

// Mock cart item for testing
const mockCartItem: CartItem = {
	id: 1,
	menuItem: {
		id: 1,
		name: 'Test Pizza',
		composition: 'Тесто, томатный соус, сыр моцарелла',
		weight: '350г',
		price: '890.-',
		imageUrl: '/assets/pizza-1.jpg',
		category: 'pizza',
		legend: 'Классическая пицца',
	},
	quantity: 2,
	subtotal: 1780,
}

describe('Responsive Design Tests', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('Cart Item Card Mobile Responsiveness', () => {
		test('cart item card has mobile-optimized layout', () => {
			render(
				<TestWrapper>
					<CartItemCard item={mockCartItem} />
				</TestWrapper>
			)

			// Check for touch-manipulation classes on quantity buttons
			const buttons = screen.getAllByRole('button')
			const touchButtons = buttons.filter((button) =>
				button.className.includes('touch-manipulation')
			)
			expect(touchButtons.length).toBeGreaterThan(0)

			// Check for mobile-specific button sizes
			const quantityButtons = buttons.filter((button) =>
				button.className.includes('w-10 h-10')
			)
			expect(quantityButtons.length).toBeGreaterThan(0)
		})

		test('cart item card shows mobile layout for small screens', () => {
			render(
				<TestWrapper>
					<CartItemCard item={mockCartItem} />
				</TestWrapper>
			)

			// Check for responsive classes that hide/show elements on different screen sizes
			const mobileElements = document.querySelectorAll('.sm\\:hidden')
			const desktopElements = document.querySelectorAll('.hidden.sm\\:block')

			// Should have elements that are mobile-only and desktop-only
			expect(mobileElements.length + desktopElements.length).toBeGreaterThan(0)
		})
	})

	describe('Cart Summary Mobile Responsiveness', () => {
		test('cart summary has mobile-optimized styling', () => {
			render(
				<TestWrapper>
					<CartSummary />
				</TestWrapper>
			)

			// Check for responsive text sizing
			const summaryTitle = screen.getByText('Итого к оплате')
			expect(summaryTitle).toHaveClass('text-lg')
			expect(summaryTitle).toHaveClass('sm:text-xl')

			// Check for touch-friendly button
			const checkoutButton = screen.getByRole('button', {
				name: /оформить заказ|добавьте еще товаров/i,
			})
			expect(checkoutButton).toHaveClass('touch-manipulation')
		})

		test('cart summary is not sticky on mobile', () => {
			render(
				<TestWrapper>
					<CartSummary />
				</TestWrapper>
			)

			// Cart summary should only be sticky on large screens
			const summaryContainer = screen.getByText('Итого к оплате').closest('div')
			expect(summaryContainer).toHaveClass('lg:sticky')
		})
	})

	describe('Delivery Time Selector Mobile Responsiveness', () => {
		test('time slots have mobile-optimized grid layout', () => {
			render(
				<DeliveryTimeSelector selectedSlot={null} onSlotSelect={vi.fn()} />
			)

			// Check for responsive grid classes
			const gridElements = document.querySelectorAll('.grid')
			if (gridElements.length > 0) {
				const gridElement = gridElements[0]
				expect(gridElement).toHaveClass('grid-cols-2')
				expect(gridElement).toHaveClass('sm:grid-cols-3')
				expect(gridElement).toHaveClass('lg:grid-cols-4')
			}
		})

		test('time slot buttons are touch-friendly', () => {
			render(
				<DeliveryTimeSelector selectedSlot={null} onSlotSelect={vi.fn()} />
			)

			// Check for touch-manipulation class on time slot buttons
			const buttons = screen.getAllByRole('button')
			const touchButtons = buttons.filter((button) =>
				button.className.includes('touch-manipulation')
			)

			if (touchButtons.length > 0) {
				expect(touchButtons[0]).toHaveClass('h-10')
			}
		})

		test('selected time display is mobile-responsive', () => {
			const mockSlot: DeliveryTimeSlot = {
				id: 'test-1',
				date: '2025-01-15',
				timeRange: '12:00-13:00',
				available: true,
			}

			render(
				<DeliveryTimeSelector selectedSlot={mockSlot} onSlotSelect={vi.fn()} />
			)

			// Check for responsive text sizing on the paragraph element
			const selectedTimeContainer = screen
				.getByText(/выбранное время/i)
				.closest('p')
			expect(selectedTimeContainer).toHaveClass('text-xs')
			expect(selectedTimeContainer).toHaveClass('sm:text-sm')
		})
	})

	describe('Touch Target Sizes', () => {
		test('quantity control buttons have adequate touch targets', () => {
			render(
				<TestWrapper>
					<CartItemCard item={mockCartItem} />
				</TestWrapper>
			)

			// Check that quantity buttons meet minimum touch target size
			const quantityButtons = screen
				.getAllByRole('button')
				.filter((button) => button.className.includes('w-10 h-10'))

			expect(quantityButtons.length).toBeGreaterThan(0)
			quantityButtons.forEach((button) => {
				expect(button).toHaveClass('touch-manipulation')
			})
		})

		test('time slot buttons have adequate touch targets', () => {
			render(
				<DeliveryTimeSelector selectedSlot={null} onSlotSelect={vi.fn()} />
			)

			// Check that time slot buttons have adequate height
			const timeSlotButtons = screen
				.getAllByRole('button')
				.filter((button) => button.className.includes('h-10'))

			if (timeSlotButtons.length > 0) {
				timeSlotButtons.forEach((button) => {
					expect(button).toHaveClass('touch-manipulation')
				})
			}
		})
	})

	describe('Responsive Text and Spacing', () => {
		test('components use responsive text sizing', () => {
			render(
				<TestWrapper>
					<CartSummary />
				</TestWrapper>
			)

			// Check for responsive text classes
			const title = screen.getByText('Итого к оплате')
			expect(title.className).toMatch(/text-(lg|xl)/)
			expect(title.className).toMatch(/sm:text-(lg|xl)/)
		})

		test('components use responsive spacing', () => {
			render(
				<TestWrapper>
					<CartItemCard item={mockCartItem} />
				</TestWrapper>
			)

			// Check for responsive padding/margin classes on the main card container
			const cardElements = screen.getAllByText(mockCartItem.menuItem.name)
			const cardElement = cardElements[0].closest('.bg-white')
			if (cardElement) {
				expect(cardElement.className).toMatch(/p-\d+/)
				expect(cardElement.className).toMatch(/sm:p-\d+/)
			}
		})
	})

	describe('Grid Layout Responsiveness', () => {
		test('delivery time selector uses responsive grid', () => {
			render(
				<DeliveryTimeSelector selectedSlot={null} onSlotSelect={vi.fn()} />
			)

			// Check responsive grid classes are present
			const gridElements = document.querySelectorAll('.grid')
			gridElements.forEach((grid) => {
				// Should have responsive grid classes
				expect(grid.className).toMatch(/grid-cols-\d+/)
				expect(grid.className).toMatch(/(sm|md|lg):grid-cols-\d+/)
			})
		})
	})
})
