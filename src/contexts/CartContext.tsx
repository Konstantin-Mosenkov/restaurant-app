import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type {
	CartContextType,
	CartItem,
	MenuItem,
	CartState,
} from '@/types/delivery'
import { CART_CONFIG } from '@/lib/delivery-constants'
import {
	createCartItem,
	updateCartItemQuantity,
	calculateSubtotal,
	calculateDeliveryFee,
	calculateTotal,
} from '@/lib/delivery-utils'
import { useToast } from '@/components/ui/toast'

// Cart action types
type CartAction =
	| { type: 'ADD_ITEM'; payload: MenuItem }
	| { type: 'REMOVE_ITEM'; payload: number }
	| { type: 'UPDATE_QUANTITY'; payload: { itemId: number; quantity: number } }
	| { type: 'CLEAR_CART' }
	| { type: 'LOAD_FROM_STORAGE'; payload: CartItem[] }

// Cart reducer function
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
	switch (action.type) {
		case 'ADD_ITEM': {
			const existingItemIndex = state.findIndex(
				(item) => item.id === action.payload.id
			)

			if (existingItemIndex >= 0) {
				// Item already exists, increment quantity
				const existingItem = state[existingItemIndex]
				const newQuantity = Math.min(
					existingItem.quantity + 1,
					CART_CONFIG.MAX_QUANTITY_PER_ITEM
				)

				const updatedItem = updateCartItemQuantity(existingItem, newQuantity)

				return state.map((item, index) =>
					index === existingItemIndex ? updatedItem : item
				)
			} else {
				// New item, add to cart
				if (state.length >= CART_CONFIG.MAX_ITEMS_IN_CART) {
					return state // Don't add if cart is full
				}

				const newItem = createCartItem(action.payload, 1)
				return [...state, newItem]
			}
		}

		case 'REMOVE_ITEM': {
			return state.filter((item) => item.id !== action.payload)
		}

		case 'UPDATE_QUANTITY': {
			const { itemId, quantity } = action.payload

			if (quantity <= 0) {
				// Remove item if quantity is 0 or negative
				return state.filter((item) => item.id !== itemId)
			}

			const clampedQuantity = Math.min(
				quantity,
				CART_CONFIG.MAX_QUANTITY_PER_ITEM
			)

			return state.map((item) =>
				item.id === itemId
					? updateCartItemQuantity(item, clampedQuantity)
					: item
			)
		}

		case 'CLEAR_CART': {
			return []
		}

		case 'LOAD_FROM_STORAGE': {
			return action.payload
		}

		default:
			return state
	}
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Custom hook to use cart context
export function useCart(): CartContextType {
	const context = useContext(CartContext)
	if (context === undefined) {
		throw new Error('useCart must be used within a CartProvider')
	}
	return context
}

// Local storage utilities
function saveCartToStorage(items: CartItem[]): void {
	try {
		const cartState: CartState = {
			items,
			lastUpdated: new Date().toISOString(),
			version: CART_CONFIG.STORAGE_VERSION,
		}
		localStorage.setItem(CART_CONFIG.STORAGE_KEY, JSON.stringify(cartState))
	} catch (error) {
		console.warn('Failed to save cart to localStorage:', error)
	}
}

function loadCartFromStorage(): CartItem[] {
	try {
		const stored = localStorage.getItem(CART_CONFIG.STORAGE_KEY)
		if (!stored) return []

		const cartState: CartState = JSON.parse(stored)

		// Check version compatibility
		if (cartState.version !== CART_CONFIG.STORAGE_VERSION) {
			console.warn('Cart storage version mismatch, clearing cart')
			localStorage.removeItem(CART_CONFIG.STORAGE_KEY)
			return []
		}

		// Validate cart items structure
		if (!Array.isArray(cartState.items)) {
			return []
		}

		// Recalculate subtotals to ensure consistency
		return cartState.items.map((item) => ({
			...item,
			subtotal: updateCartItemQuantity(item, item.quantity).subtotal,
		}))
	} catch (error) {
		console.warn('Failed to load cart from localStorage:', error)
		return []
	}
}

// Cart provider component
interface CartProviderProps {
	children: React.ReactNode
}

export function CartProvider({
	children,
}: CartProviderProps): React.ReactElement {
	const [items, dispatch] = useReducer(cartReducer, [])
	const { addToast } = useToast()

	// Load cart from localStorage on mount
	useEffect(() => {
		const storedItems = loadCartFromStorage()
		if (storedItems.length > 0) {
			dispatch({ type: 'LOAD_FROM_STORAGE', payload: storedItems })
		}
	}, [])

	// Save cart to localStorage whenever items change
	useEffect(() => {
		saveCartToStorage(items)
	}, [items])

	// Calculate derived values
	const itemCount = items.reduce((total, item) => total + item.quantity, 0)
	const subtotal = calculateSubtotal(items)
	const deliveryFee = calculateDeliveryFee(subtotal)
	const total = calculateTotal(subtotal, deliveryFee)

	// Cart operations with toast notifications
	const addItem = (menuItem: MenuItem): void => {
		const existingItem = items.find((item) => item.id === menuItem.id)
		const wasAtMaxQuantity =
			existingItem && existingItem.quantity >= CART_CONFIG.MAX_QUANTITY_PER_ITEM
		const wasCartFull =
			items.length >= CART_CONFIG.MAX_ITEMS_IN_CART && !existingItem

		dispatch({ type: 'ADD_ITEM', payload: menuItem })

		// Show appropriate toast based on the action result
		if (wasCartFull) {
			addToast({
				type: 'warning',
				title: 'Корзина заполнена',
				description: `Максимальное количество позиций: ${CART_CONFIG.MAX_ITEMS_IN_CART}`,
			})
		} else if (wasAtMaxQuantity) {
			addToast({
				type: 'warning',
				title: 'Достигнуто максимальное количество',
				description: `Максимум ${CART_CONFIG.MAX_QUANTITY_PER_ITEM} шт. на позицию`,
			})
		} else {
			addToast({
				type: 'success',
				title: 'Добавлено в корзину',
				description: menuItem.name,
				duration: 3000,
			})
		}
	}

	const removeItem = (itemId: number): void => {
		const itemToRemove = items.find((item) => item.id === itemId)
		dispatch({ type: 'REMOVE_ITEM', payload: itemId })

		if (itemToRemove) {
			addToast({
				type: 'info',
				title: 'Удалено из корзины',
				description: itemToRemove.menuItem.name,
				duration: 3000,
			})
		}
	}

	const updateQuantity = (itemId: number, quantity: number): void => {
		const item = items.find((item) => item.id === itemId)
		if (!item) return

		const previousQuantity = item.quantity
		dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } })

		if (quantity <= 0) {
			addToast({
				type: 'info',
				title: 'Удалено из корзины',
				description: item.menuItem.name,
				duration: 3000,
			})
		} else if (quantity > previousQuantity) {
			const actualQuantity = Math.min(
				quantity,
				CART_CONFIG.MAX_QUANTITY_PER_ITEM
			)
			if (actualQuantity < quantity) {
				addToast({
					type: 'warning',
					title: 'Достигнуто максимальное количество',
					description: `Максимум ${CART_CONFIG.MAX_QUANTITY_PER_ITEM} шт. на позицию`,
				})
			}
		}
	}

	const clearCart = (): void => {
		const itemCount = items.reduce((total, item) => total + item.quantity, 0)
		dispatch({ type: 'CLEAR_CART' })

		if (itemCount > 0) {
			addToast({
				type: 'info',
				title: 'Корзина очищена',
				description: `Удалено ${itemCount} ${
					itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'
				}`,
				duration: 3000,
			})
		}
	}

	const contextValue: CartContextType = {
		items,
		itemCount,
		subtotal,
		deliveryFee,
		total,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
	}

	return (
		<CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
	)
}
