import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './button'

interface Props {
	children: ReactNode
	fallback?: ReactNode
	onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
	hasError: boolean
	error: Error | null
	errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
		errorInfo: null,
	}

	public static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
			errorInfo: null,
		}
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo)

		this.setState({
			error,
			errorInfo,
		})

		// Call optional error handler
		if (this.props.onError) {
			this.props.onError(error, errorInfo)
		}
	}

	private handleRetry = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		})
	}

	private handleGoHome = () => {
		window.location.href = '/'
	}

	public render() {
		if (this.state.hasError) {
			// Custom fallback UI
			if (this.props.fallback) {
				return this.props.fallback
			}

			// Default error UI
			return (
				<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
					<div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center'>
						<AlertTriangle className='w-16 h-16 text-red-500 mx-auto mb-4' />
						<h1 className='text-xl font-bold text-gray-900 mb-2'>
							Что-то пошло не так
						</h1>
						<p className='text-gray-600 mb-6'>
							Произошла неожиданная ошибка. Попробуйте обновить страницу или
							вернуться на главную.
						</p>

						<div className='space-y-3'>
							<Button
								onClick={this.handleRetry}
								className='w-full'
								variant='default'
							>
								<RefreshCw className='w-4 h-4 mr-2' />
								Попробовать снова
							</Button>

							<Button
								onClick={this.handleGoHome}
								className='w-full'
								variant='outline'
							>
								<Home className='w-4 h-4 mr-2' />
								На главную
							</Button>
						</div>

						{/* Development error details */}
						{process.env.NODE_ENV === 'development' && this.state.error && (
							<details className='mt-6 text-left'>
								<summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
									Детали ошибки (только для разработки)
								</summary>
								<div className='mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-40'>
									<div className='font-bold mb-2'>Error:</div>
									<div className='mb-2'>{this.state.error.toString()}</div>
									{this.state.errorInfo && (
										<>
											<div className='font-bold mb-2'>Component Stack:</div>
											<div>{this.state.errorInfo.componentStack}</div>
										</>
									)}
								</div>
							</details>
						)}
					</div>
				</div>
			)
		}

		return this.props.children
	}
}

// Specialized error boundary for cart operations
interface CartErrorBoundaryProps {
	children: ReactNode
}

export function CartErrorBoundary({ children }: CartErrorBoundaryProps) {
	const handleCartError = (error: Error, errorInfo: ErrorInfo) => {
		console.error('Cart error:', error, errorInfo)

		// You could send error reports to a logging service here
		// Example: logErrorToService('cart_error', error, errorInfo)
	}

	const cartErrorFallback = (
		<div className='bg-red-50 border border-red-200 rounded-lg p-4 m-4'>
			<div className='flex items-center gap-3'>
				<AlertTriangle className='w-5 h-5 text-red-500 flex-shrink-0' />
				<div>
					<h3 className='font-medium text-red-800'>Ошибка корзины</h3>
					<p className='text-sm text-red-600 mt-1'>
						Не удалось загрузить корзину. Попробуйте обновить страницу.
					</p>
				</div>
			</div>
			<div className='mt-3'>
				<Button
					size='sm'
					variant='outline'
					onClick={() => window.location.reload()}
					className='text-red-700 border-red-300 hover:bg-red-100'
				>
					<RefreshCw className='w-4 h-4 mr-2' />
					Обновить страницу
				</Button>
			</div>
		</div>
	)

	return (
		<ErrorBoundary fallback={cartErrorFallback} onError={handleCartError}>
			{children}
		</ErrorBoundary>
	)
}

// Specialized error boundary for checkout operations
interface CheckoutErrorBoundaryProps {
	children: ReactNode
}

export function CheckoutErrorBoundary({
	children,
}: CheckoutErrorBoundaryProps) {
	const handleCheckoutError = (error: Error, errorInfo: ErrorInfo) => {
		console.error('Checkout error:', error, errorInfo)

		// You could send error reports to a logging service here
		// Example: logErrorToService('checkout_error', error, errorInfo)
	}

	const checkoutErrorFallback = (
		<div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
			<div className='max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center'>
				<AlertTriangle className='w-16 h-16 text-red-500 mx-auto mb-4' />
				<h1 className='text-xl font-bold text-gray-900 mb-2'>
					Ошибка оформления заказа
				</h1>
				<p className='text-gray-600 mb-6'>
					Произошла ошибка при оформлении заказа. Ваша корзина сохранена.
					Попробуйте вернуться в корзину и повторить попытку.
				</p>

				<div className='space-y-3'>
					<Button
						onClick={() => (window.location.href = '/cart')}
						className='w-full'
						variant='default'
					>
						Вернуться в корзину
					</Button>

					<Button
						onClick={() => (window.location.href = '/menu')}
						className='w-full'
						variant='outline'
					>
						Продолжить покупки
					</Button>
				</div>
			</div>
		</div>
	)

	return (
		<ErrorBoundary
			fallback={checkoutErrorFallback}
			onError={handleCheckoutError}
		>
			{children}
		</ErrorBoundary>
	)
}
