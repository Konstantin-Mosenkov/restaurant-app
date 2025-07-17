'use client'

import { Drawer } from 'vaul'
import { Plus, Minus, ShoppingCart } from 'lucide-react'
import type { ReactNode } from 'react'
import type { MenuItem } from '@/types/delivery'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'

interface ProductDrawerProps {
	isOpen: boolean
	onClose: () => void
	product: MenuItem
	children?: ReactNode
}

export default function ProductDrawer({
	isOpen,
	onClose,
	product,
	children,
}: ProductDrawerProps) {
	const { items, addItem, updateQuantity, removeItem } = useCart()

	// Find current cart item for this product
	const cartItem = items.find((item) => item.id === product.id)
	const currentQuantity = cartItem?.quantity || 0

	const handleAddToCart = () => {
		addItem(product)
	}

	const handleIncreaseQuantity = () => {
		if (cartItem) {
			updateQuantity(product.id, cartItem.quantity + 1)
		} else {
			addItem(product)
		}
	}

	const handleDecreaseQuantity = () => {
		if (cartItem) {
			if (cartItem.quantity === 1) {
				removeItem(product.id)
			} else {
				updateQuantity(product.id, cartItem.quantity - 1)
			}
		}
	}
	return (
		<Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<Drawer.Portal>
				<Drawer.Overlay className='fixed inset-0 bg-black/40' />
				<Drawer.Content className='bg-gray-100 flex flex-col rounded-t-[10px] h-[80vh] max-h-[800px] fixed bottom-0 left-0 right-0 outline-none'>
					<div className='p-4 bg-milk-500 rounded-t-[10px] flex-1 overflow-y-auto'>
						<div className='mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8' />

						<div className='max-w-4xl mx-auto'>
							{/* Мобильная версия (column) */}
							<div className='md:hidden flex flex-col'>
								<Drawer.Title className='font-medium mb-4 text-gray-900 text-xl'>
									{product.name}
								</Drawer.Title>
								<img
									src={product.imageUrl}
									alt={product.name}
									className='w-full h-48 object-cover rounded-md mb-4'
								/>
								<div className='space-y-3'>
									<p className='text-gray-600'>
										<strong>Состав:</strong> {product.composition}
									</p>
									<p className='text-gray-600'>
										<strong>Вес:</strong> {product.weight}
									</p>
									<p className='text-gray-600'>
										<strong>Цена:</strong> {product.price}
									</p>
									{product.legend && (
										<p className='text-gray-600 italic'>{product.legend}</p>
									)}
								</div>

								{/* Cart controls for mobile */}
								<div className='mt-6 space-y-3'>
									{currentQuantity > 0 ? (
										<div className='flex items-center justify-between'>
											<span className='text-gray-700 font-medium'>
												В корзине: {currentQuantity} шт.
											</span>
											<div className='flex items-center gap-2'>
												<Button
													variant='outline'
													size='icon'
													onClick={handleDecreaseQuantity}
													className='h-8 w-8'
													aria-label='Уменьшить количество'
												>
													<Minus className='h-4 w-4' />
												</Button>
												<span className='min-w-[2rem] text-center font-medium'>
													{currentQuantity}
												</span>
												<Button
													variant='outline'
													size='icon'
													onClick={handleIncreaseQuantity}
													className='h-8 w-8'
													aria-label='Увеличить количество'
												>
													<Plus className='h-4 w-4' />
												</Button>
											</div>
										</div>
									) : (
										<Button
											onClick={handleAddToCart}
											className='w-full bg-gold-500 hover:bg-gold-500/90 text-white'
										>
											<ShoppingCart className='h-4 w-4 mr-2' />
											Добавить в корзину
										</Button>
									)}
								</div>
								{children}
							</div>

							{/* Десктопная версия (2 columns) */}
							<div className='hidden md:flex gap-6'>
								<div className='flex-1'>
									<img
										src={product.imageUrl}
										alt={product.name}
										className='w-full h-full max-h-[400px] object-cover rounded-md sticky top-0'
									/>
								</div>
								<div className='flex-1 space-y-4'>
									<Drawer.Title className='font-medium text-gray-900 text-2xl'>
										{product.name}
									</Drawer.Title>
									<div className='space-y-3'>
										<p className='text-gray-600'>
											<strong>Состав:</strong> {product.composition}
										</p>
										<p className='text-gray-600'>
											<strong>Вес:</strong> {product.weight}
										</p>
										<p className='text-gray-600'>
											<strong>Цена:</strong> {product.price}
										</p>
										{product.legend && (
											<p className='text-gray-600 italic'>{product.legend}</p>
										)}
									</div>

									{/* Cart controls for desktop */}
									<div className='mt-6 space-y-3'>
										{currentQuantity > 0 ? (
											<div className='flex items-center justify-between'>
												<span className='text-gray-700 font-medium'>
													В корзине: {currentQuantity} шт.
												</span>
												<div className='flex items-center gap-2'>
													<Button
														variant='outline'
														size='icon'
														onClick={handleDecreaseQuantity}
														className='h-8 w-8'
														aria-label='Уменьшить количество'
													>
														<Minus className='h-4 w-4' />
													</Button>
													<span className='min-w-[2rem] text-center font-medium'>
														{currentQuantity}
													</span>
													<Button
														variant='outline'
														size='icon'
														onClick={handleIncreaseQuantity}
														className='h-8 w-8'
														aria-label='Увеличить количество'
													>
														<Plus className='h-4 w-4' />
													</Button>
												</div>
											</div>
										) : (
											<Button
												onClick={handleAddToCart}
												className='w-full bg-gold-500 hover:bg-gold-500/90 text-white'
											>
												<ShoppingCart className='h-4 w-4 mr-2' />
												Добавить в корзину
											</Button>
										)}
									</div>
									{children}
								</div>
							</div>
						</div>
					</div>

					<div className='p-4 bg-milk-500'>
						<button
							onClick={onClose}
							className='w-full bg-gold-500 hover:bg-gold-500/90 text-white py-2 px-4 rounded-md transition-colors'
						>
							Закрыть
						</button>
					</div>
				</Drawer.Content>
			</Drawer.Portal>
		</Drawer.Root>
	)
}
