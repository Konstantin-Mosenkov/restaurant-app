import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
	generateDeliveryTimeSlots,
	isTimeSlotAvailable,
	groupTimeSlotsByDate,
	getDateDisplayLabel,
	formatDeliveryTimeSlot,
} from '@/lib/delivery-utils'
import type { DeliveryTimeSlot } from '@/types/delivery'

// Mock Date for consistent testing - using local time to avoid timezone issues
const mockDate = new Date(2024, 0, 15, 10, 30, 0) // Monday 10:30 AM local time

describe('Delivery Time Slot Generation', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(mockDate)
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('generateDeliveryTimeSlots', () => {
		it('should generate time slots for today and tomorrow', () => {
			const slots = generateDeliveryTimeSlots()

			// Should have slots for both today and tomorrow
			const todaySlots = slots.filter((slot) => slot.id.startsWith('today-'))
			const tomorrowSlots = slots.filter((slot) =>
				slot.id.startsWith('tomorrow-')
			)

			expect(tomorrowSlots).toHaveLength(5) // All 5 slots for tomorrow
			expect(todaySlots.length).toBeGreaterThan(0) // Some slots for today
		})

		it('should only include future slots for today with 2-hour buffer', () => {
			// Current time is 10:30 AM, so only slots starting at 13:00 or later should be available
			// 13:00 is 2.5 hours away, 15:00 is 4.5 hours away, etc.
			const slots = generateDeliveryTimeSlots()
			const todaySlots = slots.filter((slot) => slot.id.startsWith('today-'))

			// Should include 13:00-15:00, 15:00-17:00, 17:00-19:00, 19:00-21:00
			// But 11:00-13:00 should be excluded (only 0.5 hours away)
			expect(todaySlots.length).toBeGreaterThanOrEqual(2) // At least 2 slots should be available

			// First available slot should be 13:00-15:00 or later
			if (todaySlots.length > 0) {
				const firstSlot = todaySlots[0]
				const [startHour] = firstSlot.timeRange.split(':').map(Number)
				expect(startHour).toBeGreaterThanOrEqual(13)
			}
		})

		it('should include all slots for tomorrow', () => {
			const slots = generateDeliveryTimeSlots()
			const tomorrowSlots = slots.filter((slot) =>
				slot.id.startsWith('tomorrow-')
			)

			expect(tomorrowSlots).toHaveLength(5)
			expect(tomorrowSlots.map((slot) => slot.timeRange)).toEqual([
				'11:00-13:00',
				'13:00-15:00',
				'15:00-17:00',
				'17:00-19:00',
				'19:00-21:00',
			])
		})

		it('should set all generated slots as available by default', () => {
			const slots = generateDeliveryTimeSlots()

			slots.forEach((slot) => {
				expect(slot.available).toBe(true)
			})
		})

		it('should generate correct date strings', () => {
			const slots = generateDeliveryTimeSlots()
			const today = new Date(mockDate).toISOString().split('T')[0]
			const tomorrow = new Date(mockDate)
			tomorrow.setDate(tomorrow.getDate() + 1)
			const tomorrowStr = tomorrow.toISOString().split('T')[0]

			const todaySlots = slots.filter((slot) => slot.date === today)
			const tomorrowSlots = slots.filter((slot) => slot.date === tomorrowStr)

			expect(todaySlots.length).toBeGreaterThan(0)
			expect(tomorrowSlots.length).toBe(5)
		})
	})

	describe('isTimeSlotAvailable', () => {
		it('should return true for tomorrow slots that are marked available', () => {
			const tomorrow = new Date(mockDate)
			tomorrow.setDate(tomorrow.getDate() + 1)

			const slot: DeliveryTimeSlot = {
				id: 'tomorrow-0',
				date: tomorrow.toISOString().split('T')[0],
				timeRange: '11:00-13:00',
				available: true,
			}

			expect(isTimeSlotAvailable(slot)).toBe(true)
		})

		it('should return false for tomorrow slots that are marked unavailable', () => {
			const tomorrow = new Date(mockDate)
			tomorrow.setDate(tomorrow.getDate() + 1)

			const slot: DeliveryTimeSlot = {
				id: 'tomorrow-0',
				date: tomorrow.toISOString().split('T')[0],
				timeRange: '11:00-13:00',
				available: false,
			}

			expect(isTimeSlotAvailable(slot)).toBe(false)
		})

		it('should return true for today slots that are far enough in the future', () => {
			const today = new Date(mockDate).toISOString().split('T')[0]

			const slot: DeliveryTimeSlot = {
				id: 'today-2',
				date: today,
				timeRange: '15:00-17:00', // 4.5 hours from 10:30 AM
				available: true,
			}

			expect(isTimeSlotAvailable(slot)).toBe(true)
		})

		it('should return false for today slots that are too soon', () => {
			const today = new Date(mockDate).toISOString().split('T')[0]

			const slot: DeliveryTimeSlot = {
				id: 'today-0',
				date: today,
				timeRange: '11:00-13:00', // Only 0.5 hours from 10:30 AM
				available: true,
			}

			expect(isTimeSlotAvailable(slot)).toBe(false)
		})

		it('should return false for past dates', () => {
			const yesterday = new Date(mockDate)
			yesterday.setDate(yesterday.getDate() - 1)

			const slot: DeliveryTimeSlot = {
				id: 'yesterday-0',
				date: yesterday.toISOString().split('T')[0],
				timeRange: '15:00-17:00',
				available: true,
			}

			expect(isTimeSlotAvailable(slot)).toBe(false)
		})
	})

	describe('groupTimeSlotsByDate', () => {
		it('should group slots by date correctly', () => {
			const slots = generateDeliveryTimeSlots()
			const grouped = groupTimeSlotsByDate(slots)

			const dates = Object.keys(grouped)
			expect(dates.length).toBeGreaterThanOrEqual(1) // At least today or tomorrow

			// Each group should contain only slots for that date
			Object.entries(grouped).forEach(([date, dateSlots]) => {
				dateSlots.forEach((slot) => {
					expect(slot.date).toBe(date)
				})
			})
		})

		it('should handle empty slot array', () => {
			const grouped = groupTimeSlotsByDate([])
			expect(grouped).toEqual({})
		})
	})

	describe('getDateDisplayLabel', () => {
		it('should return "Сегодня" for today', () => {
			const today = new Date(mockDate).toISOString().split('T')[0]
			expect(getDateDisplayLabel(today)).toBe('Сегодня')
		})

		it('should return "Завтра" for tomorrow', () => {
			const tomorrow = new Date(mockDate)
			tomorrow.setDate(tomorrow.getDate() + 1)
			const tomorrowStr = tomorrow.toISOString().split('T')[0]

			expect(getDateDisplayLabel(tomorrowStr)).toBe('Завтра')
		})

		it('should return formatted date for other dates', () => {
			const futureDate = new Date(mockDate)
			futureDate.setDate(futureDate.getDate() + 2)
			const futureDateStr = futureDate.toISOString().split('T')[0]

			const label = getDateDisplayLabel(futureDateStr)
			expect(label).toMatch(/\d+\s+\S+/) // Should match "17 января" format (number + space + word)
		})
	})

	describe('formatDeliveryTimeSlot', () => {
		it('should format today slot correctly', () => {
			const today = new Date(mockDate).toISOString().split('T')[0]
			const slot: DeliveryTimeSlot = {
				id: 'today-0',
				date: today,
				timeRange: '15:00-17:00',
				available: true,
			}

			expect(formatDeliveryTimeSlot(slot)).toBe('Сегодня, 15:00-17:00')
		})

		it('should format tomorrow slot correctly', () => {
			const tomorrow = new Date(mockDate)
			tomorrow.setDate(tomorrow.getDate() + 1)
			const tomorrowStr = tomorrow.toISOString().split('T')[0]

			const slot: DeliveryTimeSlot = {
				id: 'tomorrow-0',
				date: tomorrowStr,
				timeRange: '11:00-13:00',
				available: true,
			}

			expect(formatDeliveryTimeSlot(slot)).toBe('Завтра, 11:00-13:00')
		})
	})
})

describe('Edge Cases and Error Handling', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should handle late evening time correctly', () => {
		// Set time to 8 PM (20:00)
		const lateEvening = new Date(2024, 0, 15, 20, 0, 0) // 8:00 PM local time
		vi.setSystemTime(lateEvening)

		const slots = generateDeliveryTimeSlots()
		const todaySlots = slots.filter((slot) => slot.id.startsWith('today-'))

		// No slots should be available for today since it's too late
		expect(todaySlots).toHaveLength(0)

		// But tomorrow slots should still be available
		const tomorrowSlots = slots.filter((slot) =>
			slot.id.startsWith('tomorrow-')
		)
		expect(tomorrowSlots).toHaveLength(5)
	})

	it('should handle exact 2-hour boundary correctly', () => {
		// Set time to exactly 2 hours before a slot (11:00 AM for 13:00 slot)
		const exactBoundary = new Date(2024, 0, 15, 11, 0, 0) // 11:00 AM local time
		vi.setSystemTime(exactBoundary)

		const slots = generateDeliveryTimeSlots()
		const todaySlots = slots.filter((slot) => slot.id.startsWith('today-'))

		// Should include 13:00 slot since it's exactly 2 hours away
		const thirteenSlot = todaySlots.find(
			(slot) => slot.timeRange === '13:00-15:00'
		)
		expect(thirteenSlot).toBeDefined()

		// Verify that slots before 13:00 are not included
		const elevenSlot = todaySlots.find(
			(slot) => slot.timeRange === '11:00-13:00'
		)
		expect(elevenSlot).toBeUndefined()
	})

	it('should handle midnight edge case', () => {
		// Set time to just after midnight
		const afterMidnight = new Date(2024, 0, 16, 0, 30, 0) // 12:30 AM local time
		vi.setSystemTime(afterMidnight)

		const slots = generateDeliveryTimeSlots()

		// Should generate slots for the new "today" and "tomorrow"
		expect(slots.length).toBeGreaterThan(0)

		// All slots for "today" (which is now Jan 16) should be available
		const todaySlots = slots.filter((slot) => slot.id.startsWith('today-'))
		expect(todaySlots).toHaveLength(5) // All 5 slots since it's early morning
	})
})
