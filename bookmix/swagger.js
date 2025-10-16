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
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'Введите токен в формате: Bearer <token>'
				}
			},
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
			Role: { 
				type: 'object', 
				properties: { 
					id_role: { type: 'integer' }, 
					rolename: { type: 'string' } 
				} 
			},
			Status: { 
				type: 'object', 
				properties: { 
					id_status: { type: 'integer' }, 
					status: { type: 'string' } 
				} 
			},
			DeliveryType: { 
				type: 'object', 
				properties: { 
					id_deliverytype: { type: 'integer' }, 
					typename: { type: 'string' } 
				} 
			},
			Address: {
				type: 'object',
				properties: {
					id_address: { type: 'integer' }, 
					country: { type: 'string' }, 
					city: { type: 'string' }, 
					street: { type: 'string' }, 
					house: { type: 'integer' }, 
					apartment: { type: 'integer' }, 
					indexmail: { type: 'string' }
				}
			},
			Author: {
				type: 'object',
				properties: {
					id_author: { type: 'integer' }, 
					lastname: { type: 'string' }, 
					firstname: { type: 'string' }, 
					patronymic: { type: 'string' }, 
					birthdate: { type: 'string', format: 'date' }, 
					deathdate: { type: 'string', format: 'date' }
				}
			},
			Category: { 
				type: 'object', 
				properties: { 
					id_category: { type: 'integer' }, 
					name: { type: 'string' } 
				} 
			},
			Publisher: {
				type: 'object',
				properties: { 
					id_publisher: { type: 'integer' }, 
					legalname: { type: 'string' }, 
					contactnum: { type: 'string' }, 
					email: { type: 'string' }, 
					address_id: { type: 'integer' } 
				}
			},
			Order: { 
				type: 'object', 
				properties: { 
					id_order: { type: 'integer' } 
				} 
			},
			Review: { 
				type: 'object', 
				properties: { 
					id_review: { type: 'integer' }, 
					rating: { type: 'integer' }, 
					usercomment: { type: 'string' }, 
					reviewdate: { type: 'string', format: 'date-time' } 
				} 
			},
			RegisterRequest: {
				type: 'object',
				properties: {
					lastname: { type: 'string' },
					firstname: { type: 'string' },
					patronymic: { type: 'string' },
					email: { type: 'string' },
					role_id: {type: 'integer'},
					login: { type: 'string' },
					password: { type: 'string'},
				},
				required: ['lastname', 'firstname', 'email', 'login', 'password']
			},
			LoginRequest: {
				type: 'object',
				properties: {
					login: { type: 'string' },
					password: { type: 'string' }
				},
				required: ['login', 'password']
			},
			LoginResponse: {
				type: 'object',
				properties: {
					token: { type: 'string' },
					user: {
						type: 'object',
						properties: {
							id: { type: 'integer' },
							firstname: { type: 'string' },
							lastname: { type: 'string' },
							role: { type: 'string' }
						}
					}
				}
			}
		}
	},

	security: [
		{ bearerAuth: [] }
	],

	paths: {
		'/api/auth/register': {
			post: {
				summary: 'Регистрация нового пользователя',
				tags: ['Авторизация'],
				security: [], // не требует токена
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/RegisterRequest' }
						}
					}
				},
				responses: {
					201: {
						description: 'Пользователь успешно создан'
					},
					400: {
						description: 'Ошибка при регистрации (например, логин занят)'
					}
				}
			}
		},
		'/api/auth/login': {
			post: { summary: 'Авторизация пользователя',
				tags: ['Авторизация'],
				security: [], 
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/LoginRequest' }
						}
					}
				},
				responses: {
					200: {
						description: 'Успешный вход, возвращает JWT токен',
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LoginResponse' }
							}
						}
					},
					401: {
						description: 'Неверный логин или пароль'
					}
				}
			}
		},
		'/api/auth/reset': {
		patch: {
			summary: 'Сброс пароля по логину',
			tags: ['Авторизация'],
			security: [], // доступен без токена
			requestBody: {
			required: true,
			content: {
				'application/json': {
				schema: {
					type: 'object',
					properties: {
					login: { type: 'string', example: 'user123' },
					password: { type: 'string', example: 'newStrongPassword123' }
					},
					required: ['login', 'password']
				}
				}
			}
			},
			responses: {
			200: {
				description: 'Пароль успешно сброшен',
				content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							message: { type: 'string', example: 'Пароль успешно сброшен' },
							account: {
								type: 'object',
								properties: {
									id_account: { type: 'integer' },
									login: { type: 'string'},
									role_id: { type: 'integer'}
								}
							}
						}
					}
				}
				}
			},
			400: {
				description: 'Не указан логин или пароль'
			},
			404: {
				description: 'Аккаунт не найден'
			},
			500: {
				description: 'Ошибка сервера'
			}
			}
		}
		},

		'/api/books': {
			get: {
				summary: 'Получить все книги',
				tags: ['Книги'],
				responses: { 
					200: { 
						description: 'OK', 
						content: { 'application/json': { 
							schema: { 
									type: 'array', 
									items: { $ref: '#/components/schemas/Book' } 
								} 
							} 
						} 
					} 
				}
			},
			post: {
				summary: 'Добавить книгу',
				tags: ['Книги'],
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Book' } } } },
				responses: { 
					201: { 
						description: 'Created' 
					} 
				}
			}
		},
		'/api/books/{id}': {
			get: { 
				summary: 'Получить книгу', 
				tags: ['Книги'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { 
						type: 'integer' } }], 
						responses: { 
							200: { 
								description: 'OK' 
							}, 
							404: { 
								description: 'Not Found' 
							} 
						} 
					},
			put: { 
				summary: 'Обновить книгу', 
				tags: ['Книги'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { 
							type: 'object', 
							properties: { 
								title: { type: 'string' }, 
								description: { type: 'string' }, 
								price: { type: 'number' }, 
								quantity: { type: 'integer' } 
							} 
						} 
					} } 
				}, 
				responses: { 
					200: { 
						description: 'OK' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
				},
			delete: { 
				summary: 'Удалить книгу', 
				tags: ['Книги'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'Deleted' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
			}
		},
		'/api/users': {
			get: { 
				summary: 'Получить всех пользователей', 
				tags: ['Пользователи'],
				responses: { 
				200: { 
					description: 'Список всех пользователей успешно получен' 
				},
				500: { 
					description: 'Ошибка сервера' 
				}
				}
			},
			},
			'/api/users/{id}': {
			get: {
				summary: 'Получить пользователя по ID',
				tags: ['Пользователи'],
				parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'integer' },
					description: 'ID пользователя',
				},
				],
				responses: {
				200: { description: 'Пользователь найден' },
				404: { description: 'Пользователь не найден' },
				500: { description: 'Ошибка сервера' },
				},
			},
			put: {
				summary: 'Обновить данные пользователя (полная замена)',
				tags: ['Пользователи'],
				parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'integer' },
					description: 'ID пользователя для обновления',
				},
				],
				requestBody: {
				required: true,
				content: {
					'application/json': {
					schema: {
						type: 'object',
						properties: {
						lastname: { type: 'string' },
						firstname: { type: 'string' },
						patronymic: { type: 'string' },
						email: { type: 'string' },
						},
						required: ['lastname', 'firstname', 'email'],
					},
					},
				},
				},
				responses: {
					200: { description: 'Пользователь успешно обновлён' },
					400: { description: 'Некорректные данные' },
					404: { description: 'Пользователь не найден'}
				},
			},
			delete: {
				summary: 'Удалить пользователя по ID',
				tags: ['Пользователи'],
				parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'integer' },
					description: 'ID пользователя для удаления',
				},
				],
				responses: {
					200: { description: 'Пользователь успешно удалён' },
					404: { description: 'Пользователь не найден' }
				},
			},
			},
		'/api/orders': {
			get: {
				summary: 'Все заказы',
				tags: ['Заказы'],
				responses: {
				200: {
					description: 'OK'
				},
				500: {
					description: 'Ошибка сервера'
				}
				}
			},
			post: {
				summary: 'Создать заказ',
				tags: ['Заказы'],
				requestBody: {
				required: true,
				content: {
					'application/json': {
					schema: {
						type: 'object',
						properties: {
						user_id: { type: 'integer' },
						status_id: { type: 'integer' },
						deliverytype_id: { type: 'integer' },
						address_id: { type: 'integer' },
						items: {
							type: 'array',
							items: {
							type: 'object',
							properties: {
								book_id: { type: 'integer' },
								quantity: { type: 'integer' },
								price: { type: 'number' }
							},
							required: ['book_id', 'quantity', 'price']
							}
						}
						},
						required: ['user_id', 'status_id', 'items']
					}
					}
				}
				},
				responses: {
				201: {
					description: 'Заказ успешно создан'
				},
				400: {
					description: 'Некорректные данные'
				},
				500: {
					description: 'Ошибка сервера'
				}
				}
			}
			},

			'/api/orders/{id}': {
			get: {
				summary: 'Получить заказ по ID с деталями',
				tags: ['Заказы'],
				parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'integer' },
					description: 'ID заказа'
				}
				],
				responses: {
				200: {
					description: 'OK'
				},
				404: {
					description: 'Заказ не найден'
				},
				500: {
					description: 'Ошибка сервера'
				}
				}
			},
			delete: {
				summary: 'Удалить заказ по ID',
				tags: ['Заказы'],
				parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'integer' },
					description: 'ID заказа'
				}
				],
				responses: {
				200: {
					description: 'Заказ успешно удалён'
				},
				404: {
					description: 'Заказ не найден'
				},
				500: {
					description: 'Ошибка сервера'
				}
				}
			}
			},

			'/api/orders/{id}/status': {
			put: {
				summary: 'Обновить статус заказа',
				tags: ['Заказы'],
				parameters: [
				{
					name: 'id',
					in: 'path',
					required: true,
					schema: { type: 'integer' },
					description: 'ID заказа'
				}
				],
				requestBody: {
				required: true,
				content: {
					'application/json': {
					schema: {
						type: 'object',
						properties: {
						status_id: { type: 'integer' }
						},
						required: ['status_id']
					}
					}
				}
				},
				responses: {
				200: {
					description: 'Статус успешно обновлён'
				},
				404: {
					description: 'Заказ не найден'
				},
				400: {
					description: 'Некорректные данные'
				},
				500: {
					description: 'Ошибка сервера'
				}
				}
			}
			},

		'/api/reviews/book/{bookId}': { 
			get: { 
				summary: 'Отзывы по книге', 
				tags: ['Отзывы'],
				parameters: [{ 
					name: 'bookId', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			} 
		},
		'/api/reviews': { 
			post: { 
				summary: 'Добавить отзыв', 
				tags: ['Отзывы'],
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Review' } } } }, 
				responses: { 
					201: { 
						description: 'Created' 
					} 
				} 
			} 
		},
		'/api/reviews/{id}': { 
			delete: { 
				summary: 'Удалить отзыв', 
				tags: ['Отзывы'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'Deleted' 
					} 
				} 
			} 
		},
		'/api/deliverytypes': {
			get: { 
				summary: 'Все типы доставки',
				tags: ['Доставка'], 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			},
			post: { 
				summary: 'Создать тип доставки',
				tags: ['Доставка'], 
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/DeliveryType' } } } }, 
				responses: { 
					201: { 
						description: 'Created' 
					} 
				} 
			}
		},
		'/api/deliverytypes/{id}': {
			get: { 
				summary: 'Тип доставки по id',
				tags: ['Доставка'], 
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					schema: { type: 'integer' }, 
					required: true }],
				responses: { 
					200: { 
						description: 'OK' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
			},
			put: { 
				summary: 'Обновить тип доставки', 
				tags: ['Доставка'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					schema: { type: 'integer' }, 
					required: true }], 
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/DeliveryType' } } } }, 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			},
			delete: { 
				summary: 'Удалить тип доставки', 
				tags: ['Доставка'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					schema: { type: 'integer' }, 
					required: true }], 
					responses: { 
						200: { 
							description: 'Deleted' 
						} 
					} 
				}
		},
		'/api/statuses': { 
			get: { 
				summary: 'Все статусы', 
				tags: ['Статусы'],
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			post: { 
				summary: 'Создать статус', 
				tags: ['Статусы'],
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Status' } } } }, 
				responses: { 
					201: { 
						description: 'Created' 
					} 
				} 
			} 
		},
		'/api/statuses/{id}': { 
			get: { 
				summary: 'Статус по id', 
				tags: ['Статусы'],
				parameters: [{ name: 'id', in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'OK' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
			}, 
			put: { 
				summary: 'Обновить статус', 
				tags: ['Статусы'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Status' } } } }, 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			delete: { 
				summary: 'Удалить статус', 
				tags: ['Статусы'],
				parameters: [{
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					'200': { 
						description: 'Deleted' 
					} 
				} 
			} 
		},
		'/api/roles': { 
			get: { 
				summary: 'Все роли',
				tags: ['Роли'], 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			post: { 
				summary: 'Создать роль',
				tags: ['Роли'], 
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Role' } } } }, 
				responses: { 
					201: { 
						description: 'Created' 
					} 
				} 
			} 
		},
		'/api/roles/{id}': { 
			get: { 
				summary: 'Роль по id', 
				tags: ['Роли'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'OK' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
			}, 
			put: { 
				summary: 'Обновить роль', 
				tags: ['Роли'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Role' } } } }, 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			delete: { 
				summary: 'Удалить роль', 
				tags: ['Роли'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'Deleted' 
					} 
				} 
			} 
		},
		'/api/accounts': { 
			get: { 
				summary: 'Все аккаунты',
				tags: ['Аккаунты'], 
				responses: { 
				200: { 
					description: 'OK' 
				} 
				} 
			}, 
			},
		'/api/accounts/{id}': { 
			get: { 
				summary: 'Аккаунт по id', 
				tags: ['Аккаунты'],
				parameters: [{ 
				name: 'id', 
				in: 'path', 
				required: true, 
				schema: { type: 'integer' } 
				}], 
				responses: { 
				200: { 
					description: 'OK' 
				}, 
				404: { 
					description: 'Not Found' 
				} 
				} 
			}, 
			patch: {
				summary: 'Обновить аккаунт',
				tags: ['Аккаунты'],
				parameters: [{
				name: 'id',
				in: 'path',
				required: true,
				schema: { type: 'integer' }
				}],
				requestBody: {
				required: true,
				content: {
					'application/json': {
					schema: {
						type: 'object',
						properties: {
						login: { type: 'string', example: 'new_user' },
						password: { type: 'string', example: 'new_password123' },
						role_id: { type: 'integer', example: 2 }
						},
						required: ['login', 'password', 'role_id']
					}
					}
				}
				},
				responses: {
				200: {
					description: 'Аккаунт обновлён'
				},
				404: {
					description: 'Аккаунт не найден'
				}
				}
			},
			delete: { 
				summary: 'Удалить аккаунт', 
				tags: ['Аккаунты'],
				parameters: [{ 
				name: 'id', 
				in: 'path', 
				required: true, 
				schema: { type: 'integer' } 
				}], 
				responses: { 
				200: { 
					description: 'Deleted' 
				} 
				} 
			} 
		},

		'/api/addresses': { 
			get: { 
				summary: 'Все адреса', 
				tags: ['Адреса'],
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			post: { 
				summary: 'Создать адрес', 
				tags: ['Адреса'],
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Address' } } } }, 
				responses: { 
					201: { 
						description: 'Created' 
					} 
				} 
			} 
		},
		'/api/addresses/{id}': { 
			get: { 
				summary: 'Адрес по id', 
				tags: ['Адреса'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'OK' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
			}, 
			put: { 
				summary: 'Обновить адрес', 
				tags: ['Адреса'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
					requestBody: { 
						required: true, 
						content: { 'application/json': { 
							schema: { $ref: '#/components/schemas/Address' } } } }, 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			delete: { 
				summary: 'Удалить адрес',
				tags: ['Адреса'], 
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'Deleted' 
					} 
				} 
			} 
		},
		'/api/authors': { 
			get: { 
				summary: 'Все авторы', 
				tags: ['Авторы'],
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			post: { 
				summary: 'Создать автора', 
				tags: ['Авторы'],
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Author' } } } }, 
				responses: { 
					201: { 
						description: 'Created' 
					} 
				} 
			} 
		},
		'/api/authors/{id}': { 
			get: { 
				summary: 'Автор по id', 
				tags: ['Авторы'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'OK' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
			}, 
			put: { 
				summary: 'Обновить автора', 
				tags: ['Авторы'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
					requestBody: { 
						required: true, 
						content: { 'application/json': { 
							schema: { $ref: '#/components/schemas/Author' } } } }, 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			delete: { 
				summary: 'Удалить автора', 
				tags: ['Авторы'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'Deleted' 
					} 
				} 
			} 
		},
		'/api/categories': { 
			get: { 
				summary: 'Все категории', 
				tags: ['Категории'],
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			post: { 
				summary: 'Создать категорию', 
				tags: ['Категории'],
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Category' } } } }, 
				responses: { 
					'201': { 
						description: 'Created' 
					} 
				} 
			} 
		},
		'/api/categories/{id}': { 
			get: { 
				summary: 'Категория по id', 
				tags: ['Категории'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'OK' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
			}, 
			put: { 
				summary: 'Обновить категорию',
				tags: ['Категории'], 
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
					requestBody: { 
						required: true, 
						content: { 'application/json': { 
							schema: { $ref: '#/components/schemas/Category' } } } }, 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			delete: { 
				summary: 'Удалить категорию', 
				tags: ['Категории'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'Deleted' 
					} 
				} 
			} 
		},
		'/api/publishers': { 
			get: { 
				summary: 'Все издатели', 
				tags: ['Издатели'],
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			post: { 
				summary: 'Создать издателя', 
				tags: ['Издатели'],
				requestBody: { 
					required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Publisher' } } } }, 
				responses: { 
					201: { 
						description: 'Created' 
					} 
				} 
			} 
		},
		'/api/publishers/{id}': { 
			get: { 
				summary: 'Издатель по id', 
				tags: ['Издатели'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'OK' 
					}, 
					404: { 
						description: 'Not Found' 
					} 
				} 
			}, 
			put: { 
				summary: 'Обновить издателя', 
				tags: ['Издатели'],
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				requestBody: { required: true, 
					content: { 'application/json': { 
						schema: { $ref: '#/components/schemas/Publisher' } } } }, 
				responses: { 
					200: { 
						description: 'OK' 
					} 
				} 
			}, 
			delete: { 
				summary: 'Удалить издателя',
				tags: ['Издатели'], 
				parameters: [{ 
					name: 'id', 
					in: 'path', 
					required: true, 
					schema: { type: 'integer' } }], 
				responses: { 
					200: { 
						description: 'Deleted' 
					} 
				} 
			} 
		}
	}
};
