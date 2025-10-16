import express from 'express';
import cors from 'cors';
import booksRouter from './routes/books.js';
import usersRouter from './routes/users.js';
import ordersRouter from './routes/orders.js';
import reviewsRouter from './routes/reviews.js';
import deliveryTypesRouter from './routes/deliverytypes.js';
import statusesRouter from './routes/statuses.js';
import rolesRouter from './routes/roles.js';
import accountsRouter from './routes/accounts.js';
import addressesRouter from './routes/addresses.js';
import authorsRouter from './routes/authors.js';
import categoriesRouter from './routes/categories.js';
import publishersRouter from './routes/publishers.js';
import authRoutes from './routes/auth.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// пути
app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/deliverytypes', deliveryTypesRouter);
app.use('/api/statuses', statusesRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/publishers', publishersRouter);
app.use('/api/auth', authRoutes);

// запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API запущен на http://localhost:${PORT}`));
