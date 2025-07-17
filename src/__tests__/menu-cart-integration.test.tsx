import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CartProvider } from '@/contexts/CartContext'
import Appetizers from '@/pages/menu/components/appetizers'
import Salads from '@/pages/menu/components/salads'
import Soups from '@/pages/menu/components/soups'
import MainCourses from '@/pages/menu/components/main-courses'
import Dumplings from '@/pages/menu/components/dumplings'
import Pastas from '@/pages/menu/components/pastas'
import Pizzas from '@/pages/menu/components/pizzas'
import Breads from '@/pages/menu/components/breads'
import Sushis from '@/pages/menu/components/sushis'
import Desserts from '@/pages/menu/components/desserts'

// Mock localStorage
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
})

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
	<CartProvider>{children}</CartProvider>
)

describe('Menu Cart Integration', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		localStorageMock.getItem.mockReturnValue(null)
	})

	const menuComponents = [
		{ name: 'Appetizers', component: Appetizers, title: 'Закуски' },
		{ name: 'Salads', component: Salads, title: 'Салаты' },
		{ name: 'Soups', component: Soups, title: 'Супы' },
		{ name: 'MainCourses', component: MainCourses, title: 'Горячее' },
		{ name: 'Dumplings', component: Dumplings, title: 'Пельмени и вареники' },
		{ name: 'Pastas', component: Pastas, title: 'Паста' },
		{ name: 'Pizzas', component: Pizzas, title: 'Пицца' },
		{ name: 'Breads', component: Breads, title: 'Хлеб' },
		{ name: 'Sushis', component: Sushis, title: 'Суши / Роллы' },
		{ name: 'Desserts', component: Desserts, title: 'Десерты' },
	]

	menuComponents.forEach(({ name, component: Component, title }) => {
		describe(`${name} Component`, () => {
			it('should render menu category with title', () => {
				render(
					<TestWrapper>
						<Component />
					</TestWrapper>
				)

				expect(screen.getByText(title)).toBeInTheDocument()
			})

			it('should have "Подробнее" buttons for menu items', () => {
				render(
					<TestWrapper>
						<Component />
					</TestWrapper>
				)

				const detailButtons = screen.getAllByText('Подробнее')
				expect(detailButtons.length).toBeGreaterThan(0)
			})

			it('should open ProductDrawer when "Подробнее" button is clicked', async () => {
				render(
					<TestWrapper>
						<Component />
					</TestWrapper>
				)

				const detailButtons = screen.getAllByText('Подробнее')
				fireEvent.click(detailButtons[0])

				await waitFor(() => {
					const addToCartButtons = screen.getAllByText('Добавить в корзину')
					expect(addToCartButtons.length).toBeGreaterThan(0)
				})
			})

			it('should show cart functionality in ProductDrawer', async () => {
				render(
					<TestWrapper>
						<Component />
					</TestWrapper>
				)

				const detailButtons = screen.getAllByText('Подробнее')
				fireEvent.click(detailButtons[0])

				await waitFor(() => {
					const addToCartButtons = screen.getAllByText('Добавить в корзину')
					expect(addToCartButtons.length).toBeGreaterThan(0)
				})

				// Click add to cart (first button)
				const addToCartButtons = screen.getAllByText('Добавить в корзину')
				fireEvent.click(addToCartButtons[0])

				// Should show quantity controls after adding
				await waitFor(() => {
					const quantityTexts = screen.getAllByText('В корзине: 1 шт.')
					expect(quantityTexts.length).toBeGreaterThan(0)
				})
			})
		})
	})

	it('should maintain cart state across different menu categories', async () => {
		const { rerender } = render(
			<TestWrapper>
				<Appetizers />
			</TestWrapper>
		)

		// Add item from appetizers
		const appetizerDetailButtons = screen.getAllByText('Подробнее')
		fireEvent.click(appetizerDetailButtons[0])

		await waitFor(() => {
			const addToCartButtons = screen.getAllByText('Добавить в корзину')
			fireEvent.click(addToCartButtons[0])
		})

		// Switch to salads component
		rerender(
			<TestWrapper>
				<Salads />
			</TestWrapper>
		)

		// Add item from salads
		const saladDetailButtons = screen.getAllByText('Подробнее')
		fireEvent.click(saladDetailButtons[0])

		await waitFor(() => {
			const addToCartButtons = screen.getAllByText('Добавить в корзину')
			fireEvent.click(addToCartButtons[0])
		})

		// Verify localStorage was called to persist cart
		expect(localStorageMock.setItem).toHaveBeenCalled()
	})
})
