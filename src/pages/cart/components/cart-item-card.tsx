import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '@/types/delivery'
import { formatPrice } from '@/lib/delivery-utils'
import { CART_CONFIG } from '@/lib/delivery-constants'

interface CartItemCardProps {
	item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps): React.ReactElement {
	const { updateQuantity, removeItem } = useCart()
	const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

	const handleQuantityDecrease = () => {
		if (item.quantity > 1) {
			updateQuantity(item.id, item.quantity - 1)
		} else {
			// If quantity would become 0, show remove confirmation
			setShowRemoveConfirm(true)
		}
	}

	const handleQuantityIncrease = () => {
		if (item.quantity < CART_CONFIG.MAX_QUANTITY_PER_ITEM) {
			updateQuantity(item.id, item.quantity + 1)
		}
	}

	const handleRemoveItem = () => {
		removeItem(item.id)
		setShowRemoveConfirm(false)
	}

	const handleCancelRemove = () => {
		setShowRemoveConfirm(false)
	}

	return (
		<div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200'>
			<div className='flex flex-col sm:flex-row gap-4'>
				{/* Mobile layout: Image and price row */}
				<div className='flex sm:hidden justify-between items-start mb-3'>
					<div className='flex gap-3'>
						<img
							src={item.menuItem.imageUrl}
							alt={item.menuItem.name}
							className='w-16 h-16 object-cover rounded-lg flex-shrink-0'
						/>
						<div className='flex-grow min-w-0'>
							<h3 className='font-semibold text-gray-900 text-base leading-tight mb-1'>
								{item.menuItem.name}
							</h3>
							<div className='text-xs text-gray-500'>
								{item.menuItem.weight}
							</div>
						</div>
					</div>
					<div className='text-right flex-shrink-0 ml-2'>
						<div className='font-semibold text-base text-gray-900'>
							{formatPrice(item.subtotal)}
						</div>
						<div className='text-xs text-gray-500'>
							{formatPrice(
								parseFloat(
									item.menuItem.price
										.replace(/[^\d,.-]/g, '')
										.replace(/\.-$/, '')
										.replace(/-$/, '')
										.replace(',', '.')
								)
							)}{' '}
							за шт.
						</div>
					</div>
				</div>

				{/* Desktop layout: Image */}
				<div className='hidden sm:block flex-shrink-0'>
					<img
						src={item.menuItem.imageUrl}
						alt={item.menuItem.name}
						className='w-20 h-20 object-cover rounded-lg'
					/>
				</div>

				{/* Item details */}
				<div className='flex-grow min-w-0'>
					{/* Desktop title and price */}
					<div className='hidden sm:flex justify-between items-start mb-2'>
						<h3 className='font-semibold text-gray-900 text-lg'>
							{item.menuItem.name}
						</h3>
						<div className='text-right flex-shrink-0 ml-4'>
							<div className='font-semibold text-lg text-gray-900'>
								{formatPrice(item.subtotal)}
							</div>
							<div className='text-sm text-gray-500'>
								{formatPrice(
									parseFloat(
										item.menuItem.price
											.replace(/[^\d,.-]/g, '')
											.replace(/\.-$/, '')
											.replace(/-$/, '')
											.replace(',', '.')
									)
								)}{' '}
								за шт.
							</div>
						</div>
					</div>

					{/* Composition */}
					<p className='text-gray-600 text-sm mb-3 line-clamp-2'>
						{item.menuItem.composition}
					</p>

					{/* Desktop weight */}
					<div className='hidden sm:block text-sm text-gray-500 mb-4'>
						{item.menuItem.weight}
					</div>

					{/* Quantity controls and remove button */}
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
						{!showRemoveConfirm ? (
							<>
								{/* Quantity controls */}
								<div className='flex items-center gap-3'>
									<Button
										variant='outline'
										size='sm'
										onClick={handleQuantityDecrease}
										className='w-10 h-10 sm:w-8 sm:h-8 p-0 rounded-full touch-manipulation'
									>
										<Minus className='w-4 h-4' />
									</Button>

									<span className='font-semibold text-lg min-w-[2rem] text-center'>
										{item.quantity}
									</span>

									<Button
										variant='outline'
										size='sm'
										onClick={handleQuantityIncrease}
										disabled={
											item.quantity >= CART_CONFIG.MAX_QUANTITY_PER_ITEM
										}
										className='w-10 h-10 sm:w-8 sm:h-8 p-0 rounded-full touch-manipulation'
									>
										<Plus className='w-4 h-4' />
									</Button>
								</div>

								{/* Remove button */}
								<Button
									variant='ghost'
									size='sm'
									onClick={() => setShowRemoveConfirm(true)}
									className='text-red-600 hover:text-red-700 hover:bg-red-50 self-start sm:self-auto touch-manipulation'
								>
									<Trash2 className='w-4 h-4 mr-1' />
									<span className='hidden sm:inline'>Удалить</span>
									<span className='sm:hidden'>Удалить</span>
								</Button>
							</>
						) : (
							/* Remove confirmation */
							<div className='flex flex-col sm:flex-row sm:items-center gap-2 w-full'>
								<span className='text-sm text-gray-700 flex-grow'>
									Удалить товар из корзины?
								</span>
								<div className='flex gap-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={handleCancelRemove}
										className='touch-manipulation'
									>
										Отмена
									</Button>
									<Button
										variant='destructive'
										size='sm'
										onClick={handleRemoveItem}
										className='touch-manipulation'
									>
										Удалить
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
