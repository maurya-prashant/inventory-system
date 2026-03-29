# 📦 Inventory System

A full-stack inventory management application built with **FastAPI**, **React**, and **PostgreSQL**. Manage your products from a clean dashboard — add, edit, delete, search by ID, and track total stock value in real time.

---

## 📸 Screenshots

![Dashboard Overview](screenshots/dashboard.png)
*Dashboard showing total products, units in stock, and inventory value*

![Live Catalog & Product Editor](screenshots/catalog.png)
*Live product catalog with edit/delete actions and the product creation form*

---

## ✨ Features

- 📊 **Dashboard stats** — total products, units in stock, total inventory value
- 🗂️ **Live catalog** — browse all products with stock count per item
- ➕ **Create products** — add new items via the Product Editor form
- ✏️ **Edit & Delete** — manage any product directly from the catalog
- 🔍 **Search by ID** — quickly find a product using the Quick Search panel
- 🌱 **Auto-seed** — database is seeded with sample data on first run

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, SQLAlchemy |
| Frontend | React |
| Database | PostgreSQL |
| API Docs | FastAPI Swagger UI (`/docs`) |

---

## 📁 Project Structure

```
inventory-system/
├── frontend/          # React frontend
├── main.py            # FastAPI app, routes & middleware
├── models.py          # Pydantic models
├── database.py        # DB connection & session
├── database_model.py  # SQLAlchemy ORM models
└── .env               # Environment variables (not committed)
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL running locally

### 1. Clone the repository

```bash
git clone https://github.com/maurya-prashant/inventory-system.git
cd inventory-system
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_db
```

### 3. Install backend dependencies

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv
```

### 4. Run the backend

```bash
uvicorn main:app --reload
```

API available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | Get all products |
| `GET` | `/product/{id}` | Get a product by ID |
| `POST` | `/product` | Add a new product |
| `PUT` | `/product?id={id}` | Update a product by ID |
| `DELETE` | `/product?id={id}` | Delete a product by ID |

### Request Body (POST / PUT)

```json
{
  "id": 1,
  "name": "phone",
  "description": "budget phone",
  "price": 99,
  "quantity": 10
}
```

---

## 📝 Notes

- CORS is currently set to allow all origins (`*`) — restrict this before any production deployment.
- Use `/docs` for quick API testing without Postman.

---

## 👤 Author

**Prashant Maurya**  
[GitHub](https://github.com/maurya-prashant) • [LinkedIn](https://www.linkedin.com/in/prashant-maurya-986645331/)
