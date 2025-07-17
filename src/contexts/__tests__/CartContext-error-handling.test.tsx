import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { CartProvider, useCart } from '../CartContext'
import { ToastProvider } from '@/components/ui/toast'
import type { MenuItem } from '@/types/delivery'

// Mock localStorage
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
	value: mockLocalStorage,
})

// Test component to interact with cart
function TestCartComponent() {
	const { items, addItem, removeItem, updateQuantity, clearCart } = useCart()

	const testMenuItem: MenuItem = {
		id: 1,
		name: 'Test Pizza',
		composition: 'Test ingredients',
		legend: 'Test legend',
		weight: '300g',
		price: '500.-',
		imageUrl: '/test.jpg',
		category: 'pizza',
	}

	return (
		<div>
			<div data-testid='cart-items'>{items.length}</div>
			<button onClick={() => addItem(testMenuItem)}>Add Item</button>
			<button onClick={() => removeItem(1)}>Remove Item</button>
			<button onClick={() => updateQuantity(1, 5)}>Update Quantity</button>
			<button onClick={() => updateQuantity(1, 0)}>Set Quantity to Zero</button>
			<button onClick={clearCart}>Clear Cart</button>
		</div>
	)
}

// Wrapper component with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<ToastProvider>
			<CartProvider>{children}</CartProvider>
		</ToastProvider>
	)
}

describe('CartContext Error Handling and Toast Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockLocalStorage.getItem.mockReturnValue(null)
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.runOnlyPendingTimers()
		vi.useRealTimers()
	})

	it('should show success toast when item is added to cart', async () => {
		render(
			<TestWrapper>
				<TestCartComponent />
			</TestWrapper>
		)

		fireEvent.click(screen.getByText('Add Item'))

		await waitFor(() => {
			expect(screen.getByText('Добавлено в корзину')).toBeInTheDocument()
			expect(screen.getByText('Test Pizza')).toBeInTheDocument()
		})
	})

	it('should show info toast when item is removed from cart', async () => {
		render(
			<TestWrapper>
				<TestCartComponent />
			</TestWrapper>
		)

		// First add an item
		fireEvent.click(screen.getByText('Add Item'))

		// Wait for success toast to appear and dismiss it
		await waitFor(() => {
			expect(screen.getByText('Добавлено в корзину')).toBeInTheDocument()
		})

		// Advance time to dismiss the success toast
		vi.advanceTimersByTime(3000)

		await waitFor(() => {
			expect(screen.queryByText('Добавлено в корзину')).not.toBeInTheDocument()
		})

		// Now remove the item
		fireEvent.click(screen.getByText('Remove Item'))

		await waitFor(() => {
			expect(screen.getByText('Удалено из корзины')).toBeInTheDocument()
			expect(screen.getByText('Test Pizza')).toBeInTheDocument()
		})
	})

	it('should show info toast when quantity is set to zero', async () => {
		render(
			<TestWrapper>
				<TestCartComponent />
			</TestWrapper>
		)

		// First add an item
		fireEvent.click(screen.getByText('Add Item'))

		// Wait for success toast and dismiss it
		await waitFor(() => {
			expect(screen.getByText('Добавлено в корзину')).toBeInTheDocument()
		})

		vi.advanceTimersByTime(3000)

		await waitFor(() => {
			expect(screen.queryByText('Добавлено в корзину')).not.toBeInTheDocument()
		})

		// Set quantity to zero (should remove item)
		fireEvent.click(screen.getByText('Set Quantity to Zero'))

		await waitFor(() => {
			expect(screen.getByText('Удалено из корзины')).toBeInTheDocument()
		})
	})

	it('should show info toast when cart is cleared', async () => {
		render(
			<TestWrapper>
				<TestCartComponent />
			</TestWrapper>
		)

		// First add an item
		fireEvent.click(screen.getByText('Add Item'))

		// Wait for success toast and dismiss it
		await waitFor(() => {
			expect(screen.getByText('Добавлено в корзину')).toBeInTheDocument()
		})

		vi.advanceTimersByTime(3000)

		await waitFor(() => {
			expect(screen.queryByText('Добавлено в корзину')).not.toBeInTheDocument()
		})

		// Clear cart
		fireEvent.click(screen.getByText('Clear Cart'))

		await waitFor(() => {
			expect(screen.getByText('Корзина очищена')).toBeInTheDocument()
			expect(screen.getByText('Удалено 1 товар')).toBeInTheDocument()
		})
	})

	it('should not show toast when clearing empty cart', async () => {
		render(
			<TestWrapper>
				<TestCartComponent />
			</TestWrapper>
		)

		// Clear empty cart
		fireEvent.click(screen.getByText('Clear Cart'))

		// Should not show any toast
		await waitFor(() => {
			expect(screen.queryByText('Корзина очищена')).not.toBeInTheDocument()
		})
	})

	it('should handle localStorage errors gracefully', () => {
		// Mock localStorage to throw an error
		mockLocalStorage.setItem.mockImplementation(() => {
			throw new Error('Storage quota exceeded')
		})

		// Spy on console.warn to check if error is logged
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		render(
			<TestWrapper>
				<TestCartComponent />
			</TestWrapper>
		)

		// Add item (this should trigger localStorage save)
		fireEvent.click(screen.getByText('Add Item'))

		// Should still work and show toast
		expect(screen.getByText('Добавлено в корзину')).toBeInTheDocument()

		// Should log warning about localStorage failure
		expect(consoleSpy).toHaveBeenCalledWith(
			'Failed to save cart to localStorage:',
			expect.any(Error)
		)

		consoleSpy.mockRestore()
	})

	it('should handle corrupted localStorage data gracefully', () => {
		// Mock localStorage to return corrupted data
		mockLocalStorage.getItem.mockReturnValue('invalid json')

		// Spy on console.warn to check if error is logged
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		render(
			<TestWrapper>
				<TestCartComponent />
			</TestWrapper>
		)

		// Should still render without crashing
		expect(screen.getByTestId('cart-items')).toHaveTextContent('0')

		// Should log warning about localStorage failure
		expect(consoleSpy).toHaveBeenCalledWith(
			'Failed to load cart from localStorage:',
			expect.any(Error)
		)

		consoleSpy.mockRestore()
	})

	it('should handle version mismatch in localStorage', () => {
		// Mock localStorage to return data with wrong version
		const oldVersionData = {
			items: [],
			lastUpdated: new Date().toISOString(),
			version: 999, // Wrong version
		}
		mockLocalStorage.getItem.mockReturnValue(JSON.stringify(oldVersionData))

		// Spy on console.warn to check if warning is logged
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		render(
			<TestWrapper>
				<TestCartComponent />
			</TestWrapper>
		)

		// Should start with empty cart
		expect(screen.getByTestId('cart-items')).toHaveTextContent('0')

		// Should log warning about version mismatch
		expect(consoleSpy).toHaveBeenCalledWith(
			'Cart storage version mismatch, clearing cart'
		)

		// Should remove the old data
		expect(mockLocalStorage.removeItem).toHaveBeenCalled()

		consoleSpy.mockRestore()
	})
})
