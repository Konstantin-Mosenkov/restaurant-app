import { Link, useLocation } from 'react-router-dom'
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from '@headlessui/react'
import { AlignJustify, X, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

function Navbar() {
	const location = useLocation()
	const { itemCount } = useCart()

	const navigation = [
		{ name: 'О ресторане', href: '/' },
		{ name: 'Меню', href: '/menu' },
		{ name: 'Бронирование', href: '/booking' },
		{ name: 'События', href: '/events' },
		{ name: 'Контакты', href: '/contacts' },
	]

	const isCurrent = (href: string) => location.pathname === href

	return (
		<Disclosure
			as='nav'
			className='fixed top-0 left-0 right-0 z-50 bg-milk-500 shadow-sm dark:shadow-gray-800/10'
		>
			<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
				<div className='relative flex h-16 items-center justify-between'>
					<div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
						{/* Mobile menu button*/}
						<DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-wave-500 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-wave-500 focus:outline-hidden focus:ring-inset'>
							<span className='absolute -inset-0.5' />
							<span className='sr-only'>Open main menu</span>
							<AlignJustify
								aria-hidden='true'
								className='block size-6 group-data-open:hidden'
							/>
							<X
								aria-hidden='true'
								className='hidden size-6 group-data-open:block'
							/>
						</DisclosureButton>
					</div>
					<div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
						<div className='flex shrink-0 items-center'>
							<img
								alt='Логотип ресторана'
								src='/assets/logo.png'
								className='h-20 w-auto'
							/>
						</div>
						<div className='hidden sm:ml-auto sm:block'>
							<div className='flex items-center space-x-6 pt-6'>
								{navigation.map((item) => (
									<Link
										key={item.name}
										to={item.href}
										className={classNames(
											isCurrent(item.href)
												? 'text-wave-500 dark:text-white'
												: 'text-wave-500/70 dark:text-gray-300 hover:text-wave-500 dark:hover:text-white',
											'relative px-3 py-2 text-base font-medium group transition-all duration-300'
										)}
									>
										{item.name}
										<span
											className={classNames(
												isCurrent(item.href)
													? 'w-full'
													: 'w-0 group-hover:w-full',
												'absolute left-0 bottom-0 h-[1px] bg-wave-500 transition-all duration-300 ease-out'
											)}
										></span>
									</Link>
								))}
								{/* Desktop Cart Icon */}
								<Link
									to='/cart'
									className='relative p-2 text-wave-500/70 hover:text-wave-500 transition-colors duration-300'
									aria-label='Корзина покупок'
								>
									<ShoppingCart className='h-6 w-6' />
									{itemCount > 0 && (
										<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
											{itemCount > 99 ? '99+' : itemCount}
										</span>
									)}
								</Link>
							</div>
						</div>
					</div>
					{/* Mobile cart icon */}
					<div className='absolute inset-y-0 right-0 flex items-center sm:hidden'>
						<Link
							to='/cart'
							className='relative p-2 text-wave-500/70 hover:text-wave-500 transition-colors duration-300'
							aria-label='Корзина покупок'
						>
							<ShoppingCart className='h-6 w-6' />
							{itemCount > 0 && (
								<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
									{itemCount > 99 ? '99+' : itemCount}
								</span>
							)}
						</Link>
					</div>
				</div>
			</div>
			<DisclosurePanel className='sm:hidden'>
				<div className='space-y-1 px-2 pt-2 pb-3'>
					{navigation.map((item) => (
						<DisclosureButton
							key={item.name}
							as={Link}
							to={item.href}
							aria-current={isCurrent(item.href) ? 'page' : undefined}
							className={classNames(
								isCurrent(item.href)
									? 'text-wave-500 dark:text-white border-b-1 border-wave-500'
									: 'text-wave-500/70 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-b-2 hover:border-wave-500',
								'block px-3 py-2 text-base font-medium transition-all duration-200'
							)}
						>
							{item.name}
						</DisclosureButton>
					))}
					{/* Mobile Cart Link */}
					<DisclosureButton
						as={Link}
						to='/cart'
						aria-current={isCurrent('/cart') ? 'page' : undefined}
						className={classNames(
							isCurrent('/cart')
								? 'text-wave-500 dark:text-white border-b-1 border-wave-500'
								: 'text-wave-500/70 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-b-2 hover:border-wave-500',
							'flex items-center px-3 py-2 text-base font-medium transition-all duration-200'
						)}
					>
						<ShoppingCart className='h-5 w-5 mr-2' />
						Корзина
						{itemCount > 0 && (
							<span className='ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
								{itemCount > 99 ? '99+' : itemCount}
							</span>
						)}
					</DisclosureButton>
				</div>
			</DisclosurePanel>
		</Disclosure>
	)
}

export default Navbar
