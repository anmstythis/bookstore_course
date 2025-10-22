import React, { useEffect, useState } from "react";
import api from "../axiosSetup.js";
import Header from "../components/Header.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Reports = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [sales, setSales] = useState([]);
  const [booksByCategory, setBooksByCategory] = useState([]); 

  useEffect(() => {
    Promise.all([
      api.get("/reports/orders-view"),
      api.get("/reports/top-books-view"),
      api.get("/reports/top-users-view"),
      api.get("/reports/orderdetails-view"),
      api.get("/reports/books-view"),
    ])
      .then(([ordersRes, booksRes, usersRes, orderDetailsRes, booksViewRes]) => {
        const orders = ordersRes.data || [];
        const books = booksRes.data || [];
        const users = usersRes.data || [];
        const orderDetails = orderDetailsRes.data || [];
        const booksView = booksViewRes.data || [];

        const formattedBooks = books
          .slice(0, 10)
          .map((b) => ({
            title: b["Название книги"] || "Неизвестно",
            sold: parseInt(b["Кол-во отзывов"] || 0),
          }));
        setTopBooks(formattedBooks);

        const formattedUsers = users
          .map((u) => ({
            user: u.username || "Неизвестно",
            total_spent: parseFloat(u.total_spent || 0),
          }))
          .sort((a, b) => b.total_spent - a.total_spent)
          .slice(0, 10);
        setTopUsers(formattedUsers);

        const formattedSales = orderDetails.map((od) => {
          const relatedOrder = orders.find(
            (o) => o["Код заказа"] === od["Код заказа"]
          );

          return {
            id: od["Код детали"],
            order_id: od["Код заказа"],
            book: od["Книга"],
            quantity: od["Кол-во"],
            unit_price: od["Цена за единицу"],
            total:
              parseFloat(od["Цена за единицу"] || 0) *
              parseInt(od["Кол-во"] || 0),
            order_date: relatedOrder ? relatedOrder["Дата заказа"] : "",
            customer: relatedOrder ? relatedOrder["Покупатель"] : "",
            status: relatedOrder ? relatedOrder["Статус"] : "",
            delivery: relatedOrder ? relatedOrder["Тип доставки"] : "",
          };
        });

        setSales(formattedSales);

        const categoryMap = {};
        booksView.forEach((book) => {
          const category = book["Категория"] || "Без категории";
          categoryMap[category] = (categoryMap[category] || 0) + 1;
        });
        const formattedCategories = Object.entries(categoryMap).map(
          ([category, count]) => ({ category, count })
        );
        setBooksByCategory(formattedCategories);
      })
      .catch((err) => console.error("Ошибка загрузки данных:", err));
  }, []);


  //экспорт в csv
  const exportCSV = (data, filename) => {
    if (!Array.isArray(data) || data.length === 0) return;

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) =>
        Object.values(row)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`) 
          .join(",")
      ),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };


  return (
    <div className="reports-container">
      <Header
        title="Аналитика продаж"
        description="Топ книг, покупателей и распределение книг по категориям. Возможен экспорт всех продаж в CSV."
      />

      <div>
        <div className="chart-card">
          <h3 className="chart-title">Топ книг по отзывам</h3>
          <div className="chart-wrapper-small">
            <Pie
              data={{
                labels: topBooks.map((b) => b.title),
                datasets: [
                  {
                    label: "Кол-во отзывов",
                    data: topBooks.map((b) => b.sold),
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                      "#9966FF",
                      "#FF9F40",
                      "#C9CBCF",
                    ],
                    borderColor: "#4d4431",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "bottom",
                    labels: { 
                      color: "#1D1C1A",
                      boxWidth: 14, 
                      font: { 
                        family: "Georgia, Times, serif",
                        size: 14
                      } 
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `${context.label}: ${context.parsed} отзывов`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Топ пользователей по сумме покупок</h3>
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: topUsers.map((u) => u.user),
                datasets: [
                  {
                    label: "Сумма покупок (₽)",
                    data: topUsers.map((u) => u.total_spent),
                    backgroundColor: "#4BC0C0",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    labels: {
                        color: "#1D1C1A", 
                        boxWidth: 14,
                        font: {
                          family: "Georgia, Times, serif",
                          size: 18, 
                        },
                      },
                  } 
                },
                scales: {
                  x: {
                    ticks: { 
                      autoSkip: false, 
                      maxRotation: 45, 
                      minRotation: 45,
                      color: "#1D1C1A", 
                      font: {
                        family: "Georgia, Times, serif",
                        size: 14,
                      },
                    },
                  },
                  y: {
                    ticks: {
                      color: "#1D1C1A",
                      font: {
                        family: "Georgia, Times, serif",
                        size: 14,
                      },
                    },
                  }
                },
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Количество книг по категориям</h3>
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: booksByCategory.map((c) => c.category),
                datasets: [
                  {
                    label: "Количество книг",
                    data: booksByCategory.map((c) => c.count),
                    backgroundColor: "#FF6384",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: {
                    ticks: { 
                      autoSkip: false, 
                      maxRotation: 45, 
                      minRotation: 45,
                      color: "#1D1C1A", 
                      font: {
                        family: "Georgia, Times, serif",
                        size: 14,
                      },
                    },
                  },
                  y: {
                    ticks: {
                      color: "#1D1C1A",
                      font: {
                        family: "Georgia, Times, serif",
                        size: 14,
                      },
                    },
                  }
                },
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <button
          className="formButton"
          onClick={() => exportCSV(sales, "Отчет по продажам.csv")}
        >
          Экспортировать продажи (CSV)
        </button>
      </div>
    </div>
  );
};

export default Reports;
