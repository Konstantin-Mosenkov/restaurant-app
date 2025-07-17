import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import {
	ErrorBoundary,
	CartErrorBoundary,
	CheckoutErrorBoundary,
} from '../error-boundary'

// Component that throws an error
function ThrowError({ shouldThrow = false }: { shouldThrow?: boolean }) {
	if (shouldThrow) {
		throw new Error('Test error')
	}
	return <div>No error</div>
}

// Mock window.location
const mockLocation = {
	href: '',
	reload: vi.fn(),
}

Object.defineProperty(window, 'location', {
	value: mockLocation,
	writable: true,
})

describe('ErrorBoundary', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// Suppress console.error for error boundary tests
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	it('should render children when there is no error', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={false} />
			</ErrorBoundary>
		)

		expect(screen.getByText('No error')).toBeInTheDocument()
	})

	it('should render error UI when child component throws', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		)

		expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument()
		expect(screen.getByText(/Произошла неожиданная ошибка/)).toBeInTheDocument()
		expect(screen.getByText('Попробовать снова')).toBeInTheDocument()
		expect(screen.getByText('На главную')).toBeInTheDocument()
	})

	it('should call onError callback when error occurs', () => {
		const onError = vi.fn()

		render(
			<ErrorBoundary onError={onError}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		)

		expect(onError).toHaveBeenCalledWith(
			expect.any(Error),
			expect.objectContaining({
				componentStack: expect.any(String),
			})
		)
	})

	it('should render custom fallback when provided', () => {
		const customFallback = <div>Custom error message</div>

		render(
			<ErrorBoundary fallback={customFallback}>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		)

		expect(screen.getByText('Custom error message')).toBeInTheDocument()
		expect(screen.queryByText('Что-то пошло не так')).not.toBeInTheDocument()
	})

	it('should reset error state when retry button is clicked', () => {
		const { rerender } = render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		)

		expect(screen.getByText('Что-то пошло не так')).toBeInTheDocument()

		// Click retry button
		fireEvent.click(screen.getByText('Попробовать снова'))

		// Re-render with no error
		rerender(
			<ErrorBoundary>
				<ThrowError shouldThrow={false} />
			</ErrorBoundary>
		)

		expect(screen.getByText('No error')).toBeInTheDocument()
		expect(screen.queryByText('Что-то пошло не так')).not.toBeInTheDocument()
	})

	it('should navigate to home when home button is clicked', () => {
		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		)

		fireEvent.click(screen.getByText('На главную'))

		expect(mockLocation.href).toBe('/')
	})

	it('should show error details in development mode', () => {
		// Mock development environment
		const originalEnv = process.env.NODE_ENV
		process.env.NODE_ENV = 'development'

		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>
		)

		expect(
			screen.getByText('Детали ошибки (только для разработки)')
		).toBeInTheDocument()

		// Restore original environment
		process.env.NODE_ENV = originalEnv
	})
})

describe('CartErrorBoundary', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	it('should render children when there is no error', () => {
		render(
			<CartErrorBoundary>
				<ThrowError shouldThrow={false} />
			</CartErrorBoundary>
		)

		expect(screen.getByText('No error')).toBeInTheDocument()
	})

	it('should render cart-specific error UI when child component throws', () => {
		render(
			<CartErrorBoundary>
				<ThrowError shouldThrow={true} />
			</CartErrorBoundary>
		)

		expect(screen.getByText('Ошибка корзины')).toBeInTheDocument()
		expect(screen.getByText(/Не удалось загрузить корзину/)).toBeInTheDocument()
		expect(screen.getByText('Обновить страницу')).toBeInTheDocument()
	})

	it('should reload page when refresh button is clicked', () => {
		render(
			<CartErrorBoundary>
				<ThrowError shouldThrow={true} />
			</CartErrorBoundary>
		)

		fireEvent.click(screen.getByText('Обновить страницу'))

		expect(mockLocation.reload).toHaveBeenCalled()
	})
})

describe('CheckoutErrorBoundary', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.spyOn(console, 'error').mockImplementation(() => {})
	})

	it('should render children when there is no error', () => {
		render(
			<CheckoutErrorBoundary>
				<ThrowError shouldThrow={false} />
			</CheckoutErrorBoundary>
		)

		expect(screen.getByText('No error')).toBeInTheDocument()
	})

	it('should render checkout-specific error UI when child component throws', () => {
		render(
			<CheckoutErrorBoundary>
				<ThrowError shouldThrow={true} />
			</CheckoutErrorBoundary>
		)

		expect(screen.getByText('Ошибка оформления заказа')).toBeInTheDocument()
		expect(
			screen.getByText(/Произошла ошибка при оформлении заказа/)
		).toBeInTheDocument()
		expect(screen.getByText('Вернуться в корзину')).toBeInTheDocument()
		expect(screen.getByText('Продолжить покупки')).toBeInTheDocument()
	})

	it('should navigate to cart when cart button is clicked', () => {
		render(
			<CheckoutErrorBoundary>
				<ThrowError shouldThrow={true} />
			</CheckoutErrorBoundary>
		)

		fireEvent.click(screen.getByText('Вернуться в корзину'))

		expect(mockLocation.href).toBe('/cart')
	})

	it('should navigate to menu when menu button is clicked', () => {
		render(
			<CheckoutErrorBoundary>
				<ThrowError shouldThrow={true} />
			</CheckoutErrorBoundary>
		)

		fireEvent.click(screen.getByText('Продолжить покупки'))

		expect(mockLocation.href).toBe('/menu')
	})
})
