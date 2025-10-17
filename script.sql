CREATE DATABASE BookMixDB;

-- ТАБЛИЦЫ
-- Типы доставки
CREATE TABLE DeliveryTypes (
    ID_DeliveryType SERIAL PRIMARY KEY,
    TypeName VARCHAR(40) UNIQUE NOT NULL
);

-- Статусы заказа
CREATE TABLE Statuses (
    ID_Status SERIAL PRIMARY KEY,
    Status VARCHAR(40) UNIQUE NOT NULL
);

-- Роли
CREATE TABLE Roles (
    ID_Role SERIAL PRIMARY KEY,
    Rolename VARCHAR(40) UNIQUE NOT NULL
);

-- Аккаунты
CREATE TABLE Accounts (
	ID_Account SERIAL PRIMARY KEY,
	Login VARCHAR(30) UNIQUE NOT NULL,
	HashPassword VARCHAR(255) UNIQUE NOT NULL,
	Role_ID INT REFERENCES Roles(ID_Role) NOT NULL
);

-- Пользователи
CREATE TABLE Users (
    ID_User SERIAL PRIMARY KEY,
    Lastname VARCHAR(80) NOT NULL,
    Firstname VARCHAR(80) NOT NULL,
    Patronymic VARCHAR(80),
    Email VARCHAR(80) UNIQUE NOT NULL,
    Account_ID INT UNIQUE REFERENCES Accounts(ID_Account)
);

-- Адреса
CREATE TABLE Addresses (
    ID_Address SERIAL PRIMARY KEY,
    Country VARCHAR(100) NOT NULL,
    City VARCHAR(100) NOT NULL,
    Street VARCHAR(100) NOT NULL,
    House INT NOT NULL,
    Apartment INT,
    Indexmail VARCHAR(8) NOT NULL
);

-- Авторы
CREATE TABLE Authors (
    ID_Author SERIAL PRIMARY KEY,
    Lastname VARCHAR(80) NOT NULL,
    Firstname VARCHAR(80) NOT NULL,
    Patronymic VARCHAR(80),
    BirthDate DATE,
    DeathDate DATE
);

-- Категории
CREATE TABLE Categories (
    ID_Category SERIAL PRIMARY KEY,
    Name VARCHAR(50) UNIQUE NOT NULL 
);

-- Издатели
CREATE TABLE Publishers (
    ID_Publisher SERIAL PRIMARY KEY,
    LegalName VARCHAR(1000) UNIQUE NOT NULL,
    ContactNum VARCHAR(11) UNIQUE NOT NULL,
    Email VARCHAR(80) UNIQUE NOT NULL,
	Address_ID INT UNIQUE REFERENCES Addresses(ID_Address)
);

-- Книги
CREATE TABLE Books (
    ID_Book SERIAL PRIMARY KEY,
    Title VARCHAR(150) NOT NULL,
    Description TEXT,
    PublishDate DATE,
    Author_ID INT NOT NULL REFERENCES Authors(ID_Author),
    Publisher_ID INT REFERENCES Publishers(ID_Publisher),
    Category_ID INT REFERENCES Categories(ID_Category),
    Price DECIMAL(10,2) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    ImageURL TEXT
);

-- Заказы
CREATE TABLE Orders (
    ID_Order SERIAL PRIMARY KEY,
    OrderDate TIMESTAMP NOT NULL,
    User_ID INT NOT NULL REFERENCES Users(ID_User),
    Status_ID INT NOT NULL REFERENCES Statuses(ID_Status),
    DeliveryType_ID INT REFERENCES DeliveryTypes(ID_DeliveryType),
    Address_ID INT REFERENCES Addresses(ID_Address)
);

-- Детали заказа
CREATE TABLE OrderDetails (
    ID_OrderDetail SERIAL PRIMARY KEY,
    Order_ID INT NOT NULL REFERENCES Orders(ID_Order),
    Price DECIMAL(10, 2) NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Book_ID INT NOT NULL REFERENCES Books(ID_Book) 
);

-- Отзывы
CREATE TABLE Reviews (
    ID_Review SERIAL PRIMARY KEY,
    User_ID INT NOT NULL REFERENCES Users(ID_User),
    Book_ID INT NOT NULL REFERENCES Books(ID_Book),
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    UserComment TEXT,
    ReviewDate TIMESTAMP NOT NULL
);

--ЗАПОЛНЕНИЕ ТЕСТОВЫМИ ДАННЫМИ (некоторые из них будут удалены)
-- Роли
INSERT INTO Roles (Rolename) VALUES
('Администратор'),
('Покупатель');

-- Адреса
INSERT INTO Addresses (Country, City, Street, House, Apartment, Indexmail) VALUES
('Россия', 'Москва', 'Тверская', 10, 15, '101000'),
('Россия', 'Санкт-Петербург', 'Невский проспект', 25, NULL, '190000');

-- Типы доставки
INSERT INTO DeliveryTypes (TypeName) VALUES
('Курьер'),
('Самовывоз');

-- Статусы заказов
INSERT INTO Statuses (Status) VALUES
('Новый'),
('Оплачен'),
('Доставлен'),
('Отменён');

-- Авторы
INSERT INTO Authors (Lastname, Firstname, Patronymic, BirthDate, DeathDate) VALUES
('Дашкевич', 'Виктор', null, '1978-07-17', null)
('Волков', 'Александр', 'Мелентьевич', '1891-06-14', '1977-07-03')
('Пушкин', 'Александр', 'Сергеевич', '1799-06-06', '1837-01-29'),
('Толстой', 'Лев', 'Николаевич', '1828-09-09', '1910-11-20'),
('Достоевский', 'Фёдор', 'Михайлович', '1821-11-11', '1881-02-09');

-- Категории
INSERT INTO Categories (Name) VALUES
('Повесть')
('Роман'),
('Поэзия'),
('Фантастика');

-- Издатели
INSERT INTO Publishers (LegalName, ContactNum, Email, Address_ID) VALUES
('Издательство АСТ', '84951234567', 'contact@ast.ru', 1),
('Эксмо', '84959876543', 'info@eksmo.ru', 2);

-- Книги
INSERT INTO Books (Title, Description, PublishDate, Author_ID, Publisher_ID, Category_ID, Price, Quantity, ImageURL) VALUES
('Дела Тайной канцелярии', 'Молодой колдун Афанасий Репин, служащий Тайной канцелярии, получает в услужение необычного помощника — дива Владимира, бывшего фамильяра знатного рода. Тайные преступления, магические заговоры и интриги высшего света, которые могут повлиять на судьбу империи, — всё это предстоит раскрыть колдуну и его диву. Именно Афанасий сумел увидеть во Владимире то, чего не замечали остальные: достоинство, порядочность, ум и преданность.', '2025-08-15', 5, 2, 3, 729.00, 20, 'https://cdn.eksmo.ru/v2/ITD000000001334346/COVER/cover1__w820.webp'),
('Преступление и наказание', 'Роман', '1866-01-01', 3, 1, 1, 800.00, 15, 'https://cdn.ast.ru/v2/ASE000000000703427/COVER/cover1__w410.jpg'),
('Волшебник изумрудного города', 'Сказочная повесть «Волшебник Изумрудного города» является переработкой сказки американского писателя Ф. Баума. Она рассказывает об удивительных приключениях девочки Элли и ее друзей в Волшебной стране.', null, 4, 1, 4, 1499.00, 5, 'https://cdn.ast.ru/v2/AST000000000153536/COVER/cover1__w410.jpg')
('Евгений Онегин', 'Роман в стихах', '1833-01-01', 1, 1, 2, 350.00, 10, 'img/onegin.jpg'),
('Война и мир', 'Эпопея', '1869-01-01', 2, 2, 1, 1200.00, 5, 'img/warpeace.jpg');

UPDATE Books
SET Description = 'Шедевр мировой литературы — социально-психологический роман «Преступление и наказание» — Федор Достоевский создал в непростое для себя время. Годом ранее он потерял старшего брата и любимую жену. Затем последовали смерть друга — писателя Аполлона Григорьева, закрытие авторского журнала «Эпоха», практически полное разорение, каторжный договор на написание «Игрока», угроза тюремного срока... Достоевского спасла некогда услышанная история французского поэта-убийцы Пьера Франсуа Ласнера, которая и легла в основу сюжета культового философского произведения.'
WHERE ID_Book = 5;

UPDATE Books
SET ImageURL = 'https://cdn.eksmo.ru/v2/ITD000000000166531/COVER/cover1__w820.webp', Description = '"Война и мир" – роман-эпопея Льва Николаевича Толстого, по глубине и охвату событий до сих пор стоящий на первом месте во всей мировой литературе, - вершина творчества великого мыслителя, как никакое другое произведение писателя отражает глубину его мироощущения и философии'
WHERE ID_Book = 2;

UPDATE Books
SET ImageURL = 'https://cdn.ast.ru/v2/ASE000000000830384/COVER/cover1__w410.jpg', Description = '«Евгений Онегин» — первый роман в стихах, написанный на русском языке. Он стал важной вехой в истории отечественной литературы. «Энциклопедия русской жизни» — так охарактеризовал это произведение критик Виссарион Белинский. В «Евгении Онегине» Александр Пушкин представил читателям галерею ярких героев, характеры которых прочно укоренились в русской литературе. Этот роман повлиял на творчество таких выдающихся отечественных авторов, как Михаил Лермонтов, Николай Чернышевский, Борис Пастернак и Владимир Набоков.'
WHERE ID_Book = 1;

-- ПРЕДСТАВЛЕНИЯ
-- Просмотр заказов с информацией о пользователях и статусах
CREATE OR REPLACE VIEW OrdersView AS
SELECT 
    o.ID_Order AS "Код заказа",
    o.OrderDate AS "Дата заказа",
    u.Lastname || ' ' || u.Firstname AS "Покупатель",
    s.Status AS "Статус",
    d.TypeName AS "Тип доставки",
    a.City || ', ' || a.Street || ' ' || a.House || 
        COALESCE(', кв. ' || a.Apartment, '') AS "Адрес доставки"
FROM Orders o
JOIN Users u ON o.User_ID = u.ID_User
JOIN Statuses s ON o.Status_ID = s.ID_Status
LEFT JOIN DeliveryTypes d ON o.DeliveryType_ID = d.ID_DeliveryType
LEFT JOIN Addresses a ON o.Address_ID = a.ID_Address;

-- Информация о книгах с авторами, категориями и издателями
CREATE OR REPLACE VIEW BooksView AS
SELECT 
    b.ID_Book AS "Код книги",
    b.Title AS "Название",
    a.Firstname || ' ' || a.Lastname AS "Автор",
    c.Name AS "Категория",
    p.LegalName AS "Издатель",
    b.Price AS "Цена",
    b.Quantity AS "Количество"
FROM Books b
JOIN Authors a ON b.Author_ID = a.ID_Author
LEFT JOIN Categories c ON b.Category_ID = c.ID_Category
LEFT JOIN Publishers p ON b.Publisher_ID = p.ID_Publisher;

-- Топ книг по количеству отзывов и средней оценке
CREATE OR REPLACE VIEW TopBooksView AS
SELECT 
    b.Title AS "Название книги",
    COUNT(r.ID_Review) AS "Кол-во отзывов",
    ROUND(AVG(r.Rating), 2) AS "Средняя оценка"
FROM Books b
LEFT JOIN Reviews r ON b.ID_Book = r.Book_ID
GROUP BY b.Title
ORDER BY "Средняя оценка" DESC, "Кол-во отзывов" DESC;

-- Подробности заказа
CREATE OR REPLACE VIEW OrderDetailsView AS
SELECT 
    od.ID_OrderDetail AS "Код детали",
    o.ID_Order AS "Код заказа",
    b.Title AS "Книга",
    od.Quantity AS "Кол-во",
    od.Price AS "Цена за единицу",
    (od.Quantity * od.Price) AS "Сумма"
FROM OrderDetails od
JOIN Orders o ON od.Order_ID = o.ID_Order
JOIN Books b ON od.Book_ID = b.ID_Book;

-- Пользователи и их аккаунты (для админа)
CREATE OR REPLACE VIEW UsersAccountsView AS
SELECT 
    u.ID_User AS "Код пользователя",
    u.Lastname AS "Фамилия",
    u.Firstname AS "Имя",
    u.Email AS "Эл. почта",
    a.Login AS "Логин",
    r.Rolename AS "Роль"
FROM Users u
JOIN Accounts a ON u.Account_ID = a.ID_Account
JOIN Roles r ON a.Role_ID = r.ID_Role;

--ПРОВЕРКА ПРЕДСТАВЛЕНИЙ
SELECT *FROM OrdersView
SELECT *FROM BooksView
SELECT *FROM TopBooksView
SELECT *FROM OrderDetailsView
SELECT *FROM UsersAccountsView

--ФУНКЦИИ
--топ книг за определенный период
CREATE OR REPLACE FUNCTION get_top_books_period(p_days INT, p_limit INT)
RETURNS TABLE (
    book_id INT,
    title VARCHAR,
    total_sold BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT b.id_book,
           b.title,
           SUM(od.quantity) AS total_sold
    FROM orderdetails od
    JOIN orders o ON od.order_id = o.id_order
    JOIN books b ON od.book_id = b.id_book
    WHERE o.orderdate >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY b.id_book, b.title
    ORDER BY total_sold DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

--средний чек пользователя за период
CREATE OR REPLACE FUNCTION get_user_avg_check_period(p_user_id INT, p_days INT)
RETURNS NUMERIC AS $$
DECLARE
    avg_check NUMERIC;
BEGIN
    SELECT AVG(sum_order) INTO avg_check
    FROM (
        SELECT SUM(od.price * od.quantity) AS sum_order
        FROM orders o
        JOIN orderdetails od ON o.id_order = od.order_id
        WHERE o.user_id = p_user_id
          AND o.orderdate >= NOW() - (p_days || ' days')::INTERVAL
        GROUP BY o.id_order
    ) sub;

    RETURN COALESCE(avg_check, 0);
END;
$$ LANGUAGE plpgsql;

--доход за период
CREATE OR REPLACE FUNCTION get_income_period(p_days INT)
RETURNS NUMERIC AS $$
DECLARE
    total_income NUMERIC;
BEGIN
    SELECT SUM(od.price * od.quantity) INTO total_income
    FROM orders o
    JOIN orderdetails od ON o.id_order = od.order_id
    WHERE o.orderdate >= NOW() - (p_days || ' days')::INTERVAL;

    RETURN COALESCE(total_income, 0);
END;
$$ LANGUAGE plpgsql;

--топ пользователей по сумме покупок за период
CREATE OR REPLACE FUNCTION get_top_users_period(p_days INT, p_limit INT)
RETURNS TABLE (
    user_id INT,
    fullname VARCHAR,
    total_spent NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id_user,
           (u.lastname || ' ' || u.firstname)::VARCHAR,
           SUM(od.price * od.quantity) AS total_spent
    FROM users u
    JOIN orders o ON u.id_user = o.user_id
    JOIN orderdetails od ON o.id_order = od.order_id
    WHERE o.orderdate >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY u.id_user, u.lastname, u.firstname
    ORDER BY total_spent DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;


--ПРОВЕРКА ФУНКЦИЙ
SELECT * FROM get_top_books_period(30, 5);  -- топ-5 книг за 30 дней
SELECT get_user_avg_check_period(2, 90);  -- средний чек пользователя с id 2 за 30 дней
SELECT get_income_period(30);  -- доход за последние 30 дней
SELECT * FROM get_top_users_period(30, 3);  -- топ-3 покупателей за месяц

--ТРИГГЕРЫ
--автоматическое уменьшение количества книг
CREATE OR REPLACE FUNCTION reduce_book_quantity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE books
    SET quantity = quantity - NEW.quantity
    WHERE id_book = NEW.book_id;

    IF (SELECT quantity FROM books WHERE id_book = NEW.book_id) < 0 THEN
        RAISE EXCEPTION 'Недостаточно книг на складе (book_id = %)', NEW.book_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reduce_book_quantity
AFTER INSERT ON orderdetails
FOR EACH ROW
EXECUTE FUNCTION reduce_book_quantity();

--проверка номера телефона
CREATE OR REPLACE FUNCTION check_publisher_phone()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.contactnum !~ '^[0-9]+$' THEN
        RAISE EXCEPTION 'Номер телефона должен содержать только цифры';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_publisher_phone
BEFORE INSERT OR UPDATE ON publishers
FOR EACH ROW
EXECUTE FUNCTION check_publisher_phone();

--автоматическая установка заказа на "новый"
CREATE OR REPLACE FUNCTION set_default_order_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_id IS NULL THEN
        NEW.status_id := (SELECT id_status FROM statuses WHERE status = 'Новый' LIMIT 1);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_default_order_status
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_default_order_status();

-- проверка email
CREATE OR REPLACE FUNCTION check_email_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email NOT LIKE '%@%' THEN
        RAISE EXCEPTION 'Некорректный email: должен содержать символ @';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_email
BEFORE INSERT OR UPDATE ON Users
FOR EACH ROW
EXECUTE FUNCTION check_email_trigger();

--ПРОВЕРКА ТРИГГЕРОВ
UPDATE Users
SET Email = 'mail.com'
WHERE id_user = 1; --проверка email

UPDATE Publishers 
SET ContactNum = '8q95h234K67'
WHERE id_publisher = 1; --проверка номера телефона

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ЖУРНАЛ АУДИТА
CREATE TABLE AuditLog (
    ID_Audit SERIAL PRIMARY KEY,
    TableName TEXT NOT NULL,         -- В какой таблице было изменение
    Record_ID INT,                   -- ID изменённой записи
    Action TEXT NOT NULL,            -- INSERT / UPDATE / DELETE
    ChangedBy TEXT,                  -- Кто изменил (логин, email или системное имя)
    ChangedAt TIMESTAMP DEFAULT NOW(),
    OldValue JSONB,                  -- Старые данные
    NewValue JSONB                   -- Новые данные
);

-- ФУНКЦИЯ ДЛЯ ЛОГИРОВАНИЯ
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
DECLARE
  key_field TEXT;
  key_value INT;
  user_login TEXT;
BEGIN
  SELECT column_name INTO key_field
  FROM information_schema.columns
  WHERE table_name = TG_TABLE_NAME
    AND column_name ILIKE 'id_%'
  LIMIT 1;

  BEGIN
    user_login := current_setting('app.current_user', true);
  EXCEPTION
    WHEN others THEN
      user_login := 'anonymous';
  END;

  IF TG_OP = 'UPDATE' THEN
    EXECUTE format('SELECT ($1).%I', key_field) INTO key_value USING NEW;
    INSERT INTO AuditLog (TableName, Record_ID, Action, ChangedBy, OldValue, NewValue)
    VALUES (TG_TABLE_NAME, key_value, 'UPDATE', user_login, row_to_json(OLD), row_to_json(NEW));

  ELSIF TG_OP = 'DELETE' THEN
    EXECUTE format('SELECT ($1).%I', key_field) INTO key_value USING OLD;
    INSERT INTO AuditLog (TableName, Record_ID, Action, ChangedBy, OldValue)
    VALUES (TG_TABLE_NAME, key_value, 'DELETE', user_login, row_to_json(OLD));

  ELSIF TG_OP = 'INSERT' THEN
    EXECUTE format('SELECT ($1).%I', key_field) INTO key_value USING NEW;
    INSERT INTO AuditLog (TableName, Record_ID, Action, ChangedBy, NewValue)
    VALUES (TG_TABLE_NAME, key_value, 'INSERT', user_login, row_to_json(NEW));
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ЛОГИРОВАНИЕ КНИГ
CREATE TRIGGER trg_books_audit
AFTER INSERT OR UPDATE OR DELETE ON Books
FOR EACH ROW
EXECUTE FUNCTION log_changes();

-- ЛОГИРОВАНИЕ ПОЛЬЗОВАТЕЛЕЙ
CREATE TRIGGER trg_users_audit
AFTER INSERT OR UPDATE OR DELETE ON Users
FOR EACH ROW
EXECUTE FUNCTION log_changes();

-- ЛОГИРОВАНИЕ АККАУНТОВ
CREATE TRIGGER trg_accounts_audit
AFTER INSERT OR UPDATE OR DELETE ON Accounts
FOR EACH ROW
EXECUTE FUNCTION log_changes();

-- ЛОГИРОВАНИЕ ЗАКАЗОВ
CREATE TRIGGER trg_orders_audit
AFTER INSERT OR UPDATE OR DELETE ON Orders
FOR EACH ROW
EXECUTE FUNCTION log_changes();

-- ЛОГИРОВАНИЕ ОТЗЫВОВ
CREATE TRIGGER trg_reviews_audit
AFTER INSERT OR UPDATE OR DELETE ON Reviews
FOR EACH ROW
EXECUTE FUNCTION log_changes();


SELECT *FROM AuditLog
