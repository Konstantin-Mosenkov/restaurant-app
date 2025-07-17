import Navbar from '@/components/ui/navbar'
import { Cake, HandHeart, Star } from 'lucide-react'

const features = [
	{
		name: 'День Рождения!',
		description:
			'"Хотите идеальный День Рождения? Мы позаботимся обо всём: вкусная кухня, уютная атмосфера и внимание к каждому гостю. Давайте устроим ваш праздник вместе!"',
		icon: Cake,
	},
	{
		name: 'Свадьба!',
		description:
			'"Каждая любовь — уникальна, и ваша свадьба должна быть такой же! Мы поможем воплотить ваши мечты: от романтического ужина до большого праздника. Вкусные блюда, тёплая атмосфера и внимание к каждой детали — чтобы ваш день стал по-настоящему сказочным."',
		icon: HandHeart,
	},
	{
		name: 'Праздники!',
		description:
			'Дни рождения, свадьбы, корпоративы или просто душевные посиделки — мы создадим атмосферу, где каждое событие превратится в тёплое воспоминание. Вкусные блюда, внимательный сервис и домашняя забота — чтобы вы отдыхали, а мы позаботились обо всём остальном.',
		icon: Star,
	},
]

function Events() {
	return (
		<>
			<Navbar />
			<section className='min-h-screen bg-milk-500'>
				<div className='overflow-hidden bg-milk-500 py-24 sm:py-32'>
					<div className='mx-auto max-w-7xl px-6 lg:px-8'>
						<div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2'>
							<div className='lg:pt-4 lg:pr-8'>
								<div className='lg:max-w-lg'>
									<p className='mt-2 text-xl font-semibold tracking-tight text-pretty text-wave-500 sm:text-xl'>
										"Праздники — для радости, а не для хлопот! Закажите банкет у
										нас — и наслаждайтесь моментом с близкими. Готовим с душой,
										обслуживаем с улыбкой, украшаем с любовью. Ваш идеальный
										вечер начинается здесь!"
									</p>
									<dl className='mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none'>
										{features.map((feature) => (
											<div key={feature.name} className='relative pl-9'>
												<dt className='inline font-semibold text-wave-500'>
													<feature.icon
														aria-hidden='true'
														className='absolute top-1 left-1 size-7 text-gold-500'
													/>
													{feature.name}
												</dt>{' '}
												<dd className='inline text-wave-500'>{feature.description}</dd>
											</div>
										))}
									</dl>
								</div>
							</div>
							<img
								alt='Product screenshot'
								src='/assets/h-b.jpg'
								width={2432}
								height={1442}
								className='w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0'
							/>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}

export default Events
