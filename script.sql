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

-- Аккаунты
INSERT INTO Accounts (Login, HashPassword, Role_ID) VALUES
('admin', 'hash_admin', 1),
('user1', 'hash_user1', 2),
('user2', 'hash_user2', 2);

-- Пользователи
INSERT INTO Users (Lastname, Firstname, Patronymic, Email, Account_ID) VALUES
('Иванов', 'Иван', 'Иванович', 'ivanov@mail.com', 2),
('Петров', 'Пётр', 'Сергеевич', 'petrov@mail.com', 3);

-- Адреса
INSERT INTO Addresses (Country, City, Street, House, Apartment, Indexmail) VALUES
('Россия', 'Москва', 'Тверская', 10, 15, '101000'),
('Россия', 'Санкт-Петербург', 'Невский проспект', 25, NULL, '190000');

-- Типы доставки
INSERT INTO DeliveryTypes (TypeName) VALUES
('Курьер'),
('Почта'),
('Самовывоз');

-- Статусы заказов
INSERT INTO Statuses (Status) VALUES
('Новый'),
('Оплачен'),
('Доставлен'),
('Отменён');

-- Авторы
INSERT INTO Authors (Lastname, Firstname, Patronymic, BirthDate, DeathDate) VALUES
('Пушкин', 'Александр', 'Сергеевич', '1799-06-06', '1837-01-29'),
('Толстой', 'Лев', 'Николаевич', '1828-09-09', '1910-11-20'),
('Достоевский', 'Фёдор', 'Михайлович', '1821-11-11', '1881-02-09');

-- Категории
INSERT INTO Categories (Name) VALUES
('Роман'),
('Поэзия'),
('Фантастика');

-- Издатели
INSERT INTO Publishers (LegalName, ContactNum, Email, Address_ID) VALUES
('Издательство АСТ', '84951234567', 'contact@ast.ru', 1),
('Эксмо', '84959876543', 'info@eksmo.ru', 2);

-- Книги
INSERT INTO Books (Title, Description, PublishDate, Author_ID, Publisher_ID, Category_ID, Price, Quantity, ImageURL) VALUES
('Евгений Онегин', 'Роман в стихах', '1833-01-01', 1, 1, 2, 350.00, 10, 'img/onegin.jpg'),
('Война и мир', 'Эпопея', '1869-01-01', 2, 2, 1, 1200.00, 5, 'img/warpeace.jpg'),
('Преступление и наказание', 'Роман', '1866-01-01', 3, 1, 1, 800.00, 7, 'img/crime.jpg');

-- Заказы
INSERT INTO Orders (OrderDate, User_ID, Status_ID, DeliveryType_ID, Address_ID) VALUES
('2025-09-01 10:00:00', 1, 1, 1, 1),
('2025-09-05 15:30:00', 2, 2, 2, 2);

-- Детали заказов
INSERT INTO OrderDetails (Order_ID, Price, Quantity, Book_ID) VALUES
(1, 350.00, 1, 1),
(1, 1200.00, 1, 2),
(2, 800.00, 2, 3);

-- Отзывы
INSERT INTO Reviews (User_ID, Book_ID, Rating, UserComment, ReviewDate) VALUES
(1, 1, 5, 'Очень понравилось!', '2025-09-02 12:00:00'),
(1, 2, 4, 'Сложно читать, но круто', '2025-09-03 14:00:00'),
(2, 3, 5, 'Мощный роман', '2025-09-06 09:30:00');


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
    a.Lastname || ' ' || a.Firstname AS "Автор",
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

-- Подробности заказа (связь заказов с книгами)
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