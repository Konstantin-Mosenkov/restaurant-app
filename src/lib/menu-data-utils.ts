import type { MenuItem } from '@/types/delivery'

// Legacy interfaces for existing data structures
interface LegacyMenuData {
	id: number
	name: string
	composition: string
	legend: string
	weight: string
	price: string
	imageUrl: string
}

/**
 * Transforms legacy menu data to standardized MenuItem interface
 * @param data - Array of legacy menu items
 * @param category - Category name to assign to all items
 * @returns Array of standardized MenuItem objects
 */
export function transformToMenuItem(
	data: LegacyMenuData[],
	category: string
): MenuItem[] {
	return data.map((item) => ({
		...item,
		category,
	}))
}

/**
 * Validates that a menu item has all required fields
 * @param item - Menu item to validate
 * @returns boolean indicating if item is valid
 */
export function validateMenuItem(item: MenuItem): boolean {
	return !!(
		item.id &&
		item.name &&
		typeof item.composition === 'string' &&
		typeof item.legend === 'string' &&
		item.weight &&
		item.price &&
		item.imageUrl &&
		item.category
	)
}

/**
 * Validates an array of menu items
 * @param items - Array of menu items to validate
 * @returns Object with validation results
 */
export function validateMenuItems(items: MenuItem[]): {
	isValid: boolean
	invalidItems: number[]
	validCount: number
	totalCount: number
} {
	const invalidItems: number[] = []
	let validCount = 0

	items.forEach((item, index) => {
		if (validateMenuItem(item)) {
			validCount++
		} else {
			invalidItems.push(index)
		}
	})

	return {
		isValid: invalidItems.length === 0,
		invalidItems,
		validCount,
		totalCount: items.length,
	}
}

/**
 * Filters menu items by category
 * @param items - Array of menu items
 * @param category - Category to filter by
 * @returns Filtered array of menu items
 */
export function filterByCategory(
	items: MenuItem[],
	category: string
): MenuItem[] {
	return items.filter((item) => item.category === category)
}

/**
 * Gets unique categories from menu items
 * @param items - Array of menu items
 * @returns Array of unique category names
 */
export function getUniqueCategories(items: MenuItem[]): string[] {
	const categories = items.map((item) => item.category)
	return [...new Set(categories)]
}
