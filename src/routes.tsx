import { createBrowserRouter } from 'react-router-dom'
import Menu from './pages/menu/menu'
import Booking from './pages/booking/booking'
import Contacts from './pages/contacts/contacts'
import About from './pages/about/about'
import Events from './pages/events/events'
import Cart from './pages/cart/cart'
import Checkout from './pages/checkout/checkout'
import OrderConfirmation from './pages/order-confirmation/order-confirmation'
import MenuLayout from './pages/menu/menu-layout'
import NotFound from './pages/not-found/not-found'
import { ProtectedRoute } from './components/ProtectedRoute'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <About />,
		errorElement: <NotFound />,
	},
	{
		path: '/menu',
		element: <MenuLayout />,
		errorElement: <NotFound />,
		children: [
			{
				index: true,
				element: <Menu />,
			},
			{
				path: ':categoryId',
				element: <Menu />,
			},
		],
	},
	{
		path: '/booking',
		element: <Booking />,
		errorElement: <NotFound />,
	},
	{
		path: '/contacts',
		element: <Contacts />,
		errorElement: <NotFound />,
	},
	{
		path: '/events',
		element: <Events />,
		errorElement: <NotFound />,
	},
	{
		path: '/cart',
		element: <Cart />,
		errorElement: <NotFound />,
	},
	{
		path: '/checkout',
		element: (
			<ProtectedRoute requireItems={true} redirectTo='/cart'>
				<Checkout />
			</ProtectedRoute>
		),
		errorElement: <NotFound />,
	},
	{
		path: '/order-confirmation',
		element: <OrderConfirmation />,
		errorElement: <NotFound />,
	},
	{
		path: '*',
		element: <NotFound />,
	},
])
