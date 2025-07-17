import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DeliveryTimeSelector } from '@/components/ui/delivery-time-selector'
import type { DeliveryTimeSlot } from '@/types/delivery'

// Mock the delivery utils
vi.mock('@/lib/delivery-utils', () => ({
	generateDeliveryTimeSlots: vi.fn(),
	groupTimeSlotsByDate: vi.fn(),
	getDateDisplayLabel: vi.fn(),
	isTimeSlotAvailable: vi.fn(),
}))

const mockSlots: DeliveryTimeSlot[] = [
	{
		id: 'today-1',
		date: '2024-01-15',
		timeRange: '13:00-15:00',
		available: true,
	},
	{
		id: 'today-2',
		date: '2024-01-15',
		timeRange: '15:00-17:00',
		available: true,
	},
	{
		id: 'tomorrow-0',
		date: '2024-01-16',
		timeRange: '11:00-13:00',
		available: true,
	},
	{
		id: 'tomorrow-1',
		date: '2024-01-16',
		timeRange: '17:00-19:00',
		available: false, // Unavailable slot
	},
]

const mockGroupedSlots = {
	'2024-01-15': [
		{
			id: 'today-1',
			date: '2024-01-15',
			timeRange: '13:00-15:00',
			available: true,
		},
		{
			id: 'today-2',
			date: '2024-01-15',
			timeRange: '15:00-17:00',
			available: true,
		},
	],
	'2024-01-16': [
		{
			id: 'tomorrow-0',
			date: '2024-01-16',
			timeRange: '11:00-13:00',
			available: true,
		},
		{
			id: 'tomorrow-1',
			date: '2024-01-16',
			timeRange: '17:00-19:00',
			available: false,
		},
	],
}

describe('DeliveryTimeSelector', () => {
	const mockOnSlotSelect = vi.fn()

	beforeEach(async () => {
		vi.clearAllMocks()

		// Setup default mocks
		const {
			generateDeliveryTimeSlots,
			groupTimeSlotsByDate,
			getDateDisplayLabel,
			isTimeSlotAvailable,
		} = await import('@/lib/delivery-utils')

		vi.mocked(generateDeliveryTimeSlots).mockReturnValue(mockSlots)
		vi.mocked(isTimeSlotAvailable).mockImplementation((slot) => slot.available)
		vi.mocked(groupTimeSlotsByDate).mockReturnValue(mockGroupedSlots)
		vi.mocked(getDateDisplayLabel).mockImplementation((date) => {
			if (date === '2024-01-15') return 'Сегодня'
			if (date === '2024-01-16') return 'Завтра'
			return date
		})
	})

	it('should render time slot selector with available slots', () => {
		render(
			<DeliveryTimeSelector
				selectedSlot={null}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		expect(screen.getByText('Время доставки')).toBeInTheDocument()
		expect(screen.getByText('Сегодня')).toBeInTheDocument()
		expect(screen.getByText('Завтра')).toBeInTheDocument()
		expect(screen.getByText('13:00-15:00')).toBeInTheDocument()
		expect(screen.getByText('15:00-17:00')).toBeInTheDocument()
		expect(screen.getByText('11:00-13:00')).toBeInTheDocument()
	})

	it('should call onSlotSelect when a slot is clicked', () => {
		render(
			<DeliveryTimeSelector
				selectedSlot={null}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		const slotButton = screen.getByRole('button', { name: '13:00-15:00' })
		fireEvent.click(slotButton)

		expect(mockOnSlotSelect).toHaveBeenCalledWith({
			id: 'today-1',
			date: '2024-01-15',
			timeRange: '13:00-15:00',
			available: true,
		})
	})

	it('should highlight selected slot', () => {
		const selectedSlot = mockSlots[0]

		render(
			<DeliveryTimeSelector
				selectedSlot={selectedSlot}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		const selectedButton = screen.getByRole('button', { name: '13:00-15:00' })
		expect(selectedButton).toHaveClass('bg-primary', 'text-primary-foreground')
	})

	it('should disable unavailable slots', () => {
		render(
			<DeliveryTimeSelector
				selectedSlot={null}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		const unavailableSlot = screen.getByRole('button', { name: '17:00-19:00' })

		expect(unavailableSlot).toBeDisabled()
		expect(unavailableSlot).toHaveClass('opacity-50', 'cursor-not-allowed')
	})

	it('should display selected slot information', () => {
		const selectedSlot = mockSlots[0]

		render(
			<DeliveryTimeSelector
				selectedSlot={selectedSlot}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		expect(screen.getByText('Выбранное время:')).toBeInTheDocument()
		expect(screen.getByText(/Сегодня, 13:00-15:00/)).toBeInTheDocument()
	})

	it('should not display selected slot info when no slot is selected', () => {
		render(
			<DeliveryTimeSelector
				selectedSlot={null}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		expect(screen.queryByText('Выбранное время:')).not.toBeInTheDocument()
	})

	it('should display no slots available message when no slots are available', async () => {
		const { generateDeliveryTimeSlots, isTimeSlotAvailable } = vi.mocked(
			await import('@/lib/delivery-utils')
		)

		generateDeliveryTimeSlots.mockReturnValue([])
		isTimeSlotAvailable.mockReturnValue(false)

		render(
			<DeliveryTimeSelector
				selectedSlot={null}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		expect(
			screen.getByText('На сегодня и завтра нет доступных слотов для доставки.')
		).toBeInTheDocument()
		expect(
			screen.getByText(/Доставка осуществляется с 11:00 до 21:00/)
		).toBeInTheDocument()
	})

	it('should apply custom className', () => {
		const { container } = render(
			<DeliveryTimeSelector
				selectedSlot={null}
				onSlotSelect={mockOnSlotSelect}
				className='custom-class'
			/>
		)

		expect(container.firstChild).toHaveClass('custom-class')
	})

	it('should organize slots in grid layout', () => {
		render(
			<DeliveryTimeSelector
				selectedSlot={null}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		const gridContainers = screen
			.getAllByRole('button')
			.map((button) => button.parentElement)
		const uniqueGridContainers = [...new Set(gridContainers)]

		uniqueGridContainers.forEach((container) => {
			expect(container).toHaveClass(
				'grid',
				'grid-cols-2',
				'sm:grid-cols-3',
				'gap-2'
			)
		})
	})

	it('should handle slots with unique time ranges across different dates', () => {
		render(
			<DeliveryTimeSelector
				selectedSlot={null}
				onSlotSelect={mockOnSlotSelect}
			/>
		)

		// Should have one button for each unique time range
		expect(
			screen.getByRole('button', { name: '13:00-15:00' })
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: '15:00-17:00' })
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: '11:00-13:00' })
		).toBeInTheDocument()
		expect(
			screen.getByRole('button', { name: '17:00-19:00' })
		).toBeInTheDocument()
	})
})
