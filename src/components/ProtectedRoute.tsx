import React from 'react'
import { Navigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'

interface ProtectedRouteProps {
	children: React.ReactNode
	requireItems?: boolean
	redirectTo?: string
}

export function ProtectedRoute({
	children,
	requireItems = false,
	redirectTo = '/menu',
}: ProtectedRouteProps): React.ReactElement {
	const { itemCount } = useCart()

	// If route requires items in cart and cart is empty, redirect
	if (requireItems && itemCount === 0) {
		return <Navigate to={redirectTo} replace />
	}

	return <>{children}</>
}
