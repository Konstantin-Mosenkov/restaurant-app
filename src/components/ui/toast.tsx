import React, { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
	id: string
	type: ToastType
	title: string
	description?: string
	duration?: number
}

interface ToastContextType {
	toasts: Toast[]
	addToast: (toast: Omit<Toast, 'id'>) => void
	removeToast: (id: string) => void
	clearToasts: () => void
}

// Create toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Custom hook to use toast
export function useToast() {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}

// Toast provider component
interface ToastProviderProps {
	children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
	const [toasts, setToasts] = useState<Toast[]>([])

	const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
		const id = Math.random().toString(36).substring(2, 9)
		const newToast: Toast = {
			...toast,
			id,
			duration: toast.duration ?? 5000,
		}

		setToasts((prev) => [...prev, newToast])

		// Auto-remove toast after duration
		if (newToast.duration && newToast.duration > 0) {
			setTimeout(() => {
				removeToast(id)
			}, newToast.duration)
		}
	}, [])

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id))
	}, [])

	const clearToasts = useCallback(() => {
		setToasts([])
	}, [])

	return (
		<ToastContext.Provider
			value={{ toasts, addToast, removeToast, clearToasts }}
		>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	)
}

// Toast container component
function ToastContainer() {
	const { toasts } = useToast()

	if (toasts.length === 0) return null

	return (
		<div className='fixed top-4 right-4 z-50 space-y-2 max-w-sm'>
			{toasts.map((toast) => (
				<ToastItem key={toast.id} toast={toast} />
			))}
		</div>
	)
}

// Individual toast item component
interface ToastItemProps {
	toast: Toast
}

function ToastItem({ toast }: ToastItemProps) {
	const { removeToast } = useToast()

	const getToastStyles = (type: ToastType) => {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800'
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800'
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800'
			case 'info':
				return 'bg-blue-50 border-blue-200 text-blue-800'
			default:
				return 'bg-gray-50 border-gray-200 text-gray-800'
		}
	}

	const getIcon = (type: ToastType) => {
		const iconClass = 'w-5 h-5 flex-shrink-0'
		switch (type) {
			case 'success':
				return <CheckCircle className={cn(iconClass, 'text-green-500')} />
			case 'error':
				return <AlertCircle className={cn(iconClass, 'text-red-500')} />
			case 'warning':
				return <AlertTriangle className={cn(iconClass, 'text-yellow-500')} />
			case 'info':
				return <Info className={cn(iconClass, 'text-blue-500')} />
			default:
				return <Info className={cn(iconClass, 'text-gray-500')} />
		}
	}

	return (
		<div
			className={cn(
				'flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full',
				getToastStyles(toast.type)
			)}
		>
			{getIcon(toast.type)}
			<div className='flex-1 min-w-0'>
				<p className='font-medium text-sm'>{toast.title}</p>
				{toast.description && (
					<p className='text-sm opacity-90 mt-1'>{toast.description}</p>
				)}
			</div>
			<button
				onClick={() => removeToast(toast.id)}
				className='flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors'
			>
				<X className='w-4 h-4' />
			</button>
		</div>
	)
}

// Convenience functions for different toast types
export const toast = {
	success: (title: string, description?: string, duration?: number) => {
		const { addToast } = useToast()
		addToast({ type: 'success', title, description, duration })
	},
	error: (title: string, description?: string, duration?: number) => {
		const { addToast } = useToast()
		addToast({ type: 'error', title, description, duration })
	},
	warning: (title: string, description?: string, duration?: number) => {
		const { addToast } = useToast()
		addToast({ type: 'warning', title, description, duration })
	},
	info: (title: string, description?: string, duration?: number) => {
		const { addToast } = useToast()
		addToast({ type: 'info', title, description, duration })
	},
}
