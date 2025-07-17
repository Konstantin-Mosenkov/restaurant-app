import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
	return (
		<>
			<div className='relative h-screen overflow-hidden'>
				<img
					src='/assets/error.jpg'
					alt='Background'
					className='absolute inset-0 w-full h-full object-cover animate-zoom-in-out'
				/>
				<div className='absolute inset-0 bg-black/40 backdrop-blur-[1px]'>
					<main className='grid min-h-full place-items-center bg-transparent px-6 py-24 sm:py-32 lg:px-8'>
						<div className='text-center'>
							<p className='text-base font-semibold text-milk-500'>404</p>
							<h1 className='mt-4 text-5xl font-semibold tracking-tight text-balance text-milk-500 sm:text-7xl'>
								Страница не найдена
							</h1>
							<p className='mt-6 text-lg font-medium text-pretty text-milk-500/90 sm:text-xl/8'>
								Извините, мы не смогли найти страницу, которую вы ищете.
							</p>
							<div className='mt-10 flex items-center justify-center gap-x-6'>
								<Link
									className='flex items-center gap-1 text-sm font-semibold text-milk-500'
									to='/'
								>
									<ArrowLeft />
									Вернуться на главную
								</Link>
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	)
}
