import Navbar from '@/components/ui/navbar'
import { Slider } from '@/components/ui/slider'

function About() {
	const slides = [
		{
			id: 1,
			image: '/assets/contacts.png',
			alt: 'Slide 1',
		},
		{
			id: 2,
			image: '/assets/design-6.png',
			alt: 'Slide 2',
		},
		{
			id: 3,
			image: '/assets/booking.png',
			alt: 'Slide 3',
		},
		{
			id: 4,
			image: '/assets/design-4.png',
			alt: 'Slide 2',
		},
		{
			id: 5,
			image: '/assets/design-3.png',
			alt: 'Slide 3',
		},
		{
			id: 6,
			image: '/assets/interier-2.png',
			alt: 'Slide 2',
		},
		{
			id: 7,
			image: '/assets/design-1.png',
			alt: 'Slide 3',
		},
	]

	const dishes = [
		{
			id: 1,
			image: '/assets/main-1.jpg',
			alt: 'Slide 1',
		},
		{
			id: 2,
			image: '/assets/sushi-2.jpg',
			alt: 'Slide 2',
		},
		{
			id: 3,
			image: '/assets/salad-2.jpg',
			alt: 'Slide 3',
		},
		{
			id: 4,
			image: '/assets/pizza-1.jpg',
			alt: 'Slide 4',
		},
	]
	return (
		<>
			<Navbar />
			<div className='bg-milk-500'>
				<div className='bg-milk-500 flex items-center justify-center pt-16'>
					<img
						className='size-full object-cover object-center'
						src='/assets/logo.png'
						alt='Логотип ресторана'
					/>
				</div>
				<div className='bg-milk-500 sm:py-2'>
					<div className='mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8'>
						<h2 className='mx-auto mt-16 text-center text-2xl font-semibold font-display tracking-tight text-balance text-gold-500 sm:text-4xl'>
							От причалов Кронштадта - к вкусам континентов Ваше
							гасторономическое плавание начинается здесь
						</h2>
					</div>
				</div>
				<div className='mx-auto pt-8 px-2'>
					<Slider slides={slides} autoPlay={true} interval={5000} />
					<div className='text-center pt-6'>
						<h2 className='text-2xl font-display font-semibold tracking-tight text-balance text-gold-500 sm:text-4xl'>
							Эстетика в деталях
						</h2>
						<p className='mt-4 mx-4 font-display text-lg font-medium text-pretty text-gray-500 sm:text-xl/8'>
							Ирина Глик и студия Geometria создали для Сахалина элегантный
							вечерний стиль с белоснежными скатертями и уютной атмосферой.
							Величественный «двухпалубный» ресторан на 188 посадочных мест
							станет еще больше летом, когда практически в облаках на высоте
							птичьего полета откроется летняя терраса.
						</p>
					</div>
				</div>
				<div className='mx-auto pt-6 px-2'>
					<Slider slides={dishes} autoPlay={true} interval={5000} />
					<div className='text-center pt-6'>
						<h2 className='text-2xl font-display font-semibold tracking-tight text-balance text-gold-500 sm:text-4xl'>
							Меню ресторана
						</h2>
						<p className='mt-4 mx-4 font-display text-lg font-medium text-pretty text-gray-500 sm:text-xl/8'>
							Российские региональные продукты в сочетании со средиземноморскими
							и азиатскими блюдами и техниками приготовления легли в основу
							нового стиля MediterrAsian cuisine. Сердце ресторана - Raw bar c
							ледником и аквариумом, где гости могут выбрать морепродукты на
							свой вкус.
						</p>
					</div>
				</div>
				<div className='mx-auto max-w-2xl pt-6 px-6 lg:max-w-7xl lg:px-8'>
					<div className='mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2'>
						<div className='relative lg:row-span-2'>
							<div className='absolute inset-px rounded-lg bg-gold-500/50  lg:rounded-l-4xl'></div>
							<div className='relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]'>
								<div className='px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0'>
									<p className='mt-2 max-w-lg font-display text-md/6 text-wave-500/70 max-lg:text-center'>
										<span className='text-md font-medium tracking-tight text-wave-500'>
											Кронштадт - &nbsp;
										</span>
										колыбель великих открытий. Здесь у берегов Балтики,
										начинались легендарные экспедиции, изменившие карту мира.
										Крузенштерн, Лисянский, Беллинсгаузен, Лазарев - их корабли
										уходили в неизведанное, открывая новые земли и укрепляя
										славу русского флота. 41 кругосветное плавание - наша
										история (в 1820 году была открыта Антарктида)
									</p>
								</div>
								<div className='@container relative min-h-120 w-full grow max-lg:mx-auto max-lg:max-w-sm'>
									<div className='absolute inset-x-10 top-10 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-wave-500 bg-wave-500 shadow-2xl'>
										<img
											className='size-full object-cover object-top'
											src='/assets/fregat.jpg'
											alt='Фото ресторана'
										/>
									</div>
								</div>
							</div>
							<div className='pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 lg:rounded-l-4xl'></div>
						</div>
						<div className='relative max-lg:row-start-1'>
							<div className='absolute inset-px rounded-lg bg-gold-500/50 max-lg:rounded-t-4xl'></div>
							<div className='relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]'>
								<div className='px-8 pt-8 sm:px-10 sm:pt-10'>
									<p className='mt-2 max-w-lg font-display text-md/6 text-wave-500/70 max-lg:text-center'>
										<span className='text-md font-medium tracking-tight text-wave-500'>
											Мыс доброй надежды - символ морской судьбы.&nbsp;
										</span>
										Для мореплавателей всего мира этот мыс - не просто точка на
										карте, а символ надежды и преодоления. Обогнуть его означало
										вступить в новый этап пути, где стихия проверяла на
										прочность, а ветры перемен вели к неизведанным берегам.
										Через него лежал путь в Индию, Азию и к тайнам Южных морей.
									</p>
								</div>
								<div className='flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2'>
									<div className='w-full max-lg:max-w-xs overflow-hidden rounded-lg lg:rounded-xl'>
										<img
											className='w-full h-full object-cover rounded-lg lg:rounded-xl'
											src='/assets/map.jpg'
											alt='Фото ресторана'
										/>
									</div>
								</div>
							</div>
							<div className='pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-t-4xl'></div>
						</div>
						<div className='relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2'>
							<div className='absolute inset-px rounded-lg bg-gold-500/50'></div>
							<div className='relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]'>
								<div className='px-8 pt-8 sm:px-10 sm:pt-10'>
									<p className='mt-2 max-w-lg font-display text-md/6 text-wave-500/70 max-lg:text-center'>
										<span className='text-md font-medium tracking-tight text-wave-500'>
											В Кронштадте существовал ресторан&nbsp;
										</span>
										с таким названием, ходила легенда, что, после шумных
										вечеров, некоторые гости, как корабли в бурю, "бросали
										якорь" у порога, отложив возвращение до рассвета. Так
										родилась поговорка: "Потерпел крушение у Мыса Доброй
										Надежды" - в ней смешались морская романтика, самоирония и
										дух авантюры.
									</p>
								</div>
								<div className='flex flex-1 items-center justify-center px-8 max-lg:pt-10 max-lg:pb-12 sm:px-10 lg:pb-2'>
									<div className='w-full max-lg:max-w-xs overflow-hidden rounded-lg lg:rounded-xl'>
										<img
											className='w-full h-full object-cover rounded-lg lg:rounded-xl'
											src='/assets/fort.jpg'
											alt='Фото ресторана'
										/>
									</div>
								</div>
							</div>
							<div className='pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5'></div>
						</div>
						<div className='relative lg:row-span-2'>
							<div className='absolute inset-px rounded-lg bg-gold-500/50 max-lg:rounded-b-4xl lg:rounded-r-4xl'></div>
							<div className='relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]'>
								<div className='px-8 pt-8 pb-3 sm:px-10 sm:pt-10 sm:pb-0'>
									<p className='mt-2 max-w-lg font-display text-md/6 text-wave-500/70 max-lg:text-center'>
										<span className='text-md font-medium tracking-tight text-wave-500'>
											Мы предлагаем Вам отправиться в гастрономическое
											путешествие -&nbsp;
										</span>
										сквозь океаны и эпохи к лучшим вкусам континентов. В меню
										предлагаем блюда мировой кухни, от пряных нот Азии до
										средиземноморской гармонии, от сытной европейской классики
										до экзотики Южных морей. Атмосфера уюта, словно капитанская
										каюта после долгого плавания, согреет теплом дерева, мягким
										светом фонарей и шепотом старых карт.
									</p>
								</div>
								<div className='relative min-h-120 w-full grow'>
									<div className='absolute top-10 right-0 bottom-0 left-10 overflow-hidden rounded-tl-xl bg-wave-500 shadow-2xl'>
										<div className='h-full w-full rounded-tl-2xl rounded-br-2xl overflow-hidden'>
											<div className='px-6 pt-6 pb-14 h-full'>
												<img
													className='size-full object-cover object-center rounded-lg lg:rounded-xl'
													src='/assets/beacon.jpg'
													alt='Интерьер ресторана'
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-black/5 max-lg:rounded-b-4xl lg:rounded-r-4xl'></div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default About
