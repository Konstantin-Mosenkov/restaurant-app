import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DeliveryTimeSelector } from '@/components/ui/delivery-time-selector'
import { submitOrder, getOrderErrorMessage } from '@/lib/order-service'
import { CheckoutErrorBoundary } from '@/components/ui/error-boundary'
import { useToast } from '@/components/ui/toast'
import { Loader2 } from 'lucide-react'
import type {
	DeliveryTimeSlot,
	CustomerInfo,
	OrderDetails,
} from '@/types/delivery'
import { cn } from '@/lib/utils'

interface FormErrors {
	name?: string
	phone?: string
	address?: string
	deliveryTime?: string
}

export default function Checkout() {
	return (
		<CheckoutErrorBoundary>
			<CheckoutContent />
		</CheckoutErrorBoundary>
	)
}

function CheckoutContent() {
	const navigate = useNavigate()
	const { items, subtotal, deliveryFee, total, clearCart } = useCart()
	const { addToast } = useToast()

	// Form state
	const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
		name: '',
		phone: '',
		address: '',
	})

	const [selectedTimeSlot, setSelectedTimeSlot] =
		useState<DeliveryTimeSlot | null>(null)
	const [errors, setErrors] = useState<FormErrors>({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Redirect if cart is empty
	React.useEffect(() => {
		if (items.length === 0) {
			navigate('/cart')
		}
	}, [items.length, navigate])

	// Form validation
	const validateForm = (): boolean => {
		const newErrors: FormErrors = {}

		// Name validation
		if (!customerInfo.name.trim()) {
			newErrors.name = 'Имя обязательно для заполнения'
		} else if (customerInfo.name.trim().length < 2) {
			newErrors.name = 'Имя должно содержать минимум 2 символа'
		}

		// Phone validation
		const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/
		if (!customerInfo.phone.trim()) {
			newErrors.phone = 'Телефон обязателен для заполнения'
		} else if (!phoneRegex.test(customerInfo.phone.trim())) {
			newErrors.phone = 'Введите корректный номер телефона'
		}

		// Address validation
		if (!customerInfo.address.trim()) {
			newErrors.address = 'Адрес доставки обязателен для заполнения'
		} else if (customerInfo.address.trim().length < 10) {
			newErrors.address = 'Адрес должен содержать минимум 10 символов'
		}

		// Delivery time validation
		if (!selectedTimeSlot) {
			newErrors.deliveryTime = 'Выберите время доставки'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	// Handle form input changes
	const handleInputChange = (field: keyof CustomerInfo, value: string) => {
		setCustomerInfo((prev) => ({
			...prev,
			[field]: value,
		}))

		// Clear error for this field when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: undefined,
			}))
		}
	}

	// Handle time slot selection
	const handleTimeSlotSelect = (slot: DeliveryTimeSlot) => {
		setSelectedTimeSlot(slot)

		// Clear delivery time error
		if (errors.deliveryTime) {
			setErrors((prev) => ({
				...prev,
				deliveryTime: undefined,
			}))
		}
	}

	// Handle order submission
	const handleSubmitOrder = async () => {
		if (!validateForm()) {
			return
		}

		setIsSubmitting(true)

		// Show loading toast
		addToast({
			type: 'info',
			title: 'Оформляем заказ...',
			description: 'Пожалуйста, подождите',
			duration: 0, // Don't auto-dismiss
		})

		try {
			// Create order details
			const orderDetails: OrderDetails = {
				items,
				subtotal,
				deliveryFee,
				total,
				deliveryTime: selectedTimeSlot!,
				customerInfo: {
					name: customerInfo.name.trim(),
					phone: customerInfo.phone.trim(),
					address: customerInfo.address.trim(),
				},
			}

			// Submit order using the order service
			const orderId = await submitOrder(orderDetails)

			// Show success toast
			addToast({
				type: 'success',
				title: 'Заказ успешно оформлен!',
				description: `Номер заказа: ${orderId}`,
				duration: 5000,
			})

			// Clear cart after successful order
			clearCart()

			// Navigate to confirmation page
			navigate('/order-confirmation', {
				state: { orderId, orderDetails },
			})
		} catch (error) {
			console.error('Order submission failed:', error)

			// Get user-friendly error message
			const errorMessage = getOrderErrorMessage(error)

			// Show error to user using toast notification
			addToast({
				type: 'error',
				title: 'Ошибка оформления заказа',
				description: errorMessage,
				duration: 8000, // Longer duration for error messages
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	// Don't render if cart is empty
	if (items.length === 0) {
		return null
	}

	return (
		<div className='min-h-screen bg-gray-50 py-4 sm:py-8 relative'>
			{/* Loading overlay */}
			{isSubmitting && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg p-4 sm:p-6 flex items-center gap-3 sm:gap-4 shadow-xl max-w-sm w-full'>
						<Loader2 className='w-5 h-5 sm:w-6 sm:h-6 animate-spin text-blue-600 flex-shrink-0' />
						<div className='min-w-0'>
							<p className='font-medium text-gray-900 text-sm sm:text-base'>
								Оформляем заказ
							</p>
							<p className='text-xs sm:text-sm text-gray-600'>
								Пожалуйста, не закрывайте страницу
							</p>
						</div>
					</div>
				</div>
			)}

			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='bg-white rounded-lg shadow-sm'>
					<div className='px-4 sm:px-6 py-4 border-b border-gray-200'>
						<h1 className='text-xl sm:text-2xl font-bold text-gray-900'>
							Оформление заказа
						</h1>
					</div>

					<div className='p-4 sm:p-6 space-y-6 sm:space-y-8'>
						{/* Customer Information Form */}
						<div className='space-y-4 sm:space-y-6'>
							<h2 className='text-lg sm:text-xl font-semibold text-gray-900'>
								Контактная информация
							</h2>

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
								{/* Name Field */}
								<div className='space-y-2'>
									<Label htmlFor='name' className='text-sm sm:text-base'>
										Имя <span className='text-red-500'>*</span>
									</Label>
									<Input
										id='name'
										type='text'
										value={customerInfo.name}
										onChange={(e) => handleInputChange('name', e.target.value)}
										placeholder='Введите ваше имя'
										className={cn(
											'h-12 text-base', // Larger touch target for mobile
											errors.name && 'border-red-500 focus:border-red-500'
										)}
									/>
									{errors.name && (
										<p className='text-sm text-red-600'>{errors.name}</p>
									)}
								</div>

								{/* Phone Field */}
								<div className='space-y-2'>
									<Label htmlFor='phone' className='text-sm sm:text-base'>
										Телефон <span className='text-red-500'>*</span>
									</Label>
									<Input
										id='phone'
										type='tel'
										inputMode='tel'
										value={customerInfo.phone}
										onChange={(e) => handleInputChange('phone', e.target.value)}
										placeholder='+7 (999) 123-45-67'
										className={cn(
											'h-12 text-base', // Larger touch target for mobile
											errors.phone && 'border-red-500 focus:border-red-500'
										)}
									/>
									{errors.phone && (
										<p className='text-sm text-red-600'>{errors.phone}</p>
									)}
								</div>
							</div>

							{/* Address Field */}
							<div className='space-y-2'>
								<Label htmlFor='address' className='text-sm sm:text-base'>
									Адрес доставки <span className='text-red-500'>*</span>
								</Label>
								<Input
									id='address'
									type='text'
									value={customerInfo.address}
									onChange={(e) => handleInputChange('address', e.target.value)}
									placeholder='Улица, дом, квартира'
									className={cn(
										'h-12 text-base', // Larger touch target for mobile
										errors.address && 'border-red-500 focus:border-red-500'
									)}
								/>
								{errors.address && (
									<p className='text-sm text-red-600'>{errors.address}</p>
								)}
							</div>
						</div>

						{/* Delivery Time Selection */}
						<div className='space-y-4'>
							<DeliveryTimeSelector
								selectedSlot={selectedTimeSlot}
								onSlotSelect={handleTimeSlotSelect}
							/>
							{errors.deliveryTime && (
								<p className='text-sm text-red-600'>{errors.deliveryTime}</p>
							)}
						</div>

						{/* Order Summary */}
						<div className='bg-gray-50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4'>
							<h3 className='text-base sm:text-lg font-semibold text-gray-900'>
								Итого к оплате
							</h3>

							<div className='space-y-2 text-sm sm:text-base'>
								<div className='flex justify-between'>
									<span>Сумма заказа:</span>
									<span>{subtotal}.-</span>
								</div>
								<div className='flex justify-between'>
									<span>Доставка:</span>
									<span>{deliveryFee}.-</span>
								</div>
								<div className='border-t border-gray-300 pt-2 flex justify-between font-semibold text-base sm:text-lg'>
									<span>Итого:</span>
									<span>{total}.-</span>
								</div>
							</div>

							<div className='text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4'>
								<p>Количество позиций: {items.length}</p>
								<p>
									Общее количество:{' '}
									{items.reduce((sum, item) => sum + item.quantity, 0)}
								</p>
							</div>
						</div>

						{/* Submit Button */}
						<div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200'>
							<Button
								variant='outline'
								onClick={() => navigate('/cart')}
								className='w-full sm:w-auto sm:flex-1 h-12 touch-manipulation'
								disabled={isSubmitting}
							>
								Вернуться в корзину
							</Button>

							<Button
								onClick={handleSubmitOrder}
								disabled={isSubmitting}
								className='w-full sm:w-auto sm:flex-1 h-12 touch-manipulation bg-red-600 hover:bg-red-700'
							>
								{isSubmitting ? (
									<>
										<Loader2 className='w-4 h-4 mr-2 animate-spin' />
										Оформляем заказ...
									</>
								) : (
									'Оформить заказ'
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
