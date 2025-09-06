# OhMyCharm Ledger

This is a simple **Sales & Expenses Ledger Web App** built for my friend's small business to track their sales and manage product inventory more efficiently than Excel sheets.

The application includes:

- Product Management
- Customer Management
- Order Tracking
- Basic Inventory Tracking (with per-order itemization)
- A clean frontend for quick usage
- Backend API built with Express and MongoDB (Mongoose)

While this project was tailored for their use case, it is flexible enough that **anyone can modify and adapt it to their own needs.**

---

## Features

- Add / Edit / Delete Products
- Add / Edit / Delete Customers
- Create Orders with multiple products per order
- Track order statuses (Placed, In Progress, Sent, Delivered)
- Calculates total order amounts automatically based on product prices and quantities
- Backend built with **Node.js, Express, MongoDB**
- Frontend built with **React**

---

## Folder Structure

```
ledger/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React

---

## Intended Use Case

This project was originally built to replace manual Excel sheets for a small-scale jewelry business to:

- Quickly track inventory and sales.
- Keep a log of all orders.
- Simplify daily expense and sale tracking without complex accounting systems.

---

## Contributions & Extensions

If you'd like to fork this project and build it for your own business or contribute to improving it:

- You can add **expense tracking modules**.
- Add **authentication (Admin panel / Staff roles)**.
- Improve UI/UX with additional dashboards.
- Extend APIs with pagination, filtering, and reporting endpoints.

Feel free to fork and modify!

---

## How to Run

Follow these steps to run the OhMyCharm Ledger app locally using Docker.

---

### 1. Install Docker

- Download and install Docker Desktop:  
  [https://www.docker.com/get-started](https://www.docker.com/get-started)
- Start Docker Desktop and ensure it is running.

---

### 2. Get the Project Files

- Clone or download the repository to your computer.
- Navigate to the root project folder (the folder that contains `backend/` and `frontend/`).

---

### 3. Create a `.env` File in the Root Folder

Create a `.env` file in the **root folder** with the following contents:

```
PORT=5001
MONGO_URI=<Your mongo uri>
NODE_ENV=production
```

> This `.env` file will be used by both backend and frontend services through Docker.

---

### 4. Start the Application

Open a terminal, navigate to the root folder, then run:

```bash
docker-compose -p <NAME> up --build -d
```

Wait for the build and startup process to complete. Once ready, open your browser and visit:

```
http://localhost:3000
```

### 5. Running in Detached Mode

To run the app in the background, use:

```
docker-compose -p <NAME> up
```

To stop the app, run:

```
docker-compose -p <NAME> down
```
