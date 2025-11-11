import client from 'prom-client';
import pool from './db.js';

const register = new client.Registry();
register.setDefaultLabels({app: 'bookstore-backend'});
client.collectDefaultMetrics({register, prefix: 'bookstore_'});

const httpRequestDuration = new client.Histogram({
  name: 'bookstore_http_request_duration_seconds',
  help: 'Длительность HTTP запросов (сек.)',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register]
});

const httpRequestCount = new client.Counter({
  name: 'bookstore_http_requests_total',
  help: 'Общее количество HTTP запросов',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestSize = new client.Histogram({
  name: 'bookstore_http_request_size_bytes',
  help: 'Размер HTTP запросов и ответов в байтах',
  labelNames: ['method', 'route', 'type'],
  buckets: [100, 500, 1000, 5000, 10000, 50000, 100000],
  registers: [register]
});


const productsByCategoryGauge = new client.Gauge({
    name: 'bookstore_products_by_category_total',
    help: 'Общее количество книг по категориям',
    labelNames: ['category_id', 'category_name'],
    registers: [register]
});

const booksByAuthorGauge = new client.Gauge({
    name: 'bookstore_products_by_author_total',
    help: 'Общее количество книг по авторам',
    labelNames: ['author_id', 'author_name'],
    registers: [register]
});

const totalAccountsGauge = new client.Gauge({
    name: 'bookstore_total_users',
    help: 'Общее количество аккаунтов',
    registers: [register]
});

async function updateCustomMetrics() {
    try {
        const productsByCategoryResult = await pool.query(`
            SELECT 
                c.id_category as category_id,
                c.name as category_name,
                COUNT(b.id_book) as products_count
            FROM categories c
            LEFT JOIN books b ON b.category_id = c.id_category
            GROUP BY c.id_category, c.name
            ORDER BY c.name
        `);
        
        productsByCategoryGauge.reset();
        productsByCategoryResult.rows.forEach(row => {
            productsByCategoryGauge.set(
                {
                    category_id: row.category_id.toString(),
                    category_name: row.category_name
                },
                parseInt(row.products_count)
            );
        });

        const booksByAuthorResult = await pool.query(`
            SELECT 
                a.ID_Author as author_id,
                CONCAT(a.Lastname, ' ', a.Firstname) as author_name,
                COUNT(b.id_book) as books_count
            FROM Authors a
            LEFT JOIN books b ON b.author_id = a.ID_Author 
            GROUP BY a.ID_Author, a.Lastname, a.Firstname
            ORDER BY a.Lastname, a.Firstname
        `);

        booksByAuthorGauge.reset();
        booksByAuthorResult.rows.forEach(row => {
            booksByAuthorGauge.set(
                {
                    author_id: row.author_id.toString(),
                    author_name: row.author_name
                },
                parseInt(row.books_count)
            );
        });

        const totalAccountsResult = await pool.query(`
            SELECT COUNT(*) as total_count
            FROM accounts
        `);
        
        totalAccountsGauge.set(parseInt(totalAccountsResult.rows[0].total_count));

        console.log('Все метрики успешно обновлены.');
    } catch (error) {
        console.error("Ошибка обновления метрик:", error);
    }
}

function metricsMiddleware(req, res, next)
{
    const start = Date.now();
    
    let requestSize = 0;
    if (req.headers['content-length']) {
        requestSize = parseInt(req.headers['content-length']);
    }

    res.on('finish', () => {
        try {
            const duration = (Date.now() - start) / 1000;
            const route = req.route ? req.route.path : req.path;

            httpRequestDuration
                .labels(req.method, route, res.statusCode)
                .observe(duration);


            httpRequestCount
                .labels(req.method, route, res.statusCode)
                .inc();

            if (requestSize > 0) {
                httpRequestSize
                    .labels(req.method, route, 'request')
                    .observe(requestSize);
            }

            const responseSize = res.get('content-length');
            if (responseSize) {
                httpRequestSize
                    .labels(req.method, route, 'response')
                    .observe(parseInt(responseSize));
            }

        } catch (error) {
            console.error('Ошибка записи HTTP метрик:', error);
        }
    });

    next();
}

export {
    register,
    updateCustomMetrics,
    metricsMiddleware,
    httpRequestCount,
    httpRequestDuration,
    httpRequestSize,
    productsByCategoryGauge,
    booksByAuthorGauge,      
    totalAccountsGauge
};