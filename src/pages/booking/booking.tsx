import Navbar from '@/components/ui/navbar'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/ui/datepicker'
import { CalendarDays, Clock9 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

function Booking() {
	return (
		<>
			<Navbar />
			<div className='mx-auto bg-milk-500'>
				<div className='w-full h-full lg:-mt-96 overflow-hidden bg-milk-500'>
					<img
						className='w-full h-full object-cover'
						src='/assets/reserved.jpg'
						alt='Фото ресторана'
					/>
				</div>
				<div className='relative isolate overflow-hidden bg-milk-500 py-16 sm:py-16 lg:py-16'>
					<form
						action='#'
						method='POST'
						className='mx-auto max-w-7xl px-6 lg:px-8'
					>
						<div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2'>
							<div className='max-w-xl lg:max-w-lg'>
								<h2 className=' text-2xl font-semibold tracking-tight text-wave-500'>
									Бронирование
								</h2>
								<p className='mt-4 text-lg text-wave-500/70'>
									Бронирование столов для компаний от 6-ти гостей осуществляется
									только по телефону +7 (911) 819 36 72
								</p>
								<div className='mt-6 flex max-w-md gap-x-4'>
									<label htmlFor='name' className='sr-only'>
										Имя, фамилия
									</label>
									<Input
										id='name'
										name='name'
										type='text'
										required
										placeholder='Имя, фамилия'
										autoComplete='name'
										className='min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-wave-500 outline-1 -outline-offset-1 outline-white/10 placeholder:text-wave-500 focus:outline-2 focus:-outline-offset-2 focus:outline-milk-500 sm:text-sm/6 border-wave-500'
									/>
								</div>
								<div className='mt-6 flex max-w-md gap-x-4'>
									<label htmlFor='phone' className='sr-only'>
										Телефон
									</label>
									<Input
										id='phone'
										name='phone'
										type='tel'
										required
										placeholder='Телефон'
										autoComplete='tel'
										className='min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-wave-500 outline-1 -outline-offset-1 outline-white/10 placeholder:text-wave-500 focus:outline-2 focus:-outline-offset-2 focus:outline-milk-500 sm:text-sm/6 border-wave-500'
									/>
								</div>
								<div className='mt-6 flex max-w-md gap-x-4'>
									<label htmlFor='email-address' className='sr-only'>
										Email address
									</label>
									<Input
										id='email-address'
										name='email'
										type='email'
										required
										placeholder='E-mail'
										autoComplete='email'
										className='min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-wave-500 outline-1 -outline-offset-1 outline-white/10 placeholder:text-wave-500 focus:outline-2 focus:-outline-offset-2 focus:outline-milk-500 sm:text-sm/6 border-wave-500'
									/>
								</div>
								<div className='mt-6 flex max-w-md gap-x-4'>
									<label htmlFor='count-person' className='sr-only'>
										Количество персон
									</label>
									<Input
										id='count-person'
										name='count-person'
										type='text'
										required
										placeholder='Количество персон'
										autoComplete='count-person'
										className='min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-wave-500 outline-1 -outline-offset-1 outline-white/10 placeholder:text-wave-500 focus:outline-2 focus:-outline-offset-2 focus:outline-milk-500 sm:text-sm/6 border-wave-500'
									/>
								</div>
								<div className='mt-6 flex flex-wrap items-center gap-3'>
									<Checkbox
										id='terms'
										className='data-[state=checked]:bg-gold-500 border-wave-500'
									/>
									<Label
										htmlFor='terms'
										className='text-xs/4 text-wave-500 flex flex-wrap items-center gap-1'
									>
										Заполняя форму, вы соглашаетесь с{' '}
										<a
											href='https://example.com/privacy'
											target='_blank'
											className='underline underline-offset-4'
										>
											политикой конфиденциальности
										</a>
									</Label>
								</div>
							</div>
							<dl className='grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2'>
								<div className='flex flex-col items-start'>
									<div className='rounded-md bg-white/5 p-2 ring-1 ring-white/10'>
										<CalendarDays
											aria-hidden='true'
											className='size-6 text-wave-500'
										/>
									</div>
									<dt className='mt-4 text-base font-semibold text-wave-500'>
										Дата бронирования
									</dt>
									<dd className='mt-2'>
										<DatePicker />
									</dd>
								</div>
								<div className='flex flex-col items-start'>
									<div className='rounded-md bg-white/5 p-2 ring-1 ring-white/10'>
										<Clock9
											aria-hidden='true'
											className='size-6 text-wave-500'
										/>
									</div>
									<dt className='mt-4 text-base font-semibold text-wave-500'>
										Время бронирования
									</dt>
									<div className='mt-2'>
										<Input
											type='time'
											id='time-picker'
											step='1'
											defaultValue='12:00'
											className='appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-wave-500 outline-1 -outline-offset-1 outline-wave-500 placeholder:text-wave-500 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 border-wave-500'
										/>
									</div>
								</div>
							</dl>
						</div>
						<Button
							type='submit'
							className='mt-12 self-end rounded-md bg-gold-500 px-3.5 py-2.5 text-sm font-semibold text-milk-500 shadow-xs hover:bg-gold-500/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full max-w-md cursor-pointer'
						>
							Отправить
						</Button>
					</form>
				</div>
			</div>
		</>
	)
}

export default Booking
