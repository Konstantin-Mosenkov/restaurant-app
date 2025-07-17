import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'
import type { MenuItem } from '@/types/delivery'
import { CART_CONFIG } from '@/lib/delivery-constants'

// Mock menu items for testing
const mockMenuItem1: MenuItem = {
	id: 1,
	name: 'Test Pizza',
	composition: 'Test ingredients',
	legend: 'Test legend',
	weight: '300g',
	price: '500.-',
	imageUrl: '/test-image.jpg',
	category: 'pizza',
}

const mockMenuItem2: MenuItem = {
	id: 2,
	name: 'Test Salad',
	composition: 'Fresh vegetables',
	legend: 'Healthy option',
	weight: '200g',
	price: '350.-',
	imageUrl: '/test-salad.jpg',
	category: 'salads',
}

// Test component to access cart context
function TestComponent() {
	const cart = useCart()

	return (
		<div>
			<div data-testid='item-count'>{cart.itemCount}</div>
			<div data-testid='subtotal'>{cart.subtotal}</div>
			<div data-testid='items-length'>{cart.items.length}</div>
			<button
				data-testid='add-item-1'
				onClick={() => cart.addItem(mockMenuItem1)}
			>
				Add Item 1
			</button>
			<button
				data-testid='add-item-2'
				onClick={() => cart.addItem(mockMenuItem2)}
			>
				Add Item 2
			</button>
			<button data-testid='remove-item-1' onClick={() => cart.removeItem(1)}>
				Remove Item 1
			</button>
			<button
				data-testid='update-quantity'
				onClick={() => cart.updateQuantity(1, 3)}
			>
				Update Quantity
			</button>
			<button data-testid='clear-cart' onClick={() => cart.clearCart()}>
				Clear Cart
			</button>
			{cart.items.map((item) => (
				<div key={item.id} data-testid={`item-${item.id}`}>
					<span data-testid={`item-${item.id}-quantity`}>{item.quantity}</span>
					<span data-testid={`item-${item.id}-subtotal`}>{item.subtotal}</span>
				</div>
			))}
		</div>
	)
}

function renderWithCartProvider() {
	return render(
		<CartProvider>
			<TestComponent />
		</CartProvider>
	)
}

describe('CartContext', () => {
	beforeEach(() => {
		// Clear localStorage mock before each test
		vi.clearAllMocks()
	})

	describe('useCart hook', () => {
		it('should throw error when used outside CartProvider', () => {
			// Suppress console.error for this test
			const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

			expect(() => {
				render(<TestComponent />)
			}).toThrow('useCart must be used within a CartProvider')

			consoleSpy.mockRestore()
		})
	})

	describe('Initial state', () => {
		it('should initialize with empty cart', () => {
			renderWithCartProvider()

			expect(screen.getByTestId('item-count')).toHaveTextContent('0')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('0')
			expect(screen.getByTestId('items-length')).toHaveTextContent('0')
		})

		it('should load cart from localStorage on mount', () => {
			const storedCart = {
				items: [
					{
						id: 1,
						menuItem: mockMenuItem1,
						quantity: 2,
						subtotal: 1000,
					},
				],
				lastUpdated: new Date().toISOString(),
				version: CART_CONFIG.STORAGE_VERSION,
			}

			// Mock localStorage.getItem to return stored cart
			vi.mocked(localStorage.getItem).mockReturnValue(
				JSON.stringify(storedCart)
			)

			renderWithCartProvider()

			expect(screen.getByTestId('item-count')).toHaveTextContent('2')
			expect(screen.getByTestId('items-length')).toHaveTextContent('1')
		})

		it('should handle invalid localStorage data gracefully', () => {
			// Mock localStorage.getItem to return invalid JSON
			vi.mocked(localStorage.getItem).mockReturnValue('invalid json')

			renderWithCartProvider()

			expect(screen.getByTestId('item-count')).toHaveTextContent('0')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('0')
		})

		it('should clear cart when storage version mismatch', () => {
			const storedCart = {
				items: [{ id: 1, menuItem: mockMenuItem1, quantity: 1, subtotal: 500 }],
				lastUpdated: new Date().toISOString(),
				version: 999, // Wrong version
			}

			vi.mocked(localStorage.getItem).mockReturnValue(
				JSON.stringify(storedCart)
			)

			renderWithCartProvider()

			expect(screen.getByTestId('item-count')).toHaveTextContent('0')
			expect(localStorage.removeItem).toHaveBeenCalledWith(
				CART_CONFIG.STORAGE_KEY
			)
		})
	})

	describe('addItem operation', () => {
		it('should add new item to cart', async () => {
			renderWithCartProvider()

			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			expect(screen.getByTestId('item-count')).toHaveTextContent('1')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('500')
			expect(screen.getByTestId('items-length')).toHaveTextContent('1')
			expect(screen.getByTestId('item-1-quantity')).toHaveTextContent('1')
			expect(screen.getByTestId('item-1-subtotal')).toHaveTextContent('500')
		})

		it('should increment quantity when adding existing item', async () => {
			renderWithCartProvider()

			// Add item twice
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			expect(screen.getByTestId('item-count')).toHaveTextContent('2')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('1000')
			expect(screen.getByTestId('items-length')).toHaveTextContent('1')
			expect(screen.getByTestId('item-1-quantity')).toHaveTextContent('2')
		})

		it('should respect maximum quantity per item', async () => {
			renderWithCartProvider()

			// Add item up to max quantity
			for (let i = 0; i < CART_CONFIG.MAX_QUANTITY_PER_ITEM + 2; i++) {
				await act(async () => {
					screen.getByTestId('add-item-1').click()
				})
			}

			expect(screen.getByTestId('item-1-quantity')).toHaveTextContent(
				CART_CONFIG.MAX_QUANTITY_PER_ITEM.toString()
			)
		})

		it('should add multiple different items', async () => {
			renderWithCartProvider()

			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})
			await act(async () => {
				screen.getByTestId('add-item-2').click()
			})

			expect(screen.getByTestId('item-count')).toHaveTextContent('2')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('850') // 500 + 350
			expect(screen.getByTestId('items-length')).toHaveTextContent('2')
		})
	})

	describe('removeItem operation', () => {
		it('should remove item from cart', async () => {
			renderWithCartProvider()

			// Add item first
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			expect(screen.getByTestId('items-length')).toHaveTextContent('1')

			// Remove item
			await act(async () => {
				screen.getByTestId('remove-item-1').click()
			})

			expect(screen.getByTestId('item-count')).toHaveTextContent('0')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('0')
			expect(screen.getByTestId('items-length')).toHaveTextContent('0')
		})

		it('should not affect other items when removing specific item', async () => {
			renderWithCartProvider()

			// Add two different items
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})
			await act(async () => {
				screen.getByTestId('add-item-2').click()
			})

			// Remove first item
			await act(async () => {
				screen.getByTestId('remove-item-1').click()
			})

			expect(screen.getByTestId('item-count')).toHaveTextContent('1')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('350')
			expect(screen.getByTestId('items-length')).toHaveTextContent('1')
			expect(screen.queryByTestId('item-1')).not.toBeInTheDocument()
			expect(screen.getByTestId('item-2')).toBeInTheDocument()
		})
	})

	describe('updateQuantity operation', () => {
		it('should update item quantity', async () => {
			renderWithCartProvider()

			// Add item first
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			// Update quantity to 3
			await act(async () => {
				screen.getByTestId('update-quantity').click()
			})

			expect(screen.getByTestId('item-count')).toHaveTextContent('3')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('1500') // 500 * 3
			expect(screen.getByTestId('item-1-quantity')).toHaveTextContent('3')
			expect(screen.getByTestId('item-1-subtotal')).toHaveTextContent('1500')
		})

		it('should remove item when quantity is set to 0', async () => {
			// Create a test component that can update quantity to 0
			function TestComponentWithZeroQuantity() {
				const cart = useCart()

				return (
					<div>
						<div data-testid='item-count'>{cart.itemCount}</div>
						<div data-testid='items-length'>{cart.items.length}</div>
						<button
							data-testid='add-item-1'
							onClick={() => cart.addItem(mockMenuItem1)}
						>
							Add Item 1
						</button>
						<button
							data-testid='update-quantity-zero'
							onClick={() => cart.updateQuantity(1, 0)}
						>
							Update Quantity to 0
						</button>
					</div>
				)
			}

			render(
				<CartProvider>
					<TestComponentWithZeroQuantity />
				</CartProvider>
			)

			// Add item first
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			expect(screen.getByTestId('items-length')).toHaveTextContent('1')

			// Update quantity to 0
			await act(async () => {
				screen.getByTestId('update-quantity-zero').click()
			})

			expect(screen.getByTestId('item-count')).toHaveTextContent('0')
			expect(screen.getByTestId('items-length')).toHaveTextContent('0')
		})

		it('should respect maximum quantity per item', async () => {
			// Create a test component that can update quantity beyond max
			function TestComponentWithMaxQuantity() {
				const cart = useCart()

				return (
					<div>
						<div data-testid='item-count'>{cart.itemCount}</div>
						<div data-testid='items-length'>{cart.items.length}</div>
						<button
							data-testid='add-item-1'
							onClick={() => cart.addItem(mockMenuItem1)}
						>
							Add Item 1
						</button>
						<button
							data-testid='update-quantity-max'
							onClick={() =>
								cart.updateQuantity(1, CART_CONFIG.MAX_QUANTITY_PER_ITEM + 5)
							}
						>
							Update Quantity Beyond Max
						</button>
						{cart.items.map((item) => (
							<div key={item.id} data-testid={`item-${item.id}`}>
								<span data-testid={`item-${item.id}-quantity`}>
									{item.quantity}
								</span>
							</div>
						))}
					</div>
				)
			}

			render(
				<CartProvider>
					<TestComponentWithMaxQuantity />
				</CartProvider>
			)

			// Add item first
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			// Try to update to quantity beyond max
			await act(async () => {
				screen.getByTestId('update-quantity-max').click()
			})

			expect(screen.getByTestId('item-1-quantity')).toHaveTextContent(
				CART_CONFIG.MAX_QUANTITY_PER_ITEM.toString()
			)
		})
	})

	describe('clearCart operation', () => {
		it('should clear all items from cart', async () => {
			renderWithCartProvider()

			// Add multiple items
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})
			await act(async () => {
				screen.getByTestId('add-item-2').click()
			})

			expect(screen.getByTestId('items-length')).toHaveTextContent('2')

			// Clear cart
			await act(async () => {
				screen.getByTestId('clear-cart').click()
			})

			expect(screen.getByTestId('item-count')).toHaveTextContent('0')
			expect(screen.getByTestId('subtotal')).toHaveTextContent('0')
			expect(screen.getByTestId('items-length')).toHaveTextContent('0')
		})
	})

	describe('localStorage integration', () => {
		it('should save cart to localStorage when items change', async () => {
			renderWithCartProvider()

			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			expect(localStorage.setItem).toHaveBeenCalledWith(
				CART_CONFIG.STORAGE_KEY,
				expect.stringContaining('"items"')
			)
		})

		it('should handle localStorage save errors gracefully', async () => {
			// Mock localStorage.setItem to throw error
			vi.mocked(localStorage.setItem).mockImplementation(() => {
				throw new Error('Storage quota exceeded')
			})

			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

			renderWithCartProvider()

			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			expect(consoleSpy).toHaveBeenCalledWith(
				'Failed to save cart to localStorage:',
				expect.any(Error)
			)

			consoleSpy.mockRestore()
		})
	})

	describe('cart calculations', () => {
		it('should calculate correct subtotal for multiple items', async () => {
			renderWithCartProvider()

			// Add item 1 twice (500 * 2 = 1000)
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})
			await act(async () => {
				screen.getByTestId('add-item-1').click()
			})

			// Add item 2 once (350 * 1 = 350)
			await act(async () => {
				screen.getByTestId('add-item-2').click()
			})

			expect(screen.getByTestId('subtotal')).toHaveTextContent('1350') // 1000 + 350
			expect(screen.getByTestId('item-count')).toHaveTextContent('3') // 2 + 1
		})

		it('should recalculate subtotals when loading from storage', () => {
			const storedCart = {
				items: [
					{
						id: 1,
						menuItem: mockMenuItem1,
						quantity: 2,
						subtotal: 999, // Incorrect subtotal
					},
				],
				lastUpdated: new Date().toISOString(),
				version: CART_CONFIG.STORAGE_VERSION,
			}

			vi.mocked(localStorage.getItem).mockReturnValue(
				JSON.stringify(storedCart)
			)

			renderWithCartProvider()

			// Should recalculate correct subtotal (500 * 2 = 1000)
			expect(screen.getByTestId('subtotal')).toHaveTextContent('1000')
		})
	})
})
