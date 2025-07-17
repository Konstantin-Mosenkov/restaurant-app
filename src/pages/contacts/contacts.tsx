import Navbar from '@/components/ui/navbar'
import { Clock9, Mail, MapPin, PhoneCall, Users } from 'lucide-react'

function Contacts() {
	const address = 'ул. Коммунистическая д. 14, г. Кронштадт, Россия'

	const latitude = 59.9915
	const longitude = 29.7664

	const mapUrl = `https://yandex.ru/map-widget/v1/?um=constructor%3A1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p&ll=${longitude}%2C${latitude}&z=15&mode=search&text=${encodeURIComponent(
		address
	)}`

	return (
		<>
			<Navbar />
			<section className='min-h-screen bg-milk-500 dark:bg-gray-900'>
				<div className='w-full h-[70vh] overflow-hidden rounded-xl pt-16 mb-4'>
					<img
						className='w-full h-full object-cover'
						src='/assets/contacts.png'
						alt='Фото ресторана'
					/>
				</div>
				<div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div>
						<div className='px-4 sm:px-0'>
							<h3 className='text-base/7 font-semibold text-wave-500'>
								Контакты
							</h3>
						</div>
						<div className='mt-6 border-t border-gold-500'>
							<dl className='divide-y divide-gold-500/40'>
								<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
									<dt className='text-md/6 font-medium text-wave-500'>
										<div className='flex items-center gap-2'>
											<MapPin className='text-gold-500' />
											<span>Адрес:</span>
										</div>
									</dt>
									<dd className='mt-1 text-md/6 text-wave-500/70 sm:col-span-2 sm:mt-0'>
										ул. Коммунистическая д. 14, г. Кронштадт, Россия
									</dd>
								</div>
								<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
									<dt className='text-md/6 font-medium text-wave-500'>
										<div className='flex items-center gap-2'>
											<Clock9 className='text-gold-500'/>
											<span>Режим работы:</span>
										</div>
									</dt>
									<dd className='mt-1 text-md/6 text-wave-500/70 sm:col-span-2 sm:mt-0'>
										понедельник - воскресенье 12:00 - 23:00
									</dd>
								</div>
								<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
									<dt className='text-md/6 font-medium text-wave-500'>
										<div className='flex items-center gap-2'>
											<PhoneCall className='text-gold-500'/>
											<span>Телефон:</span>
										</div>
									</dt>
									<dd className='mt-1 text-md/6 text-wave-500/70 sm:col-span-2 sm:mt-0'>
										+7 (911) 819 36 72
									</dd>
								</div>
								<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
									<dt className='text-md/6 font-medium text-wave-500'>
										<div className='flex items-center gap-2'>
											<Mail className='text-gold-500'/>
											<span>Почта:</span>
										</div>
									</dt>
									<dd className='mt-1 text-md/6 text-wave-500/70 sm:col-span-2 sm:mt-0'>
										rest.vs@yandex.ru
									</dd>
								</div>
								<div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
									<dt className='text-md/6 font-medium text-wave-500'>
										<div className='flex items-center gap-2'>
											<Users className='text-gold-500'/>
											<span>Работа у нас:</span>
										</div>
									</dt>
									<dd className='mt-1 text-md/6 text-wave-500/70 sm:col-span-2 sm:mt-0'>
										rest.vs@yandex.ru
									</dd>
								</div>
							</dl>
						</div>
					</div>
					<div className='overflow-hidden rounded-lg shadow-xl border-4 border-blue-500/20 mt-8'>
						<iframe
							src={mapUrl}
							width='100%'
							height='400'
							frameBorder='0'
							className=''
							allowFullScreen
							aria-hidden='false'
							tabIndex={0}
							title='Мыс доброй надежды'
							loading='lazy'
						></iframe>
					</div>
				</div>
			</section>
		</>
	)
}

export default Contacts
