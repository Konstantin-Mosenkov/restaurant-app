import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ToastProvider, useToast } from '../toast'

// Test component to use the toast hook
function TestComponent() {
	const { addToast, clearToasts } = useToast()

	return (
		<div>
			<button
				onClick={() =>
					addToast({
						type: 'success',
						title: 'Success Toast',
						description: 'This is a success message',
					})
				}
			>
				Add Success Toast
			</button>
			<button
				onClick={() =>
					addToast({
						type: 'error',
						title: 'Error Toast',
						description: 'This is an error message',
						duration: 1000,
					})
				}
			>
				Add Error Toast
			</button>
			<button
				onClick={() =>
					addToast({
						type: 'warning',
						title: 'Warning Toast',
					})
				}
			>
				Add Warning Toast
			</button>
			<button onClick={clearToasts}>Clear All Toasts</button>
		</div>
	)
}

describe('Toast System', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.runOnlyPendingTimers()
		vi.useRealTimers()
	})

	it('should render toast provider without errors', () => {
		render(
			<ToastProvider>
				<div>Test content</div>
			</ToastProvider>
		)

		expect(screen.getByText('Test content')).toBeInTheDocument()
	})

	it('should throw error when useToast is used outside provider', () => {
		// Suppress console.error for this test
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		expect(() => {
			render(<TestComponent />)
		}).toThrow('useToast must be used within a ToastProvider')

		consoleSpy.mockRestore()
	})

	it('should display success toast', async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>
		)

		await act(async () => {
			fireEvent.click(screen.getByText('Add Success Toast'))
		})

		await waitFor(() => {
			expect(screen.getByText('Success Toast')).toBeInTheDocument()
			expect(screen.getByText('This is a success message')).toBeInTheDocument()
		})
	})

	it('should display error toast', async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>
		)

		await act(async () => {
			fireEvent.click(screen.getByText('Add Error Toast'))
		})

		await waitFor(() => {
			expect(screen.getByText('Error Toast')).toBeInTheDocument()
			expect(screen.getByText('This is an error message')).toBeInTheDocument()
		})
	})

	it('should display warning toast without description', async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>
		)

		await act(async () => {
			fireEvent.click(screen.getByText('Add Warning Toast'))
		})

		await waitFor(() => {
			expect(screen.getByText('Warning Toast')).toBeInTheDocument()
		})

		expect(
			screen.queryByText('This is a warning message')
		).not.toBeInTheDocument()
	})

	it('should auto-dismiss toast after specified duration', async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>
		)

		await act(async () => {
			fireEvent.click(screen.getByText('Add Error Toast'))
		})

		await waitFor(() => {
			expect(screen.getByText('Error Toast')).toBeInTheDocument()
		})

		// Fast-forward time by 1000ms (the duration set for error toast)
		act(() => {
			vi.advanceTimersByTime(1000)
		})

		await waitFor(() => {
			expect(screen.queryByText('Error Toast')).not.toBeInTheDocument()
		})
	})

	it('should remove toast when close button is clicked', async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>
		)

		await act(async () => {
			fireEvent.click(screen.getByText('Add Success Toast'))
		})

		await waitFor(() => {
			expect(screen.getByText('Success Toast')).toBeInTheDocument()
		})

		// Find and click the close button (X icon)
		const closeButtons = screen.getAllByRole('button')
		const closeButton = closeButtons.find(
			(button) => button.querySelector('svg') && !button.textContent
		)

		expect(closeButton).toBeInTheDocument()

		await act(async () => {
			fireEvent.click(closeButton!)
		})

		await waitFor(() => {
			expect(screen.queryByText('Success Toast')).not.toBeInTheDocument()
		})
	})

	it('should clear all toasts when clearToasts is called', async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>
		)

		// Add multiple toasts
		await act(async () => {
			fireEvent.click(screen.getByText('Add Success Toast'))
			fireEvent.click(screen.getByText('Add Error Toast'))
			fireEvent.click(screen.getByText('Add Warning Toast'))
		})

		await waitFor(() => {
			expect(screen.getByText('Success Toast')).toBeInTheDocument()
			expect(screen.getByText('Error Toast')).toBeInTheDocument()
			expect(screen.getByText('Warning Toast')).toBeInTheDocument()
		})

		// Clear all toasts
		await act(async () => {
			fireEvent.click(screen.getByText('Clear All Toasts'))
		})

		await waitFor(() => {
			expect(screen.queryByText('Success Toast')).not.toBeInTheDocument()
			expect(screen.queryByText('Error Toast')).not.toBeInTheDocument()
			expect(screen.queryByText('Warning Toast')).not.toBeInTheDocument()
		})
	})

	it('should handle multiple toasts correctly', async () => {
		render(
			<ToastProvider>
				<TestComponent />
			</ToastProvider>
		)

		// Add multiple toasts
		await act(async () => {
			fireEvent.click(screen.getByText('Add Success Toast'))
			fireEvent.click(screen.getByText('Add Error Toast'))
		})

		// Both should be visible
		await waitFor(() => {
			expect(screen.getByText('Success Toast')).toBeInTheDocument()
			expect(screen.getByText('Error Toast')).toBeInTheDocument()
		})
	})
})
