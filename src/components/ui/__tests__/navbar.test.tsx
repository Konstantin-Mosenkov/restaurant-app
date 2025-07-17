import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Navbar from '../navbar'
import { CartProvider } from '@/contexts/CartContext'

// Mock the cart context
const mockCartContext = {
	items: [],
	itemCount: 0,
	subtotal: 0,
	addItem: vi.fn(),
	removeItem: vi.fn(),
	updateQuantity: vi.fn(),
	clearCart: vi.fn(),
}

vi.mock('@/contexts/CartContext', () => ({
	CartProvider: ({ children }: { children: React.ReactNode }) => children,
	useCart: () => mockCartContext,
}))

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<BrowserRouter>
		<CartProvider>{children}</CartProvider>
	</BrowserRouter>
)

describe('Navbar', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockCartContext.itemCount = 0
	})

	it('renders navigation links correctly', () => {
		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		expect(screen.getByText('О ресторане')).toBeInTheDocument()
		expect(screen.getByText('Меню')).toBeInTheDocument()
		expect(screen.getByText('Бронирование')).toBeInTheDocument()
		expect(screen.getByText('События')).toBeInTheDocument()
		expect(screen.getByText('Контакты')).toBeInTheDocument()
	})

	it('displays cart icon without badge when cart is empty', () => {
		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		// Check for cart icons (desktop and mobile)
		const cartLinks = screen.getAllByLabelText('Корзина покупок')
		expect(cartLinks).toHaveLength(2) // Desktop and mobile

		// Check that no badge is displayed
		const badges = screen.queryAllByText(/\d+/)
		expect(badges).toHaveLength(0)
	})

	it('displays cart icon with badge when cart has items', () => {
		mockCartContext.itemCount = 3

		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		// Check for cart icons
		const cartLinks = screen.getAllByLabelText('Корзина покупок')
		expect(cartLinks).toHaveLength(2)

		// Check that badges are displayed with correct count (desktop and mobile header icons)
		const badges = screen.getAllByText('3')
		expect(badges).toHaveLength(2) // Desktop icon and mobile header icon
	})

	it('displays 99+ when cart has more than 99 items', () => {
		mockCartContext.itemCount = 150

		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		const badges = screen.getAllByText('99+')
		expect(badges).toHaveLength(2) // Desktop icon and mobile header icon
	})

	it('navigates to cart page when cart icon is clicked', () => {
		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		const cartLinks = screen.getAllByLabelText('Корзина покупок')

		// Check that cart links have correct href
		cartLinks.forEach((link) => {
			expect(link).toHaveAttribute('href', '/cart')
		})
	})

	it('displays cart link in mobile menu', () => {
		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		// Open mobile menu
		const menuButton = screen.getByRole('button', { name: /open main menu/i })
		fireEvent.click(menuButton)

		// Check for cart link in mobile menu
		const mobileCartLink = screen.getByText('Корзина')
		expect(mobileCartLink).toBeInTheDocument()
	})

	it('displays cart badge in mobile menu when cart has items', () => {
		mockCartContext.itemCount = 5

		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		// Open mobile menu
		const menuButton = screen.getByRole('button', { name: /open main menu/i })
		fireEvent.click(menuButton)

		// Check for cart link and badge in mobile menu
		const mobileCartLink = screen.getByText('Корзина')
		expect(mobileCartLink).toBeInTheDocument()

		// The badge should be visible in the mobile menu
		const mobileBadges = screen.getAllByText('5')
		expect(mobileBadges.length).toBeGreaterThan(0)
	})

	it('applies correct styling to cart icon', () => {
		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		const cartLinks = screen.getAllByLabelText('Корзина покупок')

		// Check that cart links have the correct CSS classes
		cartLinks.forEach((link) => {
			expect(link).toHaveClass('relative')
			expect(link).toHaveClass('text-wave-500/70')
			expect(link).toHaveClass('hover:text-wave-500')
			expect(link).toHaveClass('transition-colors')
		})
	})

	it('maintains cart icon visibility across different screen sizes', () => {
		render(
			<TestWrapper>
				<Navbar />
			</TestWrapper>
		)

		// Desktop cart icon should be hidden on mobile
		const desktopCartIcon = screen.getAllByLabelText('Корзина покупок')[0]
		expect(
			desktopCartIcon.closest('.hidden.sm\\:ml-auto.sm\\:block')
		).toBeInTheDocument()

		// Mobile cart icon should be hidden on desktop
		const mobileCartIcon = screen.getAllByLabelText('Корзина покупок')[1]
		expect(mobileCartIcon.closest('.sm\\:hidden')).toBeInTheDocument()
	})
})
