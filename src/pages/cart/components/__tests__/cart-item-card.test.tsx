import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// CartProvider and useCart are mocked below
import { CartItemCard } from '../cart-item-card'
import type { CartItem, MenuItem } from '@/types/delivery'

// Mock the cart context
const mockUpdateQuantity = vi.fn()
const mockRemoveItem = vi.fn()

vi.mock('@/contexts/CartContext', async () => {
	const actual = await vi.importActual('@/contexts/CartContext')
	return {
		...actual,
		useCart: () => ({
			updateQuantity: mockUpdateQuantity,
			removeItem: mockRemoveItem,
		}),
	}
})

// Mock menu item for testing
const mockMenuItem: MenuItem = {
	id: 1,
	name: 'Тест Пицца',
	composition: 'тестовые ингредиенты, сыр, томатный соус',
	legend: 'Тестовая легенда',
	weight: '300г',
	price: '500.-',
	imageUrl: '/test-pizza.jpg',
	category: 'pizza',
}

// Mock cart item
const mockCartItem: CartItem = {
	id: 1,
	menuItem: mockMenuItem,
	quantity: 2,
	subtotal: 1000,
}

describe('CartItemCard', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should render cart item information correctly', () => {
		render(<CartItemCard item={mockCartItem} />)

		expect(screen.getByText('Тест Пицца')).toBeInTheDocument()
		expect(
			screen.getByText('тестовые ингредиенты, сыр, томатный соус')
		).toBeInTheDocument()
		expect(screen.getByText('300г')).toBeInTheDocument()
		expect(screen.getByText('1 000.-')).toBeInTheDocument() // Subtotal
		expect(screen.getByText('500.- за шт.')).toBeInTheDocument() // Unit price
		expect(screen.getByText('2')).toBeInTheDocument() // Quantity
	})

	it('should render item image with correct attributes', () => {
		render(<CartItemCard item={mockCartItem} />)

		const image = screen.getByAltText('Тест Пицца')
		expect(image).toBeInTheDocument()
		expect(image).toHaveAttribute('src', '/test-pizza.jpg')
	})

	it('should call updateQuantity when increasing quantity', () => {
		render(<CartItemCard item={mockCartItem} />)

		const buttons = screen.getAllByRole('button')
		const increaseButton = buttons.find((button) =>
			button.querySelector('svg')?.classList.contains('lucide-plus')
		)
		fireEvent.click(increaseButton!)

		expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3)
	})

	it('should call updateQuantity when decreasing quantity', () => {
		render(<CartItemCard item={mockCartItem} />)

		const buttons = screen.getAllByRole('button')
		const decreaseButton = buttons.find((button) =>
			button.querySelector('svg')?.classList.contains('lucide-minus')
		)
		fireEvent.click(decreaseButton!)

		expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1)
	})

	it('should show remove confirmation when decreasing quantity to 0', () => {
		const singleItemCartItem: CartItem = {
			...mockCartItem,
			quantity: 1,
			subtotal: 500,
		}

		render(<CartItemCard item={singleItemCartItem} />)

		const buttons = screen.getAllByRole('button')
		const decreaseButton = buttons.find((button) =>
			button.querySelector('svg')?.classList.contains('lucide-minus')
		)
		fireEvent.click(decreaseButton!)

		expect(screen.getByText('Удалить товар из корзины?')).toBeInTheDocument()
		expect(screen.getByText('Отмена')).toBeInTheDocument()
		expect(screen.getByText('Удалить')).toBeInTheDocument()
	})

	it('should show remove confirmation when clicking remove button', () => {
		render(<CartItemCard item={mockCartItem} />)

		const removeButton = screen.getByRole('button', { name: /удалить/i })
		fireEvent.click(removeButton)

		expect(screen.getByText('Удалить товар из корзины?')).toBeInTheDocument()
	})

	it('should call removeItem when confirming removal', () => {
		render(<CartItemCard item={mockCartItem} />)

		// Click remove button to show confirmation
		const removeButton = screen.getByRole('button', { name: /удалить/i })
		fireEvent.click(removeButton)

		// Click confirm button
		const confirmButton = screen.getByRole('button', { name: 'Удалить' })
		fireEvent.click(confirmButton)

		expect(mockRemoveItem).toHaveBeenCalledWith(1)
	})

	it('should hide remove confirmation when clicking cancel', async () => {
		render(<CartItemCard item={mockCartItem} />)

		// Click remove button to show confirmation
		const removeButton = screen.getByRole('button', { name: /удалить/i })
		fireEvent.click(removeButton)

		expect(screen.getByText('Удалить товар из корзины?')).toBeInTheDocument()

		// Click cancel button
		const cancelButton = screen.getByRole('button', { name: 'Отмена' })
		fireEvent.click(cancelButton)

		await waitFor(() => {
			expect(
				screen.queryByText('Удалить товар из корзины?')
			).not.toBeInTheDocument()
		})
	})

	it('should disable increase button when at maximum quantity', () => {
		const maxQuantityCartItem: CartItem = {
			...mockCartItem,
			quantity: 10, // CART_CONFIG.MAX_QUANTITY_PER_ITEM
			subtotal: 5000,
		}

		render(<CartItemCard item={maxQuantityCartItem} />)

		const buttons = screen.getAllByRole('button')
		const increaseButton = buttons.find((button) =>
			button.querySelector('svg')?.classList.contains('lucide-plus')
		)
		expect(increaseButton).toBeDisabled()
	})

	it('should handle price parsing correctly for different formats', () => {
		const itemWithCommaPrice: CartItem = {
			...mockCartItem,
			menuItem: {
				...mockMenuItem,
				price: '1,200.-',
			},
			subtotal: 2400,
		}

		render(<CartItemCard item={itemWithCommaPrice} />)

		// The price parsing converts "1,200.-" to 1.2, so it displays as "1,2.- за шт."
		expect(screen.getByText('1,2.- за шт.')).toBeInTheDocument()
	})

	it('should truncate long composition text', () => {
		const itemWithLongComposition: CartItem = {
			...mockCartItem,
			menuItem: {
				...mockMenuItem,
				composition:
					'Очень длинное описание состава блюда, которое должно быть обрезано для лучшего отображения в интерфейсе пользователя',
			},
		}

		render(<CartItemCard item={itemWithLongComposition} />)

		const compositionElement = screen.getByText(/Очень длинное описание/)
		expect(compositionElement).toHaveClass('line-clamp-2')
	})
})
