import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProtectedRoute } from '../ProtectedRoute'

// Mock the cart context
const mockUseCart = vi.fn()

vi.mock('@/contexts/CartContext', () => ({
	useCart: () => mockUseCart(),
}))

// Mock Navigate component to track redirects
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom')
	return {
		...actual,
		Navigate: ({ to, replace }: { to: string; replace?: boolean }) => {
			mockNavigate(to, replace)
			return <div data-testid='navigate' data-to={to} data-replace={replace} />
		},
	}
})

describe('ProtectedRoute', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should render children when no protection is required', () => {
		mockUseCart.mockReturnValue({ itemCount: 0 })

		render(
			<MemoryRouter>
				<ProtectedRoute>
					<div>Test Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		)

		expect(screen.getByText('Test Content')).toBeInTheDocument()
	})

	it('should render children when cart has items and requireItems is true', () => {
		mockUseCart.mockReturnValue({ itemCount: 2 })

		render(
			<MemoryRouter>
				<ProtectedRoute requireItems={true}>
					<div>Protected Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		)

		expect(screen.getByText('Protected Content')).toBeInTheDocument()
	})

	it('should redirect when cart is empty and requireItems is true', () => {
		mockUseCart.mockReturnValue({ itemCount: 0 })

		render(
			<MemoryRouter>
				<ProtectedRoute requireItems={true}>
					<div>Protected Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		)

		expect(mockNavigate).toHaveBeenCalledWith('/menu', true)
		expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
		expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/menu')
		expect(screen.getByTestId('navigate')).toHaveAttribute(
			'data-replace',
			'true'
		)
	})

	it('should redirect to custom path when specified', () => {
		mockUseCart.mockReturnValue({ itemCount: 0 })

		render(
			<MemoryRouter>
				<ProtectedRoute requireItems={true} redirectTo='/cart'>
					<div>Protected Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		)

		expect(mockNavigate).toHaveBeenCalledWith('/cart', true)
		expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/cart')
	})

	it('should render children when cart is empty but requireItems is false', () => {
		mockUseCart.mockReturnValue({ itemCount: 0 })

		render(
			<MemoryRouter>
				<ProtectedRoute requireItems={false}>
					<div>Unprotected Content</div>
				</ProtectedRoute>
			</MemoryRouter>
		)

		expect(screen.getByText('Unprotected Content')).toBeInTheDocument()
	})
})
