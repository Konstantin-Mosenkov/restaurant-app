import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, MapPin, Phone, User } from 'lucide-react'
import type { OrderDetails } from '@/types/delivery'

interface OrderConfirmationState {
	orderId: string
	orderDetails: OrderDetails
}

export default function OrderConfirmation() {
	const location = useLocation()
	const navigate = useNavigate()

	// Get order data from navigation state
	const state = location.state as OrderConfirmationState | null

	// Redirect to home if no order data
	React.useEffect(() => {
		if (!state?.orderId || !state?.orderDetails) {
			navigate('/', { replace: true })
		}
	}, [state, navigate])

	if (!state?.orderId || !state?.orderDetails) {
		return null
	}

	const { orderId, orderDetails } = state
	const { items, subtotal, deliveryFee, total, deliveryTime, customerInfo } =
		orderDetails

	const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

	return (
		<div className='min-h-screen bg-gray-50 py-8'>
			<div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
					{/* Success Header */}
					<div className='bg-green-50 px-6 py-8 text-center border-b border-green-100'>
						<CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
						<h1 className='text-2xl font-bold text-gray-900 mb-2'>
							Заказ успешно оформлен!
						</h1>
						<p className='text-gray-600'>
							Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее время.
						</p>
					</div>

					<div className='p-6 space-y-6'>
						{/* Order Number */}
						<div className='bg-gray-50 rounded-lg p-4'>
							<h2 className='text-lg font-semibold text-gray-900 mb-2'>
								Номер заказа
							</h2>
							<p className='text-2xl font-mono font-bold text-blue-600'>
								{orderId}
							</p>
						</div>

						{/* Customer Information */}
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Информация о доставке
							</h3>

							<div className='space-y-3'>
								<div className='flex items-center gap-3'>
									<User className='w-5 h-5 text-gray-400' />
									<span className='text-gray-900'>{customerInfo.name}</span>
								</div>

								<div className='flex items-center gap-3'>
									<Phone className='w-5 h-5 text-gray-400' />
									<span className='text-gray-900'>{customerInfo.phone}</span>
								</div>

								<div className='flex items-start gap-3'>
									<MapPin className='w-5 h-5 text-gray-400 mt-0.5' />
									<span className='text-gray-900'>{customerInfo.address}</span>
								</div>

								{deliveryTime && (
									<div className='flex items-center gap-3'>
										<Clock className='w-5 h-5 text-gray-400' />
										<span className='text-gray-900'>
											{deliveryTime.date}, {deliveryTime.timeRange}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Order Items */}
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Состав заказа
							</h3>

							<div className='space-y-3'>
								{items.map((item) => (
									<div
										key={item.id}
										className='flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0'
									>
										<div className='flex-1'>
											<h4 className='font-medium text-gray-900'>
												{item.menuItem.name}
											</h4>
											<p className='text-sm text-gray-500 mt-1'>
												{item.menuItem.weight} • {item.menuItem.price}
											</p>
										</div>
										<div className='text-right ml-4'>
											<p className='font-medium text-gray-900'>
												{item.quantity} × {item.menuItem.price}
											</p>
											<p className='text-sm text-gray-500'>
												= {item.subtotal}.-
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Order Summary */}
						<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Итого к оплате
							</h3>

							<div className='space-y-2 text-sm'>
								<div className='flex justify-between'>
									<span>Количество позиций:</span>
									<span>{items.length}</span>
								</div>
								<div className='flex justify-between'>
									<span>Общее количество:</span>
									<span>{totalQuantity}</span>
								</div>
								<div className='flex justify-between'>
									<span>Сумма заказа:</span>
									<span>{subtotal}.-</span>
								</div>
								<div className='flex justify-between'>
									<span>Доставка:</span>
									<span>{deliveryFee}.-</span>
								</div>
								<div className='border-t border-gray-300 pt-2 flex justify-between font-semibold text-base'>
									<span>Итого:</span>
									<span>{total}.-</span>
								</div>
							</div>
						</div>

						{/* Next Steps */}
						<div className='bg-blue-50 rounded-lg p-4'>
							<h3 className='text-lg font-semibold text-blue-900 mb-2'>
								Что дальше?
							</h3>
							<ul className='text-sm text-blue-800 space-y-1'>
								<li>• Мы свяжемся с вами для подтверждения заказа</li>
								<li>• Приготовление займет 30-45 минут</li>
								<li>• Доставка осуществляется в указанное время</li>
								<li>• Оплата при получении</li>
							</ul>
						</div>

						{/* Action Buttons */}
						<div className='flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200'>
							<Button
								variant='outline'
								onClick={() => navigate('/menu')}
								className='flex-1'
							>
								Продолжить покупки
							</Button>

							<Link to='/' className='flex-1'>
								<Button className='w-full'>На главную</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
