export default {
	openapi: '3.0.3',
	info: {
		title: 'BookMix API',
		version: '1.0.0',
		description: 'API для интернет-магазина книг',
	},
	servers: [
		{ url: 'http://localhost:5000', description: 'Local' }
	],
	components: {
		schemas: {
			Book: {
				type: 'object',
				properties: {
					id_book: { type: 'integer' },
					title: { type: 'string' },
					description: { type: 'string' },
					price: { type: 'number', format: 'float' },
					quantity: { type: 'integer' },
					author_id: { type: 'integer' },
					publisher_id: { type: 'integer' },
					category_id: { type: 'integer' },
					imageurl: { type: 'string' }
				}
			},
			User: {
				type: 'object',
				properties: {
					id_user: { type: 'integer' },
					lastname: { type: 'string' },
					firstname: { type: 'string' },
					email: { type: 'string' }
				}
			},
			Account: {
				type: 'object',
				properties: {
					id_account: { type: 'integer' },
					login: { type: 'string' },
					role_id: { type: 'integer' }
				}
			},
			Role: { type: 'object', properties: { id_role: { type: 'integer' }, rolename: { type: 'string' } } },
			Status: { type: 'object', properties: { id_status: { type: 'integer' }, status: { type: 'string' } } },
			DeliveryType: { type: 'object', properties: { id_deliverytype: { type: 'integer' }, typename: { type: 'string' } } },
			Address: {
				type: 'object',
				properties: {
					id_address: { type: 'integer' }, country: { type: 'string' }, city: { type: 'string' }, street: { type: 'string' }, house: { type: 'integer' }, apartment: { type: 'integer' }, indexmail: { type: 'string' }
				}
			},
			Author: {
				type: 'object',
				properties: {
					id_author: { type: 'integer' }, lastname: { type: 'string' }, firstname: { type: 'string' }, patronymic: { type: 'string' }, birthdate: { type: 'string', format: 'date' }, deathdate: { type: 'string', format: 'date' }
				}
			},
			Category: { type: 'object', properties: { id_category: { type: 'integer' }, name: { type: 'string' } } },
			Publisher: {
				type: 'object',
				properties: { id_publisher: { type: 'integer' }, legalname: { type: 'string' }, contactnum: { type: 'string' }, email: { type: 'string' }, address_id: { type: 'integer' } }
			},
			Order: { type: 'object', properties: { id_order: { type: 'integer' } } },
			OrderDetail: { type: 'object', properties: { id_orderdetail: { type: 'integer' }, order_id: { type: 'integer' }, price: { type: 'number' }, quantity: { type: 'integer' }, book_id: { type: 'integer' } } },
			Review: { type: 'object', properties: { id_review: { type: 'integer' }, rating: { type: 'integer' }, usercomment: { type: 'string' }, reviewdate: { type: 'string', format: 'date-time' } } }
		}
	},
	paths: {
		'/api/books': {
			get: {
				summary: 'Получить все книги',
				responses: { '200': { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Book' } } } } } }
			},
			post: {
				summary: 'Добавить книгу',
				requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
				responses: { '201': { description: 'Created' } }
			}
		},
		'/api/books/{id}': {
			get: { summary: 'Получить книгу', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } },
			put: { summary: 'Обновить книгу', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, price: { type: 'number' }, quantity: { type: 'integer' } } } } } }, responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } },
			delete: { summary: 'Удалить книгу', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' }, '404': { description: 'Not Found' } } }
		},
		'/api/users': {
			get: { summary: 'Получить всех пользователей', responses: { '200': { description: 'OK' } } },
			post: { summary: 'Зарегистрировать пользователя', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { account_id: { type: 'integer' }, login: { type: 'string' }, password: { type: 'string' }, role_id: { type: 'integer' }, lastname: { type: 'string' }, firstname: { type: 'string' }, email: { type: 'string' } } } } } }, responses: { '201': { description: 'Created' } } }
		},
		'/api/orders': {
			get: { summary: 'Все заказы', responses: { '200': { description: 'OK' } } },
			post: { summary: 'Создать заказ', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { user_id: { type: 'integer' }, status_id: { type: 'integer' }, deliverytype_id: { type: 'integer' }, address_id: { type: 'integer' }, items: { type: 'array', items: { type: 'object', properties: { book_id: { type: 'integer' }, quantity: { type: 'integer' }, price: { type: 'number' } }, required: ['book_id','quantity','price'] } } }, required: ['user_id','status_id','items'] } } } }, responses: { '201': { description: 'Created' } } }
		},
		'/api/orders/{id}': {
			get: { summary: 'Заказ по id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } }
		},
		'/api/orders/{id}/status': {
			put: { summary: 'Обновить статус заказа', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status_id: { type: 'integer' } }, required: ['status_id'] } } } }, responses: { '200': { description: 'OK' } } }
		},
		'/api/reviews/book/{bookId}': { get: { summary: 'Отзывы по книге', parameters: [{ name: 'bookId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' } } } },
		'/api/reviews': { post: { summary: 'Добавить отзыв', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Review' } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/reviews/{id}': { delete: { summary: 'Удалить отзыв', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } },
		'/api/deliverytypes': {
			get: { summary: 'Все типы доставки', responses: { '200': { description: 'OK' } } },
			post: { summary: 'Создать тип доставки', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/DeliveryType' } } } }, responses: { '201': { description: 'Created' } } }
		},
		'/api/deliverytypes/{id}': {
			get: { summary: 'Тип доставки по id', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } },
			put: { summary: 'Обновить тип доставки', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/DeliveryType' } } } }, responses: { '200': { description: 'OK' } } },
			delete: { summary: 'Удалить тип доставки', parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }], responses: { '200': { description: 'Deleted' } } }
		},
		'/api/statuses': { get: { summary: 'Все статусы', responses: { '200': { description: 'OK' } } }, post: { summary: 'Создать статус', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Status' } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/statuses/{id}': { get: { summary: 'Статус по id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } }, put: { summary: 'Обновить статус', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Status' } } } }, responses: { '200': { description: 'OK' } } }, delete: { summary: 'Удалить статус', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } },
		'/api/roles': { get: { summary: 'Все роли', responses: { '200': { description: 'OK' } } }, post: { summary: 'Создать роль', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Role' } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/roles/{id}': { get: { summary: 'Роль по id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } }, put: { summary: 'Обновить роль', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Role' } } } }, responses: { '200': { description: 'OK' } } }, delete: { summary: 'Удалить роль', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } },
		'/api/accounts': { get: { summary: 'Все аккаунты', responses: { '200': { description: 'OK' } } }, post: { summary: 'Создать аккаунт', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { login: { type: 'string' }, password: { type: 'string' }, role_id: { type: 'integer' } }, required: ['login','password','role_id'] } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/accounts/{id}': { get: { summary: 'Аккаунт по id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } }, delete: { summary: 'Удалить аккаунт', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } },
		'/api/accounts/{id}/role': { put: { summary: 'Обновить роль аккаунта', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { role_id: { type: 'integer' } }, required: ['role_id'] } } } }, responses: { '200': { description: 'OK' } } } },
		'/api/addresses': { get: { summary: 'Все адреса', responses: { '200': { description: 'OK' } } }, post: { summary: 'Создать адрес', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Address' } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/addresses/{id}': { get: { summary: 'Адрес по id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } }, put: { summary: 'Обновить адрес', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Address' } } } }, responses: { '200': { description: 'OK' } } }, delete: { summary: 'Удалить адрес', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } },
		'/api/authors': { get: { summary: 'Все авторы', responses: { '200': { description: 'OK' } } }, post: { summary: 'Создать автора', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Author' } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/authors/{id}': { get: { summary: 'Автор по id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } }, put: { summary: 'Обновить автора', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Author' } } } }, responses: { '200': { description: 'OK' } } }, delete: { summary: 'Удалить автора', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } },
		'/api/categories': { get: { summary: 'Все категории', responses: { '200': { description: 'OK' } } }, post: { summary: 'Создать категорию', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/categories/{id}': { get: { summary: 'Категория по id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } }, put: { summary: 'Обновить категорию', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } }, responses: { '200': { description: 'OK' } } }, delete: { summary: 'Удалить категорию', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } },
		'/api/publishers': { get: { summary: 'Все издатели', responses: { '200': { description: 'OK' } } }, post: { summary: 'Создать издателя', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Publisher' } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/publishers/{id}': { get: { summary: 'Издатель по id', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Not Found' } } }, put: { summary: 'Обновить издателя', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Publisher' } } } }, responses: { '200': { description: 'OK' } } }, delete: { summary: 'Удалить издателя', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } },
		'/api/orderdetails/order/{orderId}': { get: { summary: 'Детали заказа по Order_ID', parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'OK' } } } },
		'/api/orderdetails': { post: { summary: 'Создать позицию заказа', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderDetail' } } } }, responses: { '201': { description: 'Created' } } } },
		'/api/orderdetails/{id}': { put: { summary: 'Обновить позицию заказа', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { price: { type: 'number' }, quantity: { type: 'integer' } }, required: ['price','quantity'] } } } }, responses: { '200': { description: 'OK' } } }, delete: { summary: 'Удалить позицию заказа', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Deleted' } } } }
	}
};
