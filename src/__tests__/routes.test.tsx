import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { CartProvider } from '@/contexts/CartContext'

// Mock all page components
vi.mock('@/pages/menu/menu', () => ({
	default: () => <div data-testid='menu-page'>Menu Page</div>,
}))

vi.mock('@/pages/cart/cart', () => ({
	default: () => <div data-testid='cart-page'>Cart Page</div>,
}))

vi.mock('@/pages/checkout/checkout', () => ({
	default: () => <div data-testid='checkout-page'>Checkout Page</div>,
}))

vi.mock('@/pages/order-confirmation/order-confirmation', () => ({
	default: () => (
		<div data-testid='order-confirmation-page'>Order Confirmation Page</div>
	),
}))

vi.mock('@/pages/booking/booking', () => ({
	default: () => <div data-testid='booking-page'>Booking Page</div>,
}))

vi.mock('@/pages/contacts/contacts', () => ({
	default: () => <div data-testid='contacts-page'>Contacts Page</div>,
}))

vi.mock('@/pages/about/about', () => ({
	default: () => <div data-testid='about-page'>About Page</div>,
}))

vi.mock('@/pages/events/events', () => ({
	default: () => <div data-testid='events-page'>Events Page</div>,
}))

vi.mock('@/pages/menu/menu-layout', () => ({
	default: () => (
		<div data-testid='menu-layout'>
			<div>Menu Layout</div>
			<div data-testid='menu-page'>Menu Page</div>
		</div>
	),
}))

vi.mock('@/pages/not-found/not-found', () => ({
	default: () => <div data-testid='not-found-page'>Not Found Page</div>,
}))

// Mock localStorage
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
	value: mockLocalStorage,
})

// Import routes after mocking
import { router } from '@/routes'

function renderWithRouter(initialEntries: string[] = ['/']) {
	const testRouter = createMemoryRouter(router.routes, {
		initialEntries,
	})

	return render(
		<CartProvider>
			<RouterProvider router={testRouter} />
		</CartProvider>
	)
}

describe('Routes', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockLocalStorage.getItem.mockReturnValue(null)
	})

	it('should render about page on root path', () => {
		renderWithRouter(['/'])
		expect(screen.getByTestId('about-page')).toBeInTheDocument()
	})

	it('should render menu page on /menu path', () => {
		renderWithRouter(['/menu'])
		expect(screen.getByTestId('menu-layout')).toBeInTheDocument()
		expect(screen.getByTestId('menu-page')).toBeInTheDocument()
	})

	it('should render cart page on /cart path', () => {
		renderWithRouter(['/cart'])
		expect(screen.getByTestId('cart-page')).toBeInTheDocument()
	})

	it('should redirect to cart when accessing checkout with empty cart', () => {
		// Mock empty cart
		mockLocalStorage.getItem.mockReturnValue(
			JSON.stringify({
				items: [],
				lastUpdated: new Date().toISOString(),
				version: 1,
			})
		)

		renderWithRouter(['/checkout'])

		// Should redirect to cart page instead of showing checkout
		expect(screen.queryByTestId('checkout-page')).not.toBeInTheDocument()
		expect(screen.getByTestId('cart-page')).toBeInTheDocument()
	})

	it('should render order confirmation page on /order-confirmation path', () => {
		renderWithRouter(['/order-confirmation'])
		expect(screen.getByTestId('order-confirmation-page')).toBeInTheDocument()
	})

	it('should render booking page on /booking path', () => {
		renderWithRouter(['/booking'])
		expect(screen.getByTestId('booking-page')).toBeInTheDocument()
	})

	it('should render contacts page on /contacts path', () => {
		renderWithRouter(['/contacts'])
		expect(screen.getByTestId('contacts-page')).toBeInTheDocument()
	})

	it('should render events page on /events path', () => {
		renderWithRouter(['/events'])
		expect(screen.getByTestId('events-page')).toBeInTheDocument()
	})

	it('should render not found page for invalid paths', () => {
		renderWithRouter(['/invalid-path'])
		expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
	})

	it('should render menu page with category parameter', () => {
		renderWithRouter(['/menu/pizza'])
		expect(screen.getByTestId('menu-layout')).toBeInTheDocument()
		expect(screen.getByTestId('menu-page')).toBeInTheDocument()
	})
})
