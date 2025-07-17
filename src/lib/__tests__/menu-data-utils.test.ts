import { describe, it, expect } from 'vitest'
import {
	getAllMenuItems,
	getMenuItemsByCategory,
	getMenuItemById,
	transformToMenuItem,
	validateMenuItem,
	getMenuCategories,
} from '../../pages/menu/data'
import type { MenuItem } from '@/types/delivery'

describe('Menu Data Utilities', () => {
	describe('getAllMenuItems', () => {
		it('should return all menu items from all categories', () => {
			const allItems = getAllMenuItems()

			expect(allItems).toBeDefined()
			expect(Array.isArray(allItems)).toBe(true)
			expect(allItems.length).toBeGreaterThan(0)

			// Check that we have items from different categories
			const categories = [...new Set(allItems.map((item) => item.category))]
			expect(categories.length).toBeGreaterThan(1)
			expect(categories).toContain('appetizers')
			expect(categories).toContain('desserts')
		})

		it('should return items with unique IDs', () => {
			const allItems = getAllMenuItems()
			const ids = allItems.map((item) => item.id)
			const uniqueIds = [...new Set(ids)]

			expect(ids.length).toBe(uniqueIds.length)
		})

		it('should return items that conform to MenuItem interface', () => {
			const allItems = getAllMenuItems()

			allItems.forEach((item) => {
				expect(item).toHaveProperty('id')
				expect(item).toHaveProperty('name')
				expect(item).toHaveProperty('composition')
				expect(item).toHaveProperty('legend')
				expect(item).toHaveProperty('weight')
				expect(item).toHaveProperty('price')
				expect(item).toHaveProperty('imageUrl')
				expect(item).toHaveProperty('category')

				expect(typeof item.id).toBe('number')
				expect(typeof item.name).toBe('string')
				expect(typeof item.composition).toBe('string')
				expect(typeof item.legend).toBe('string')
				expect(typeof item.weight).toBe('string')
				expect(typeof item.price).toBe('string')
				expect(typeof item.imageUrl).toBe('string')
				expect(typeof item.category).toBe('string')
			})
		})
	})

	describe('getMenuItemsByCategory', () => {
		it('should return items for valid categories', () => {
			const appetizers = getMenuItemsByCategory('appetizers')
			const desserts = getMenuItemsByCategory('desserts')

			expect(Array.isArray(appetizers)).toBe(true)
			expect(Array.isArray(desserts)).toBe(true)
			expect(appetizers.length).toBeGreaterThan(0)
			expect(desserts.length).toBeGreaterThan(0)

			appetizers.forEach((item) => {
				expect(item.category).toBe('appetizers')
			})

			desserts.forEach((item) => {
				expect(item.category).toBe('desserts')
			})
		})

		it('should return empty array for invalid categories', () => {
			const invalidCategory = getMenuItemsByCategory('invalid-category')
			expect(Array.isArray(invalidCategory)).toBe(true)
			expect(invalidCategory.length).toBe(0)
		})

		it('should return items for all valid categories', () => {
			const categories = [
				'appetizers',
				'salads',
				'soups',
				'main-courses',
				'dumplings',
				'pastas',
				'pizzas',
				'breads',
				'sushis',
				'desserts',
			]

			categories.forEach((category) => {
				const items = getMenuItemsByCategory(category)
				expect(Array.isArray(items)).toBe(true)
				expect(items.length).toBeGreaterThan(0)
				items.forEach((item) => {
					expect(item.category).toBe(category)
				})
			})
		})
	})

	describe('getMenuItemById', () => {
		it('should return correct item for valid ID', () => {
			const allItems = getAllMenuItems()
			const firstItem = allItems[0]
			const foundItem = getMenuItemById(firstItem.id)

			expect(foundItem).toBeDefined()
			expect(foundItem).toEqual(firstItem)
		})

		it('should return undefined for invalid ID', () => {
			const invalidItem = getMenuItemById(99999)
			expect(invalidItem).toBeUndefined()
		})

		it('should return undefined for negative ID', () => {
			const invalidItem = getMenuItemById(-1)
			expect(invalidItem).toBeUndefined()
		})
	})

	describe('transformToMenuItem', () => {
		it('should transform legacy item with all fields', () => {
			const legacyItem = {
				id: 100,
				name: 'Test Dish',
				composition: 'Test ingredients',
				legend: 'Test story',
				weight: '200g',
				price: '500.-',
				imageUrl: '/test.jpg',
			}

			const transformed = transformToMenuItem(legacyItem, 'test-category')

			expect(transformed).toEqual({
				id: 100,
				name: 'Test Dish',
				composition: 'Test ingredients',
				legend: 'Test story',
				weight: '200g',
				price: '500.-',
				imageUrl: '/test.jpg',
				category: 'test-category',
			})
		})

		it('should handle legacy item with alternative field names', () => {
			const legacyItem = {
				id: 101,
				name: 'Test Dish 2',
				ingredients: 'Alternative ingredients field',
				story: 'Alternative legend field',
				portion: '300g',
				cost: '600.-',
				photo: '/test2.jpg',
			}

			const transformed = transformToMenuItem(legacyItem, 'test-category')

			expect(transformed.composition).toBe('Alternative ingredients field')
			expect(transformed.legend).toBe('Alternative legend field')
			expect(transformed.weight).toBe('300g')
			expect(transformed.price).toBe('600.-')
			expect(transformed.imageUrl).toBe('/test2.jpg')
		})

		it('should use idOffset when item has no ID', () => {
			const legacyItem = {
				name: 'Test Dish 3',
				composition: 'Test ingredients',
			}

			const transformed = transformToMenuItem(legacyItem, 'test-category', 200)

			expect(transformed.id).toBe(200)
			expect(transformed.category).toBe('test-category')
		})

		it('should handle missing fields with empty strings', () => {
			const legacyItem = {
				id: 102,
				name: 'Minimal Dish',
			}

			const transformed = transformToMenuItem(legacyItem, 'test-category')

			expect(transformed.composition).toBe('')
			expect(transformed.legend).toBe('')
			expect(transformed.weight).toBe('')
			expect(transformed.price).toBe('')
			expect(transformed.imageUrl).toBe('')
		})
	})

	describe('validateMenuItem', () => {
		it('should return true for valid MenuItem', () => {
			const validItem: MenuItem = {
				id: 1,
				name: 'Valid Item',
				composition: 'Valid composition',
				legend: 'Valid legend',
				weight: '200g',
				price: '500.-',
				imageUrl: '/valid.jpg',
				category: 'valid-category',
			}

			expect(validateMenuItem(validItem)).toBe(true)
		})

		it('should return false for item missing required fields', () => {
			const invalidItems: Partial<MenuItem>[] = [
				{
					name: 'No ID',
					composition: '',
					legend: '',
					weight: '200g',
					price: '500.-',
					imageUrl: '/test.jpg',
					category: 'test',
				},
				{
					id: 1,
					composition: '',
					legend: '',
					weight: '200g',
					price: '500.-',
					imageUrl: '/test.jpg',
					category: 'test',
				},
				{
					id: 1,
					name: 'No weight',
					composition: '',
					legend: '',
					price: '500.-',
					imageUrl: '/test.jpg',
					category: 'test',
				},
				{
					id: 1,
					name: 'No price',
					composition: '',
					legend: '',
					weight: '200g',
					imageUrl: '/test.jpg',
					category: 'test',
				},
				{
					id: 1,
					name: 'No image',
					composition: '',
					legend: '',
					weight: '200g',
					price: '500.-',
					category: 'test',
				},
				{
					id: 1,
					name: 'No category',
					composition: '',
					legend: '',
					weight: '200g',
					price: '500.-',
					imageUrl: '/test.jpg',
				},
			]

			invalidItems.forEach((item) => {
				expect(validateMenuItem(item as MenuItem)).toBe(false)
			})
		})

		it('should return true even with empty optional fields', () => {
			const itemWithEmptyOptionals: MenuItem = {
				id: 1,
				name: 'Valid Item',
				composition: '', // Optional field can be empty
				legend: '', // Optional field can be empty
				weight: '200g',
				price: '500.-',
				imageUrl: '/valid.jpg',
				category: 'valid-category',
			}

			expect(validateMenuItem(itemWithEmptyOptionals)).toBe(true)
		})
	})

	describe('getMenuCategories', () => {
		it('should return all menu categories', () => {
			const categories = getMenuCategories()

			expect(Array.isArray(categories)).toBe(true)
			expect(categories.length).toBe(10)

			const expectedCategories = [
				'appetizers',
				'salads',
				'soups',
				'main-courses',
				'dumplings',
				'pastas',
				'pizzas',
				'breads',
				'sushis',
				'desserts',
			]

			expectedCategories.forEach((category) => {
				expect(categories).toContain(category)
			})
		})

		it('should return categories in expected order', () => {
			const categories = getMenuCategories()
			const expectedOrder = [
				'appetizers',
				'salads',
				'soups',
				'main-courses',
				'dumplings',
				'pastas',
				'pizzas',
				'breads',
				'sushis',
				'desserts',
			]

			expect(categories).toEqual(expectedOrder)
		})
	})

	describe('Data Consistency', () => {
		it('should have consistent data structure across all categories', () => {
			const allItems = getAllMenuItems()

			allItems.forEach((item) => {
				expect(validateMenuItem(item)).toBe(true)
			})
		})

		it('should have proper ID ranges for each category', () => {
			const categories = getMenuCategories()

			categories.forEach((category) => {
				const items = getMenuItemsByCategory(category)
				const ids = items.map((item) => item.id)

				// IDs should be unique within category
				const uniqueIds = [...new Set(ids)]
				expect(ids.length).toBe(uniqueIds.length)

				// All IDs should be positive numbers
				ids.forEach((id) => {
					expect(typeof id).toBe('number')
					expect(id).toBeGreaterThan(0)
				})
			})
		})

		it('should have valid image URLs', () => {
			const allItems = getAllMenuItems()

			allItems.forEach((item) => {
				expect(item.imageUrl).toMatch(/^\/assets\//)
				expect(item.imageUrl).toMatch(/\.(jpg|jpeg|png|webp)$/)
			})
		})

		it('should have valid price format', () => {
			const allItems = getAllMenuItems()

			allItems.forEach((item) => {
				// Price should end with '.-' and contain numbers
				expect(item.price).toMatch(/^\d+\.-$/)
			})
		})

		it('should have valid weight format', () => {
			const allItems = getAllMenuItems()

			allItems.forEach((item) => {
				// Weight should contain numbers and 'г' (gram symbol)
				expect(item.weight).toMatch(/\d+\s*г/)
			})
		})
	})
})
