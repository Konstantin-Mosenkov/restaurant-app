import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { CartSummary } from '../cart-summary'
import { CartProvider } from '@/contexts/CartContext'
//import type { MenuItem } from '@/types/delivery'

// Mock menu item for testing

// Wrapper component for router and cart context
function renderWithProviders(component: React.ReactElement) {
	return render(
		<BrowserRouter>
			<CartProvider>{component}</CartProvider>
		</BrowserRouter>
	)
}

describe('CartSummary', () => {
	beforeEach(() => {
		// Clear localStorage before each test
		localStorage.clear()
	})

	it('should display empty cart state', () => {
		renderWithProviders(<CartSummary />)

		expect(screen.getByText('0.-')).toBeInTheDocument() // Empty cart subtotal
		expect(screen.getByText('Сумма заказа:')).toBeInTheDocument()
		expect(screen.getByText('Доставка:')).toBeInTheDocument()
		expect(screen.getByText('К оплате:')).toBeInTheDocument()
	})

	it('should show delivery fee for empty cart', () => {
		renderWithProviders(<CartSummary />)

		// Check that delivery section exists and contains the fee
		const deliverySection = screen.getByText('Доставка:').parentElement
		expect(deliverySection).toHaveTextContent('300.-')
		expect(screen.getByText('Доставка:')).toBeInTheDocument()
	})

	it('should show minimum order warning for empty cart', () => {
		renderWithProviders(<CartSummary />)

		expect(screen.getByText('Минимальная сумма заказа:')).toBeInTheDocument()
		expect(screen.getByText('500.-')).toBeInTheDocument()
	})

	it('should disable checkout button for empty cart', () => {
		renderWithProviders(<CartSummary />)

		const checkoutButton = screen.getByRole('button', {
			name: /добавьте еще товаров/i,
		})
		expect(checkoutButton).toBeDisabled()
	})

	it('should have correct links for navigation', () => {
		renderWithProviders(<CartSummary />)

		const continueShoppingLink = screen.getByRole('link', {
			name: /продолжить покупки/i,
		})
		expect(continueShoppingLink).toHaveAttribute('href', '/menu')
	})

	it('should display free delivery progress bar for empty cart', () => {
		renderWithProviders(<CartSummary />)

		expect(
			screen.getByText('До бесплатной доставки осталось:')
		).toBeInTheDocument()

		// Check progress bar exists
		const progressBar = screen.getByTestId('progress-bar')
		expect(progressBar).toBeInTheDocument()
		expect(progressBar).toHaveStyle('width: 0%')
	})

	it('should show correct total calculation for empty cart', () => {
		renderWithProviders(<CartSummary />)

		// Check that total section exists and contains the correct amount
		const totalSection = screen.getByText('К оплате:').parentElement
		expect(totalSection).toHaveTextContent('300.-')
		expect(screen.getByText('К оплате:')).toBeInTheDocument()
	})

	it('should show remaining amount for free delivery', () => {
		renderWithProviders(<CartSummary />)

		// For empty cart, need 2000 for free delivery
		expect(screen.getByText('2 000.-')).toBeInTheDocument() // Remaining amount
	})
})
