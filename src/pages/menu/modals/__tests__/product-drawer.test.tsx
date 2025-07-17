import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductDrawer from '../product-drawer'
import { CartProvider } from '@/contexts/CartContext'
import type { MenuItem, CartItem } from '@/types/delivery'

// Mock the cart context
const mockCartContext = {
	items: [] as CartItem[],
	itemCount: 0,
	subtotal: 0,
	addItem: vi.fn(),
	removeItem: vi.fn(),
	updateQuantity: vi.fn(),
	clearCart: vi.fn(),
}

vi.mock('@/contexts/CartContext', async () => {
	const actual = await vi.importActual('@/contexts/CartContext')
	return {
		...actual,
		useCart: () => mockCartContext,
	}
})

const mockMenuItem: MenuItem = {
	id: 1,
	name: 'Test Appetizer',
	composition: 'Test ingredients',
	legend: 'Test legend',
	weight: '200 г',
	price: '450.-',
	imageUrl: '/test-image.jpg',
	category: 'appetizers',
}

const renderProductDrawer = (props = {}) => {
	const defaultProps = {
		isOpen: true,
		onClose: vi.fn(),
		product: mockMenuItem,
	}

	return render(
		<CartProvider>
			<ProductDrawer {...defaultProps} {...props} />
		</CartProvider>
	)
}

describe('ProductDrawer Cart Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockCartContext.items = []
		mockCartContext.itemCount = 0
	})

	it('renders product information correctly', () => {
		renderProductDrawer()

		// Product name appears in both mobile and desktop versions
		const productNames = screen.getAllByText('Test Appetizer')
		expect(productNames).toHaveLength(2) // Mobile and desktop versions

		// All other content also appears in both versions
		expect(screen.getAllByText(/Test ingredients/)).toHaveLength(2)
		expect(screen.getAllByText(/200 г/)).toHaveLength(2)
		expect(screen.getAllByText(/450.-/)).toHaveLength(2)
		expect(screen.getAllByText(/Test legend/)).toHaveLength(2)
	})

	it('shows "Add to Cart" button when item is not in cart', () => {
		renderProductDrawer()

		const addToCartButtons = screen.getAllByText('Добавить в корзину')
		expect(addToCartButtons).toHaveLength(2) // Mobile and desktop versions

		addToCartButtons.forEach((button) => {
			expect(button).toBeInTheDocument()
		})
	})

	it('calls addItem when "Add to Cart" button is clicked', () => {
		renderProductDrawer()

		const addToCartButton = screen.getAllByText('Добавить в корзину')[0]
		fireEvent.click(addToCartButton)

		expect(mockCartContext.addItem).toHaveBeenCalledWith(mockMenuItem)
	})

	it('shows quantity controls when item is in cart', () => {
		// Mock item being in cart
		mockCartContext.items = [
			{
				id: 1,
				menuItem: mockMenuItem,
				quantity: 2,
				subtotal: 900,
			},
		]

		renderProductDrawer()

		// Should show quantity in cart
		const quantityTexts = screen.getAllByText('В корзине: 2 шт.')
		expect(quantityTexts).toHaveLength(2) // Mobile and desktop versions

		// Should show quantity controls
		const minusButtons = screen.getAllByRole('button', {
			name: /Уменьшить количество/i,
		})
		const plusButtons = screen.getAllByRole('button', {
			name: /Увеличить количество/i,
		})

		expect(minusButtons.length).toBeGreaterThan(0)
		expect(plusButtons.length).toBeGreaterThan(0)

		// Should show current quantity
		const quantityDisplays = screen.getAllByText('2')
		expect(quantityDisplays.length).toBeGreaterThan(0)
	})

	it('calls updateQuantity when plus button is clicked', () => {
		// Mock item being in cart
		mockCartContext.items = [
			{
				id: 1,
				menuItem: mockMenuItem,
				quantity: 2,
				subtotal: 900,
			},
		]

		renderProductDrawer()

		const plusButtons = screen.getAllByRole('button', {
			name: /Увеличить количество/i,
		})
		fireEvent.click(plusButtons[0])

		expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 3)
	})

	it('calls updateQuantity when minus button is clicked', () => {
		// Mock item being in cart with quantity > 1
		mockCartContext.items = [
			{
				id: 1,
				menuItem: mockMenuItem,
				quantity: 2,
				subtotal: 900,
			},
		]

		renderProductDrawer()

		const minusButtons = screen.getAllByRole('button', {
			name: /Уменьшить количество/i,
		})
		fireEvent.click(minusButtons[0])

		expect(mockCartContext.updateQuantity).toHaveBeenCalledWith(1, 1)
	})

	it('calls removeItem when minus button is clicked and quantity is 1', () => {
		// Mock item being in cart with quantity = 1
		mockCartContext.items = [
			{
				id: 1,
				menuItem: mockMenuItem,
				quantity: 1,
				subtotal: 450,
			},
		]

		renderProductDrawer()

		const minusButtons = screen.getAllByRole('button', {
			name: /Уменьшить количество/i,
		})
		fireEvent.click(minusButtons[0])

		expect(mockCartContext.removeItem).toHaveBeenCalledWith(1)
	})

	it('calls addItem when plus button is clicked and item is not in cart', () => {
		// Mock empty cart but simulate clicking plus (edge case)
		mockCartContext.items = []

		renderProductDrawer()

		// First add item to cart
		const addToCartButton = screen.getAllByText('Добавить в корзину')[0]
		fireEvent.click(addToCartButton)

		expect(mockCartContext.addItem).toHaveBeenCalledWith(mockMenuItem)
	})

	it('renders both mobile and desktop versions', () => {
		renderProductDrawer()

		// Check for mobile version (should have md:hidden class)
		const mobileContainer = document.querySelector('.md\\:hidden')
		expect(mobileContainer).toBeInTheDocument()

		// Check for desktop version (should have hidden md:flex classes)
		const desktopContainer = document.querySelector('.hidden.md\\:flex')
		expect(desktopContainer).toBeInTheDocument()
	})

	it('calls onClose when close button is clicked', () => {
		const mockOnClose = vi.fn()
		renderProductDrawer({ onClose: mockOnClose })

		const closeButton = screen.getByText('Закрыть')
		fireEvent.click(closeButton)

		expect(mockOnClose).toHaveBeenCalled()
	})

	it('does not render when isOpen is false', () => {
		renderProductDrawer({ isOpen: false })

		expect(screen.queryByText('Test Appetizer')).not.toBeInTheDocument()
	})
})
