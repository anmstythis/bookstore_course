CREATE DATABASE BookMixDB;

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