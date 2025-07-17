import { Button } from '@/components/ui/button'
import type { DeliveryTimeSlot } from '@/types/delivery'
import {
	generateDeliveryTimeSlots,
	groupTimeSlotsByDate,
	getDateDisplayLabel,
	isTimeSlotAvailable,
} from '@/lib/delivery-utils'
import { cn } from '@/lib/utils'

interface DeliveryTimeSelectorProps {
	selectedSlot: DeliveryTimeSlot | null
	onSlotSelect: (slot: DeliveryTimeSlot) => void
	className?: string
}

export function DeliveryTimeSelector({
	selectedSlot,
	onSlotSelect,
	className,
}: DeliveryTimeSelectorProps) {
	const availableSlots = generateDeliveryTimeSlots().filter(isTimeSlotAvailable)
	const groupedSlots = groupTimeSlotsByDate(availableSlots)

	if (availableSlots.length === 0) {
		return (
			<div className={cn('space-y-4', className)}>
				<h3 className='text-base sm:text-lg font-semibold'>Время доставки</h3>
				<div className='text-center py-6 sm:py-8 text-gray-500'>
					<p className='text-sm sm:text-base'>
						На сегодня и завтра нет доступных слотов для доставки.
					</p>
					<p className='text-xs sm:text-sm mt-2'>
						Доставка осуществляется с 11:00 до 21:00 с предварительным заказом
						за 2 часа.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className={cn('space-y-4', className)}>
			<h3 className='text-base sm:text-lg font-semibold'>Время доставки</h3>
			<div className='space-y-4 sm:space-y-6'>
				{Object.entries(groupedSlots).map(([date, slots]) => (
					<div key={date} className='space-y-3'>
						<h4 className='font-medium text-gray-700 text-sm sm:text-base'>
							{getDateDisplayLabel(date)}
						</h4>
						<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3'>
							{slots.map((slot) => (
								<Button
									key={slot.id}
									variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
									size='sm'
									onClick={() => onSlotSelect(slot)}
									disabled={!slot.available}
									className={cn(
										'text-xs sm:text-sm h-10 sm:h-auto py-2 px-2 sm:px-3 touch-manipulation',
										selectedSlot?.id === slot.id &&
											'bg-red-600 text-white hover:bg-red-700',
										!slot.available && 'opacity-50 cursor-not-allowed'
									)}
								>
									{slot.timeRange}
								</Button>
							))}
						</div>
					</div>
				))}
			</div>
			{selectedSlot && (
				<div className='mt-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
					<p className='text-xs sm:text-sm text-green-800'>
						<span className='font-medium'>Выбранное время:</span>{' '}
						{getDateDisplayLabel(selectedSlot.date)}, {selectedSlot.timeRange}
					</p>
				</div>
			)}
		</div>
	)
}
