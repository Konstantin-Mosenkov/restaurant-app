import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrderSummaryTimeSlot } from '@/components/ui/order-summary-time-slot'
import type { DeliveryTimeSlot } from '@/types/delivery'

// Mock the delivery utils
vi.mock('@/lib/delivery-utils', () => ({
	getDateDisplayLabel: vi.fn(),
}))

const mockTimeSlot: DeliveryTimeSlot = {
	id: 'today-1',
	date: '2024-01-15',
	timeRange: '13:00-15:00',
	available: true,
}

describe('OrderSummaryTimeSlot', () => {
	beforeEach(async () => {
		vi.clearAllMocks()

		const { getDateDisplayLabel } = vi.mocked(
			await import('@/lib/delivery-utils')
		)
		getDateDisplayLabel.mockImplementation((date) => {
			if (date === '2024-01-15') return 'Сегодня'
			if (date === '2024-01-16') return 'Завтра'
			return date
		})
	})

	it('should display selected time slot information', () => {
		render(<OrderSummaryTimeSlot timeSlot={mockTimeSlot} />)

		expect(screen.getByText('Доставка:')).toBeInTheDocument()
		expect(screen.getByText(/Сегодня, 13:00-15:00/)).toBeInTheDocument()
	})

	it('should display clock icon when time slot is selected', () => {
		render(<OrderSummaryTimeSlot timeSlot={mockTimeSlot} />)

		const clockIcon = document.querySelector('svg.lucide-clock')
		expect(clockIcon).toBeInTheDocument()
		expect(clockIcon).toHaveClass('text-green-600')
	})

	it('should display "not selected" message when no time slot is provided', () => {
		render(<OrderSummaryTimeSlot timeSlot={null} />)

		expect(screen.getByText('Время доставки не выбрано')).toBeInTheDocument()
		expect(screen.queryByText('Доставка:')).not.toBeInTheDocument()
	})

	it('should display clock icon with gray color when no time slot is selected', () => {
		render(<OrderSummaryTimeSlot timeSlot={null} />)

		const clockIcon = document.querySelector('svg.lucide-clock')
		expect(clockIcon).toBeInTheDocument()
		expect(clockIcon).not.toHaveClass('text-green-600')
	})

	it('should apply custom className', () => {
		const { container } = render(
			<OrderSummaryTimeSlot timeSlot={mockTimeSlot} className='custom-class' />
		)

		expect(container.firstChild).toHaveClass('custom-class')
	})

	it('should handle tomorrow time slot correctly', () => {
		const tomorrowSlot: DeliveryTimeSlot = {
			id: 'tomorrow-0',
			date: '2024-01-16',
			timeRange: '11:00-13:00',
			available: true,
		}

		render(<OrderSummaryTimeSlot timeSlot={tomorrowSlot} />)

		expect(screen.getByText('Доставка:')).toBeInTheDocument()
		expect(screen.getByText(/Завтра, 11:00-13:00/)).toBeInTheDocument()
	})

	it('should call getDateDisplayLabel with correct date', async () => {
		const { getDateDisplayLabel } = vi.mocked(
			await import('@/lib/delivery-utils')
		)

		render(<OrderSummaryTimeSlot timeSlot={mockTimeSlot} />)

		expect(getDateDisplayLabel).toHaveBeenCalledWith('2024-01-15')
	})

	it('should display time range correctly', () => {
		const eveningSlot: DeliveryTimeSlot = {
			id: 'today-4',
			date: '2024-01-15',
			timeRange: '19:00-21:00',
			available: true,
		}

		render(<OrderSummaryTimeSlot timeSlot={eveningSlot} />)

		expect(screen.getByText(/19:00-21:00/)).toBeInTheDocument()
	})

	it('should have proper styling for selected state', () => {
		render(<OrderSummaryTimeSlot timeSlot={mockTimeSlot} />)

		const deliveryText = screen.getByText('Доставка:')
		expect(deliveryText).toHaveClass('font-medium')

		const timeText = screen.getByText(/Сегодня, 13:00-15:00/)
		expect(timeText).toHaveClass('text-gray-700')
	})

	it('should have proper styling for unselected state', () => {
		render(<OrderSummaryTimeSlot timeSlot={null} />)

		const container = screen.getByText(
			'Время доставки не выбрано'
		).parentElement
		expect(container).toHaveClass('text-gray-500')
	})
})
