import { useState } from 'react'
import ProductDrawer from '../modals/product-drawer'
import type { MenuItem } from '@/types/delivery'
import { pizzas } from '../data'

function Pizzas() {
	const [selectedPizza, setSelectedPizza] = useState<MenuItem | null>(null)
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

	const openDrawer = (pizza: MenuItem) => {
		setSelectedPizza(pizza)
		setIsDrawerOpen(true)
	}

	return (
		<>
			<div className='min-h-screen bg-milk-500 py-24 sm:py-32'>
				<section className='mx-auto max-w-7xl px-6 lg:px-8'>
					<div className='mx-auto max-w-2xl lg:mx-0'>
						<h3 className='text-2xl font-display font-semibold tracking-tight text-pretty text-wave-500 sm:text-3xl'>
							Пицца
						</h3>
					</div>
					<div className='mx-auto mt-6 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-16 border-t border-gray-200 pt-10 sm:mt-8 sm:pt-8 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
						{pizzas.map((pizza) => (
							<article
								key={pizza.id}
								className='flex max-w-xl flex-col items-start justify-between'
							>
								<div className='relative w-full flex items-center'>
									<img
										alt=''
										src={pizza.imageUrl}
										className='h-78 w-full object-cover md:w-full bg-gray-50 rounded-md'
									/>
								</div>
								<div className='group relative mt-4'>
									<h3 className='mt-1 font-display text-lg text-wave-500 group-hover:text-wave-500/90'>
										<span>
											<span className='absolute inset-0' />
											{pizza.name}
										</span>
									</h3>
									<p className='mt-2 font-display text-sm/6 text-wave-500/80'>
										{pizza.weight}
									</p>
									<p className='mt-2 font-display text-sm/6 font-semibold text-wave-500/80'>
										{pizza.price}
									</p>
								</div>
								<button
									onClick={() => openDrawer(pizza)}
									className='mt-4 w-full bg-gold-500 hover:bg-gold-500/90 text-white py-2 px-4 rounded-md transition-colors'
								>
									Подробнее
								</button>
							</article>
						))}
					</div>
				</section>
			</div>
			{selectedPizza && (
				<ProductDrawer
					isOpen={isDrawerOpen}
					onClose={() => setIsDrawerOpen(false)}
					product={selectedPizza}
				/>
			)}
		</>
	)
}

export default Pizzas
