import { useParams, Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import Sushis from './components/sushis'
import Soups from './components/soups'
import Salads from './components/salads'
import Pizzas from './components/pizzas'
import Pastas from './components/pastas'
import MainCourses from './components/main-courses'
import Dumplings from './components/dumplings'
import Desserts from './components/desserts'
import Breads from './components/breads'
import Appetizers from './components/appetizers'

type Category = {
	id: string
	name: string
	component: ReactNode
}

function Menu() {
	const { categoryId } = useParams()

	const categories: Category[] = [
		{ id: 'appetizers', name: 'Закуски', component: <Appetizers /> },
		{ id: 'salads', name: 'Салаты', component: <Salads /> },
		{ id: 'soups', name: 'Супы', component: <Soups /> },
		{ id: 'main-courses', name: 'Горячее', component: <MainCourses /> },
		{ id: 'dumplings', name: 'Пельмени/Вареники', component: <Dumplings /> },
		{ id: 'pastas', name: 'Паста', component: <Pastas /> },
		{ id: 'pizzas', name: 'Пицца', component: <Pizzas /> },
		{ id: 'breads', name: 'Хлеб', component: <Breads /> },
		{ id: 'sushis', name: 'Суши', component: <Sushis /> },
		{ id: 'desserts', name: 'Десерты', component: <Desserts /> },
	]

	const renderContent = (): ReactNode => {
		if (categoryId) {
			const category = categories.find((c) => c.id === categoryId)
			return category ? category.component : null
		}

		return categories.map((category) => (
			<div key={category.id}>{category.component}</div>
		))
	}

	return (
		<div className='menu-container'>
			<div
				className='w-full flex gap-2 px-8 py-2 overflow-x-auto sticky top-16 bg-milk-500 z-10 
                [-ms-overflow-style:none] [scrollbar-width:none] 
                [&::-webkit-scrollbar]:hidden'
			>
				<div className='flex flex-nowrap gap-2 min-w-max'>
					<Link
						to='/menu'
						className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap border-2 ${
							!categoryId
								? 'border-wave-500 text-wave-500 hover:bg-wave-500/10'
								: 'border-gold-500 text-gold-500 hover:bg-gold-500/10'
						}`}
					>
						Все меню
					</Link>

					{categories.map((category) => (
						<Link
							key={category.id}
							to={`/menu/${category.id}`}
							className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap border-2 ${
								categoryId === category.id
									? 'border-wave-500 text-wave-500 hover:bg-wave-500/10'
									: 'border-gold-500 text-gold-500 hover:bg-gold-500/10'
							}`}
						>
							{category.name}
						</Link>
					))}
				</div>
			</div>
			<div className=''>{renderContent()}</div>
		</div>
	)
}

export default Menu
