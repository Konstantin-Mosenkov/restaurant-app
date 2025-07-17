import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
	formatPrice,
	isMinimumOrderMet,
	isFreeDeliveryEligible,
	calculateFreeDeliveryRemaining,
	calculateFreeDeliveryProgress,
} from '@/lib/delivery-utils'
import { DELIVERY_CONFIG } from '@/lib/delivery-constants'
import { useCart } from '@/contexts/CartContext'

export function CartSummary(): React.ReactElement {
	const { subtotal, deliveryFee, total } = useCart()
	const isFreeDelivery = isFreeDeliveryEligible(subtotal)
	const isMinimumMet = isMinimumOrderMet(subtotal)
	const freeDeliveryRemaining = calculateFreeDeliveryRemaining(subtotal)
	const freeDeliveryProgress = calculateFreeDeliveryProgress(subtotal)

	return (
		<div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200 lg:sticky lg:top-8'>
			<h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6'>
				Итого к оплате
			</h2>

			{/* Order summary */}
			<div className='space-y-3 sm:space-y-4 mb-4 sm:mb-6'>
				<div className='flex justify-between items-center'>
					<span className='text-sm sm:text-base text-gray-600'>
						Сумма заказа:
					</span>
					<span className='font-semibold text-sm sm:text-base'>
						{formatPrice(subtotal)}
					</span>
				</div>

				<div className='flex justify-between items-center'>
					<span className='text-sm sm:text-base text-gray-600'>Доставка:</span>
					<div className='text-right'>
						{isFreeDelivery ? (
							<div>
								<span className='font-semibold text-green-600 text-sm sm:text-base'>
									Бесплатно
								</span>
								<div className='text-xs text-gray-500'>
									при заказе от{' '}
									{formatPrice(DELIVERY_CONFIG.FREE_DELIVERY_THRESHOLD)}
								</div>
							</div>
						) : (
							<span className='font-semibold text-sm sm:text-base'>
								{formatPrice(deliveryFee)}
							</span>
						)}
					</div>
				</div>

				{/* Free delivery progress */}
				{!isFreeDelivery && (
					<div className='bg-gray-50 p-3 rounded-lg'>
						<div className='text-xs sm:text-sm text-gray-600 mb-2'>
							До бесплатной доставки осталось:{' '}
							<span className='font-semibold text-red-600'>
								{formatPrice(freeDeliveryRemaining)}
							</span>
						</div>
						<div className='w-full bg-gray-200 rounded-full h-2'>
							<div
								data-testid='progress-bar'
								className='bg-red-600 h-2 rounded-full transition-all duration-300'
								style={{
									width: `${freeDeliveryProgress}%`,
								}}
							/>
						</div>
					</div>
				)}

				<hr className='border-gray-200' />

				<div className='flex justify-between items-center text-base sm:text-lg font-bold'>
					<span>К оплате:</span>
					<span className='text-red-600'>{formatPrice(total)}</span>
				</div>
			</div>

			{/* Minimum order warning */}
			{!isMinimumMet && (
				<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4'>
					<p className='text-xs sm:text-sm text-yellow-800'>
						Минимальная сумма заказа:{' '}
						<span className='font-semibold'>
							{formatPrice(DELIVERY_CONFIG.MINIMUM_ORDER_AMOUNT)}
						</span>
					</p>
					<p className='text-xs text-yellow-700 mt-1'>
						Добавьте еще на{' '}
						{formatPrice(DELIVERY_CONFIG.MINIMUM_ORDER_AMOUNT - subtotal)}
					</p>
				</div>
			)}

			{/* Checkout button */}
			<Link to='/checkout'>
				<Button
					size='lg'
					className='w-full bg-red-600 hover:bg-red-700 touch-manipulation'
					disabled={!isMinimumMet}
				>
					{isMinimumMet ? 'Оформить заказ' : 'Добавьте еще товаров'}
				</Button>
			</Link>

			{/* Continue shopping link */}
			<Link
				to='/menu'
				className='block text-center text-xs sm:text-sm text-gray-600 hover:text-gray-900 mt-4 transition-colors touch-manipulation'
			>
				Продолжить покупки
			</Link>
		</div>
	)
}
