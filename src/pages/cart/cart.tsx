import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CartItemCard } from './components/cart-item-card'
import { CartSummary } from './components/cart-summary'
import { CartErrorBoundary } from '@/components/ui/error-boundary'

export default function Cart(): React.ReactElement {
	return (
		<CartErrorBoundary>
			<CartContent />
		</CartErrorBoundary>
	)
}

function CartContent(): React.ReactElement {
	const { items, itemCount, clearCart } = useCart()

	// Handle empty cart state
	if (items.length === 0) {
		return (
			<div className='min-h-screen bg-gray-50 py-4 sm:py-8'>
				<div className='container mx-auto px-4 max-w-4xl'>
					{/* Header */}
					<div className='flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8'>
						<Link
							to='/menu'
							className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors touch-manipulation'
						>
							<ArrowLeft className='w-5 h-5' />
							<span className='text-sm sm:text-base'>Назад к меню</span>
						</Link>
						<h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
							Корзина
						</h1>
					</div>

					{/* Empty cart state */}
					<div className='bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center'>
						<ShoppingBag className='w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4' />
						<h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-2'>
							Ваша корзина пуста
						</h2>
						<p className='text-sm sm:text-base text-gray-600 mb-6'>
							Добавьте блюда из меню, чтобы оформить заказ
						</p>
						<Link to='/menu'>
							<Button
								size='lg'
								className='bg-red-600 hover:bg-red-700 touch-manipulation'
							>
								Перейти к меню
							</Button>
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50 py-4 sm:py-8'>
			<div className='container mx-auto px-4 max-w-4xl'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8'>
					<div className='flex items-center gap-2 sm:gap-4'>
						<Link
							to='/menu'
							className='flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors touch-manipulation'
						>
							<ArrowLeft className='w-5 h-5' />
							<span className='text-sm sm:text-base'>Назад к меню</span>
						</Link>
						<h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
							Корзина ({itemCount}{' '}
							{itemCount === 1 ? 'товар' : itemCount < 5 ? 'товара' : 'товаров'}
							)
						</h1>
					</div>

					{/* Clear cart button */}
					<Button
						variant='outline'
						onClick={clearCart}
						size='sm'
						className='text-red-600 border-red-200 hover:bg-red-50 self-start sm:self-auto touch-manipulation'
					>
						<span className='hidden sm:inline'>Очистить корзину</span>
						<span className='sm:hidden'>Очистить</span>
					</Button>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
					{/* Cart items */}
					<div className='lg:col-span-2 space-y-3 sm:space-y-4'>
						{items.map((item) => (
							<CartItemCard key={item.id} item={item} />
						))}
					</div>

					{/* Cart summary */}
					<div className='lg:col-span-1'>
						<CartSummary />
					</div>
				</div>
			</div>
		</div>
	)
}
