import { Clock } from 'lucide-react'
import type { DeliveryTimeSlot } from '@/types/delivery'
import { getDateDisplayLabel } from '@/lib/delivery-utils'
import { cn } from '@/lib/utils'

interface OrderSummaryTimeSlotProps {
	timeSlot: DeliveryTimeSlot | null
	className?: string
}

export function OrderSummaryTimeSlot({
	timeSlot,
	className,
}: OrderSummaryTimeSlotProps) {
	if (!timeSlot) {
		return (
			<div className={cn('flex items-center gap-2 text-gray-500', className)}>
				<Clock className='h-4 w-4' />
				<span className='text-sm'>Время доставки не выбрано</span>
			</div>
		)
	}

	return (
		<div className={cn('flex items-center gap-2', className)}>
			<Clock className='h-4 w-4 text-green-600' />
			<div className='text-sm'>
				<span className='font-medium'>Доставка:</span>{' '}
				<span className='text-gray-700'>
					{getDateDisplayLabel(timeSlot.date)}, {timeSlot.timeRange}
				</span>
			</div>
		</div>
	)
}
