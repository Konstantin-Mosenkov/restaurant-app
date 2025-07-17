import type { MenuItem } from '@/types/delivery'

// Centralized menu data for all categories
export const appetizers: MenuItem[] = [
	{
		id: 1,
		name: '«Шепот холодных морей» Мидии в сливочно-чесночном соусе',
		composition: 'мидии, сливочный соус, чеснок, лук зеленый',
		legend:
			'На Курильских островах говорят: «Настоящая мидия — та, что три года слушала, как бьётся сердце океана» Эти мидии впитывают вкус Курильских туманов, их раковины хранят отзвуки штормов Японского моря.',
		weight: '390 г',
		price: '780.-',
		imageUrl: '/assets/appetizers-1.jpg',
		category: 'appetizers',
	},
	{
		id: 2,
		name: '«На волне специй» Тигровые креветки в соусе карри, подаются с кукурузным хлебом',
		composition:
			'креветки тигровые, кокосовое молоко, соус карри, чеснок, томаты, кинза, лук зеленый, кабачки',
		legend:
			'Легенды гласят, шеф-повар, вдохновленный рассказами странников о далекой Индии, решил связать два мира — вкус моря и пряный аромат карри. Так появился этот рецепт.',
		weight: '350 г',
		price: '970.-',
		imageUrl: '/assets/appetizers-2.jpg',
		category: 'appetizers',
	},
	{
		id: 3,
		name: 'Строганина из пеламиды',
		composition:
			'филе атлантической пеламиды, соус на основе тамаринда с черносливом, лук красный маринованный, хлеб бородинский, лимон',
		legend: '',
		weight: '230 г',
		price: '790.-',
		imageUrl: '/assets/appetizers-3.jpg',
		category: 'appetizers',
	},
	{
		id: 4,
		name: 'Тартар из говядины по-азиатски',
		composition: 'говядина, рисовые чипсы, зеленый лук, трюфельный крем',
		legend:
			'Тартар из говядины — это французская интерпретация сырых мясных блюд, вдохновлённая экзотическими легендами о татарах. Сегодня это деликатес высокой кухни.',
		weight: '170 г',
		price: '790.-',
		imageUrl: '/assets/appetizers-1.jpg',
		category: 'appetizers',
	},
	{
		id: 5,
		name: 'Тартар из маринованного лосося',
		composition:
			'лосось маринованный, авокадо, томаты, лук шнит, соус ореховый, крем-чиз, цитрусовый майонез',
		legend:
			'Тартар из лосося – это фьюжн-блюдо, объединившее: французскую технику (мелкая нарезка, соусы), скандинавский опыт (маринование рыбы), азиатские мотивы (кислые маринады). Его история коротка, но насыщенна – от кухни викингов до мишленовских ресторанов!',
		weight: '230 г',
		price: '770.-',
		imageUrl: '/assets/appetizers-2.jpg',
		category: 'appetizers',
	},
	{
		id: 6,
		name: '«Форт Манго» Креветки темпура',
		composition:
			'тигровые креветки, кляр темпура, соус манго, кунжутный соус, микс салат',
		legend:
			'Говорят, рецепт этого соуса привезли в Кронштадт моряки с дальних островов — в трюмах их кораблей среди ящиков с провизией случайно оказались спелые манго. Местный кок, вдохновившись японской темпурой (о которой уже ходили легенды в порту), смешал пюре манго с имбирём и перчиком — так родился этот нежный, но дерзкий союз северного ветра и южного солнца.',
		weight: '210 г',
		price: '590.-',
		imageUrl: '/assets/appetizers-3.jpg',
		category: 'appetizers',
	},
	{
		id: 7,
		name: 'Пармская ветчина',
		composition:
			'окорок свиной сыровяленный, клубника, микрозелень, хлеб кукурузный',
		legend: '',
		weight: '130 г',
		price: '650.-',
		imageUrl: '/assets/appetizers-2.jpg',
		category: 'appetizers',
	},
	{
		id: 8,
		name: 'Сырная тарелка',
		composition:
			'сыр пармезан, дор блю, маасдам, фундук, грецкий орех, клубника, голубика, мед, микрозелень',
		legend: '',
		weight: '210 г',
		price: '880.-',
		imageUrl: '/assets/appetizers-1.jpg',
		category: 'appetizers',
	},
	{
		id: 9,
		name: '«Адмиральская тайна» Паштет из куриной печени',
		composition:
			'куриная печень, моченая брусника, яблочный конфитюр, микрозелень, хлебные чипсы',
		legend:
			'По слухам, этот рецепт любил один Кронштадтский адмирал, а его повар добавлял в паштет секретный ингредиент — каплю коньяка из корабельных запасов.',
		weight: '220 г',
		price: '530.-',
		imageUrl: '/assets/appetizers-3.jpg',
		category: 'appetizers',
	},
	{
		id: 10,
		name: '«Русская тройка» Ассорти из сала',
		composition:
			'сало 3 вида, соленный огурчик, помидорчик, капуста, хлеб бородинский, горчица, хрен',
		legend:
			'Почему «тройка»? Три богатыря закуски – сало, мясо, соленья. Три стихии – жир, белок, кислота. Три удара по голоду, жажде и тоске. «Русская тройка не подведёт – либо врага с ног собьёт, либо похмелье победит!»',
		weight: '210 г',
		price: '540.-',
		imageUrl: '/assets/appetizers-1.jpg',
		category: 'appetizers',
	},
]

export const salads: MenuItem[] = [
	{
		id: 11,
		name: '«Царский Оливье» Салат оливье с куриной грудкой',
		composition:
			'мясо цыпленка, картофель печеный, горошек,огурец соленый бочковой, яйцо отварное, майонез',
		legend:
			'Этот салат придумал в Москве француз Люсьен Оливье ещё при Николае II. Одно из излюбленных блюд императорской семьи, подавался на царской яхте.',
		weight: '240 г',
		price: '460.-',
		imageUrl: '/assets/salad-1.jpg',
		category: 'salads',
	},
	{
		id: 12,
		name: '«Император или повар» Цезарь с курицей',
		composition:
			'куриная грудка,салат ромейн, салат айсберг, сыр пармезан, соус цезарь',
		legend:
			'Два гения: полководец или кулинар. Салат назван не в честь императора, а по имени повара Цезаря Кардини, который в 1920-х годах в США придумал рецепт. Любимый салат голливудских звезд.',
		weight: '235 г',
		price: '660.-',
		imageUrl: '/assets/salad-2.jpg',
		category: 'salads',
	},
	{
		id: 13,
		name: 'Цезарь с креветкой',
		composition:
			'креветки, салат ромейн, салат айсберг, сыр пармезан, соус цезарь',
		legend:
			'Оригинальный рецепт салата никогда не содержал курицу — её придумали позже ленивые повара. Но креветки в нём появились не просто так: в 1924 году Цезарь Кардини увидел сон, где римский император Юлий Цезарь ел салат с розовыми морскими тварями и говорил: «Это пища победителей».',
		weight: '200 г',
		price: '760.-',
		imageUrl: '/assets/salad-3.jpg',
		category: 'salads',
	},
	{
		id: 14,
		name: 'Салат с маринованным лососем и кремом из авокадо',
		composition:
			'филе лосося, крем авокадо, микс салата, редис свежий, томаты черри, бобы эдомамэ, микрозелень',
		legend: '',
		weight: '240 г',
		price: '740.-',
		imageUrl: '/assets/salad-1.jpg',
		category: 'salads',
	},
	{
		id: 15,
		name: 'Салат севиче из тунца',
		composition:
			'филе атлантического тунца, огурец битый, маринованные томаты, микс салата, перец шичими, соус севиче',
		legend: '',
		weight: '200 г',
		price: '690.-',
		imageUrl: '/assets/salad-2.jpg',
		category: 'salads',
	},
	{
		id: 16,
		name: '«Дар Анатолии» Салат с хрустящими баклажанами',
		composition:
			'баклажаны, томаты, кинза,лук зеленый, кунжут, стамбульский соус',
		legend:
			'Старая турецкая поговорка гласит: «Если баклажан на сковороде не звенит, как сабля — он не достоин тебя». P.S. Если баклажаны вдруг станут мягкими — это не ваша вина. Просто они вас полюбили.',
		weight: '250 г',
		price: '560.-',
		imageUrl: '/assets/salad-3.jpg',
		category: 'salads',
	},
	{
		id: 17,
		name: 'Салат с подкопченным куриным филе и маринованными опятами',
		composition:
			'филе куриное, маринованные опята, огурец битый, редис свежий, микс салата, яйцо перепелиное, микрозелень, соус тонато',
		legend: '',
		weight: '260 г',
		price: '470.-',
		imageUrl: '/assets/salad-1.jpg',
		category: 'salads',
	},
]

export const soups: MenuItem[] = [
	{
		id: 18,
		name: '«Адмиральский» Флотский борщ по рецепту адмирала Макарова',
		composition: 'Мясо говядины, лук, морковь, капуста, свекла, укроп',
		legend:
			'В 1900 году в Кронштадте по приказу адмирала Макарова корабельные коки разработали особый рецепт борща – сытный, ароматный с добавлением свеклы, как на черноморском флоте.',
		weight: '430 г',
		price: '590.-',
		imageUrl: '/assets/soup-1.jpg',
		category: 'soups',
	},
	{
		id: 19,
		name: '«Огненный шепот джунглей и моря» Том ям с морепродуктами – традиционное наследие Тайланда, тайский суп на кокосовом молоке',
		composition:
			'тигровые креветки, кальмар, мидии, грибы шампиньоны, томаты черри, кокосовое молоко, лук, кинза',
		legend:
			'Считается, что «Том Ям» изначально готовили крестьяне и рыбаки, используя то, что было под рукой. А в наше время этот суп стал популярным во всем мире.',
		weight: '470 г',
		price: '860.-',
		imageUrl: '/assets/soup-2.jpg',
		category: 'soups',
	},
	{
		id: 20,
		name: '«Лохикейто» Уха по-фински',
		composition:
			'кета, картофель, лук-порей, томаты черри, сливки, лук зеленый, укроп',
		legend: 'Лохикейто – живая душа заснеженной Ладоги.',
		weight: '400 г',
		price: '790.-',
		imageUrl: '/assets/soup-3.jpg',
		category: 'soups',
	},
	{
		id: 21,
		name: '«Удача» Куриный суп по рецепту адмирала Ушакова',
		composition:
			'куриное бедро,яичная лапша, лук, морковь, корень сельдерея, укроп',
		legend:
			'В 18-м веке, когда русские корабли ходили в дальние плавания, коки придумали особый рецепт «штормового супа». Говорят, Адмирал Ушаков перед каждым боем ел именно этот суп – и ни один его корабль не утонул!',
		weight: '360 г',
		price: '370.-',
		imageUrl: '/assets/soup-1.jpg',
		category: 'soups',
	},
	{
		id: 22,
		name: 'Грибной крем-суп из белых грибов',
		composition: 'лесные грибы, сливки, трюфельное масло',
		legend: '',
		weight: '330 г',
		price: '520.-',
		imageUrl: '/assets/soup-2.jpg',
		category: 'soups',
	},
	{
		id: 23,
		name: '«Офицерская» Окрошка на квасе',
		composition:
			'Квас, язык говяжий, огурец свежий, редиска, яйцо отварное, зеленый лук, укроп.',
		legend:
			'Согласно циркуляру морского штаба от 1887 г., в рацион команд паровых судов, совершавших дальние плавания, в обязательном порядке включалось холодное квашеное блюдо на основе хлебного кваса.',
		weight: '350 г',
		price: '490.-',
		imageUrl: '/assets/soup-3.jpg',
		category: 'soups',
	},
	{
		id: 24,
		name: '«Таратор» Холодный Балканский суп',
		composition: 'Кефир, огурец, орех грецкий, мята, масло оливковое, сумах',
		legend:
			'В балканском фольклоре есть легенда, что слово составлено из: «Тара»(имя духа ветра) и «Тор» (древний бог грома). Будто бы суп был ритуальным блюдом, «охлаждающим» гнев стихий.',
		weight: '250 г',
		price: '400.-',
		imageUrl: '/assets/soup-1.jpg',
		category: 'soups',
	},
]

export const mainCourses: MenuItem[] = [
	{
		id: 25,
		name: 'Свиные ребра',
		composition: 'свиные ребра, картофель мини, лук красный, лук зеленый',
		legend: '',
		weight: '430 г',
		price: '690.-',
		imageUrl: '/assets/main-1.jpg',
		category: 'main-courses',
	},
	{
		id: 26,
		name: 'Кальмар с киноа в ореховом соусе',
		composition: 'филе кальмара, киноа, ореховый соус, микрозелень, перец чили',
		legend: '',
		weight: '310 г',
		price: '650.-',
		imageUrl: '/assets/main-2.jpg',
		category: 'main-courses',
	},
	{
		id: 27,
		name: '«Delmonico» Стейк стриплойн',
		composition: '',
		legend: 'Впервые подавался в ресторане Нью-Йорка с одноименным названием.',
		weight: '475 г',
		price: '1900.-',
		imageUrl: '/assets/main-3.jpg',
		category: 'main-courses',
	},
	{
		id: 28,
		name: 'Судак запечённый по-кронштадтски',
		composition:
			'Филе судака, сливочное масло, картофельное пюре, редис свежий, цитрусовая заправка, соус галандэз',
		legend:
			'В XIX веке Кронштадт славился своими рыбными рядами у Гостиного двора, где местные рыбаки торговали уловом с Финского залива. По этому рецепту судака подавали в русских трактирах, как знак уважения к гостю.',
		weight: '310 г',
		price: '850.-',
		imageUrl: '/assets/main-1.jpg',
		category: 'main-courses',
	},
	{
		id: 29,
		name: 'Судак сувид с лимонным ризотто',
		composition: 'Филе судака, рис арборио, сливки, лимон, микрозелень',
		legend: '',
		weight: '330 г',
		price: '840.-',
		imageUrl: '/assets/main-2.jpg',
		category: 'main-courses',
	},
	{
		id: 30,
		name: '«Конфи» Утиная ножка',
		composition:
			'утиный окорок, булгур, соус хойсин, микрозелень, сливочное масло, сыр пармезан',
		legend:
			'После Русско-японской войны этот рецепт попал в меню офицерского морского собрания Кронштадта. Сегодня мы воссоздали его по записям из дневника кока крейсера «Аврора».',
		weight: '320 г',
		price: '750.-',
		imageUrl: '/assets/main-3.jpg',
		category: 'main-courses',
	},
	{
		id: 31,
		name: '«Говяжьи щечки» По рецепту Огюста Эскофье',
		composition: 'говяжья томленая щека, птитим, соус демигляс, микрозелень',
		legend:
			'История потребления говяжьих щечек уходит корнями в европейскую крестьянскую кухню. Их использовали в блюдах, где медленное тушение позволяло сделать жесткие части мягкими и вкусными. Первым, кто начал готовить их в высокой кухне, стал шеф-повар Огюст Эскофье.',
		weight: '250 г',
		price: '1100.-',
		imageUrl: '/assets/main-1.jpg',
		category: 'main-courses',
	},
	{
		id: 32,
		name: '«По щучьему велению» Котлеты из щуки',
		composition: 'филе щуки, сухари панко, картофельное пюре, микрозелень',
		legend:
			'Любимое блюдо рыбаков. На Руси подавали котлеты приготовленные в печи.',
		weight: '300 г',
		price: '690.-',
		imageUrl: '/assets/main-2.jpg',
		category: 'main-courses',
	},
	{
		id: 33,
		name: '«Морепродукты по-деревенски» Два бокала вина Riesling в подарок',
		composition:
			'филе кальмара, мидии, креветки, гребешок, лимон, зелень, томаты черри',
		legend: '',
		weight: '450 г',
		price: '1500.-',
		imageUrl: '/assets/main-3.jpg',
		category: 'main-courses',
	},
]

export const dumplings: MenuItem[] = [
	{
		id: 34,
		name: '«Морская карусель» Пельмени с рыбой Из меню императорской яхты «Штандарт»',
		composition: 'форель, судак, тунец, горбуша, лук, морковь, тесто яичное',
		legend:
			'В 1887 году кронштадтские моряки, стоявшие на рейде в греческом Пирее, подсмотрели у местных рыбаков рецепт пельменей с тунцом. Вернувшись домой, они создали «карусель» из четырёх сортов рыбы: нежная форель, плотный тунец, судак и горбуша . Эти пельмени подавали даже на императорской яхте «Штандарт».',
		weight: '300 г',
		price: '690.-',
		imageUrl: '/assets/dumpling-2.jpg',
		category: 'dumplings',
	},
	{
		id: 35,
		name: '«Северный дозор» Пельмени с олениной',
		composition: 'мясо оленины, специи,тесто яичное',
		legend:
			'В 1879 году русские купцы, торговавшие пушниной в Сибири, переняли у ненцев секрет: оленину для пельменей надо смешивать с ледяной водой — тогда мясо остаётся сочным даже после варки. Эти пельмени спасали полярных исследователей в экспедиции.',
		weight: '300 г',
		price: '590.-',
		imageUrl: '/assets/dumpling-1.jpg',
		category: 'dumplings',
	},
	{
		id: 36,
		name: '«Виртиняй» Вареники с картошкой',
		composition: 'тесто, отварной картофель, жаренный лук',
		legend:
			'Одно из самых излюбленных блюд на Руси, которое лепили на Масленницу, Рождество и свадьбы.',
		weight: '315 г',
		price: '450.-',
		imageUrl: '/assets/dumpling-2.jpg',
		category: 'dumplings',
	},
]

export const pastas: MenuItem[] = [
	{
		id: 37,
		name: '«Римская карбонара с балтийским характером»',
		composition: 'бекон, сливки, яичный желток, сыр пармезан,черный перец',
		legend: '',
		weight: '250 г',
		price: '600.-',
		imageUrl: '/assets/pasta-1.jpg',
		category: 'pastas',
	},
	{
		id: 38,
		name: '«Аль помодоро» Паста с томатами и свежим базиликом',
		composition: 'томаты, базилик, соус наполи',
		legend: '',
		weight: '260 г',
		price: '530.-',
		imageUrl: '/assets/pasta-2.jpg',
		category: 'pastas',
	},
	{
		id: 39,
		name: 'Паста с курицей, вешенками и ореховым соусом',
		composition: 'филе куриное, грибы вешенки, сыр пармезан, соус ореховый',
		legend: '',
		weight: '390 г',
		price: '690.-',
		imageUrl: '/assets/pasta-3.jpg',
		category: 'pastas',
	},
	{
		id: 40,
		name: 'Паста с морепродуктами',
		composition: 'мидии, креветки, кальмар, соус наполи, петрушка, чеснок',
		legend: '',
		weight: '340 г',
		price: '690.-',
		imageUrl: '/assets/pasta-1.jpg',
		category: 'pastas',
	},
]

export const pizzas: MenuItem[] = [
	{
		id: 41,
		name: 'Маргарита',
		composition: '',
		legend: '',
		weight: '420 г',
		price: '630.-',
		imageUrl: '/assets/pizza-1.jpg',
		category: 'pizzas',
	},
	{
		id: 42,
		name: 'Пицца 4 сыра',
		composition:
			'Сыр моцарелла, сыр дор блю, сыр пармезан, сыр бри, оливковое масло',
		legend: '',
		weight: '420 г',
		price: '750.-',
		imageUrl: '/assets/pizza-2.jpg',
		category: 'pizzas',
	},
	{
		id: 43,
		name: 'Пицца с беконом и маскарпоне',
		composition: 'Бекон, сыр маскарпоне, сыр моцарелла, соус наполи, зелень',
		legend: '',
		weight: '550 г',
		price: '850.-',
		imageUrl: '/assets/pizza-3.jpg',
		category: 'pizzas',
	},
	{
		id: 44,
		name: 'Пеперони',
		composition: 'Колбаса пеперони, сыр моцарелла, соус наполи',
		legend: '',
		weight: '440 г',
		price: '700.-',
		imageUrl: '/assets/pizza-1.jpg',
		category: 'pizzas',
	},
	{
		id: 45,
		name: 'Пицца с баклажаном и соусом песто',
		composition:
			'Баклажан гриль, моцарелла, соус наполи, соус песто, сыр пармезан',
		legend: '',
		weight: '450 г',
		price: '680.-',
		imageUrl: '/assets/pizza-2.jpg',
		category: 'pizzas',
	},
	{
		id: 46,
		name: 'Пицца с ветчиной и грибами',
		composition:
			'Ветчина индейки, грибы шампиньоны, сыр моцарелла, соус наполи, зелень',
		legend: '',
		weight: '470 г',
		price: '780.-',
		imageUrl: '/assets/pizza-3.jpg',
		category: 'pizzas',
	},
]

export const breads: MenuItem[] = [
	{
		id: 47,
		name: 'Фокачча с розмарином',
		composition: '',
		legend: '',
		weight: '290 г',
		price: '300.-',
		imageUrl: '/assets/bread.jpg',
		category: 'breads',
	},
	{
		id: 48,
		name: 'Хлебная корзина',
		composition: '',
		legend: '',
		weight: '330 г',
		price: '340.-',
		imageUrl: '/assets/bread.jpg',
		category: 'breads',
	},
]

export const sushis: MenuItem[] = [
	{
		id: 49,
		name: 'Мини ролл с угрем',
		composition: 'Рис, угорь, нори, унаги соус, кунжут',
		legend: '',
		weight: '130 г',
		price: '480.-',
		imageUrl: '/assets/sushi-1.jpg',
		category: 'sushis',
	},
	{
		id: 50,
		name: 'Мини ролл с тунцом',
		composition: 'Рис, тунец, нори, унаги соус, кунжут',
		legend: '',
		weight: '130 г',
		price: '430.-',
		imageUrl: '/assets/sushi-2.jpg',
		category: 'sushis',
	},
	{
		id: 51,
		name: 'Мини ролл с лососем',
		composition: 'Рис, лосось, нори, унаги соус, кунжут',
		legend: '',
		weight: '130 г',
		price: '450.-',
		imageUrl: '/assets/sushi-3.jpg',
		category: 'sushis',
	},
	{
		id: 52,
		name: 'Ролл Филадельфия с лососем',
		composition:
			'Филе лосось, сыр творожный, огурец, авокадо, микрозелень, соус «сладкая соя», рис, нори',
		legend: '',
		weight: '270 г',
		price: '800.-',
		imageUrl: '/assets/sushi-1.jpg',
		category: 'sushis',
	},
	{
		id: 53,
		name: 'Ролл Филадельфия с угрем',
		composition: 'рис, угорь, авокадо, огурец, соус унаги',
		legend: '',
		weight: '260 г',
		price: '680.-',
		imageUrl: '/assets/sushi-2.jpg',
		category: 'sushis',
	},
	{
		id: 54,
		name: 'Гриль ролл с угрем и Японским омлетом',
		composition:
			'Угорь, японский омлет,творожный сыр, рис, нори, унаги соус, кунжут, лук зеленый, луковые чипсы',
		legend: '',
		weight: '255 г',
		price: '720.-',
		imageUrl: '/assets/sushi-3.jpg',
		category: 'sushis',
	},
	{
		id: 55,
		name: 'Гриль ролл снежный краб с японским омлетом',
		composition:
			'Рис, нори, снежный краб, японский омлет, творожный сыр,икра тобико, лук зеленый, микрозелень, унаги соус, кунжут, кани соус',
		legend: '',
		weight: '250 г',
		price: '650.-',
		imageUrl: '/assets/sushi-1.jpg',
		category: 'sushis',
	},
	{
		id: 56,
		name: 'Гриль ролл с мидиями',
		composition:
			'Рис, нори, снежный краб, гребешок, японский омлет, творожный сыр,икра тобико, лук зеленый, микрозелень, унаги соус, кунжут, кани соус',
		legend: '',
		weight: '260 г',
		price: '740.-',
		imageUrl: '/assets/sushi-2.jpg',
		category: 'sushis',
	},
	{
		id: 57,
		name: 'Гриль Ролл с гребешком и крабом',
		composition:
			'Рис, нори, лосось, угорь, тунец, кляр, микс салата, соус манго, соус ореховый',
		legend: '',
		weight: '340 г',
		price: '790.-',
		imageUrl: '/assets/sushi-3.jpg',
		category: 'sushis',
	},
	{
		id: 58,
		name: 'Сашими из тунца',
		composition: 'филе тунца, редис, кинза, перец шичими',
		legend: '',
		weight: '130 г',
		price: '430.-',
		imageUrl: '/assets/sushi-1.jpg',
		category: 'sushis',
	},
	{
		id: 59,
		name: 'Сашими из лосося',
		composition: 'филе лосося, огурец, микрозелень, соус понзу',
		legend: '',
		weight: '150 г',
		price: '620.-',
		imageUrl: '/assets/sushi-2.jpg',
		category: 'sushis',
	},
	{
		id: 60,
		name: 'Сашими из гребешка с трюфельным маслом',
		composition:
			'гребешок, трюфельное масло, микрозелень, соус терияки, кунжут',
		legend: '',
		weight: '90 г',
		price: '620.-',
		imageUrl: '/assets/sushi-3.jpg',
		category: 'sushis',
	},
]

export const desserts: MenuItem[] = [
	{
		id: 61,
		name: '«Тысяча леппестков» Мильфей',
		composition: 'слоеное тесто, заварной крем,ягодный соус, сезонные фрукты',
		legend:
			'По легенде десерт появился в Петербурге в 1912 году, к юбилею победы над Францией. Тогда его готовили в форме треуголки, а рассыпчатые крошки как снег.',
		weight: '200 г',
		price: '440.-',
		imageUrl: '/assets/dessert-1.jpg',
		category: 'desserts',
	},
	{
		id: 62,
		name: '«Чёрная жемчужина» Шоколадный Фондан',
		composition:
			'шоколадный фондан, подается с ванильным мороженым и сезонными фруктами',
		legend: '',
		weight: '170 г',
		price: '460.-',
		imageUrl: '/assets/dessert-2.jpg',
		category: 'desserts',
	},
	{
		id: 63,
		name: '«Солнце Азии» Чизкейк',
		composition: '',
		legend:
			'В 1887 году кронштадтский капитан дальнего плавания Иван Соколов привёз из Сингапура диковинные плоды — манго и личи. В портовой кондитерской «Северная пальма» их впервые смешали с нежным сырным кремом, создав незабываемый десерт.',
		weight: '230 г',
		price: '790.-',
		imageUrl: '/assets/dessert-1.jpg',
		category: 'desserts',
	},
	{
		id: 64,
		name: 'Мороженое/сорбет в ассортименте',
		composition: '',
		legend: '',
		weight: '50 г',
		price: '100.-',
		imageUrl: '/assets/dessert-2.jpg',
		category: 'desserts',
	},
]
// Utility functions for menu data transformation and access

/**
 * Get all menu items from all categories
 */
export const getAllMenuItems = (): MenuItem[] => {
	return [
		...appetizers,
		...salads,
		...soups,
		...mainCourses,
		...dumplings,
		...pastas,
		...pizzas,
		...breads,
		...sushis,
		...desserts,
	]
}

/**
 * Get menu items by category
 */
export const getMenuItemsByCategory = (category: string): MenuItem[] => {
	switch (category) {
		case 'appetizers':
			return appetizers
		case 'salads':
			return salads
		case 'soups':
			return soups
		case 'main-courses':
			return mainCourses
		case 'dumplings':
			return dumplings
		case 'pastas':
			return pastas
		case 'pizzas':
			return pizzas
		case 'breads':
			return breads
		case 'sushis':
			return sushis
		case 'desserts':
			return desserts
		default:
			return []
	}
}

/**
 * Get menu item by ID
 */
export const getMenuItemById = (id: number): MenuItem | undefined => {
	return getAllMenuItems().find((item) => item.id === id)
}

/**
 * Legacy menu item type for transformation
 */
export interface LegacyMenuItem {
	id?: number
	name?: string
	composition?: string
	ingredients?: string
	legend?: string
	story?: string
	description?: string
	weight?: string
	portion?: string
	price?: string
	cost?: string
	imageUrl?: string
	image?: string
	photo?: string
}

/**
 * Transform legacy menu data to MenuItem format
 * This function can be used to convert any existing data structures to the standardized format
 */
export const transformToMenuItem = (
	legacyItem: LegacyMenuItem,
	category: string,
	idOffset: number = 0
): MenuItem => {
	return {
		id: legacyItem.id || idOffset,
		name: legacyItem.name || '',
		composition: legacyItem.composition || legacyItem.ingredients || '',
		legend:
			legacyItem.legend || legacyItem.story || legacyItem.description || '',
		weight: legacyItem.weight || legacyItem.portion || '',
		price: legacyItem.price || legacyItem.cost || '',
		imageUrl: legacyItem.imageUrl || legacyItem.image || legacyItem.photo || '',
		category: category,
	}
}

/**
 * Validate MenuItem structure
 */
export const validateMenuItem = (item: MenuItem): boolean => {
	return !!(
		item.id &&
		item.name &&
		item.weight &&
		item.price &&
		item.imageUrl &&
		item.category
	)
}

/**
 * Get menu categories list
 */
export const getMenuCategories = (): string[] => {
	return [
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
}
