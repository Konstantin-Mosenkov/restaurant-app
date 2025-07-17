import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './components/ui/toast'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ToastProvider>
			<CartProvider>
				<RouterProvider router={router} />
			</CartProvider>
		</ToastProvider>
	</StrictMode>
)
