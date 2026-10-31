# 🎓 StudyServe — Student Services Platform

A full-stack web application like Urban Company, built specifically for students. Offers 6 services: File Pages, Book Spiral Binding, Files & Folders, Shivani Books, Photocopy, and Scholarship Affidavit.

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite + CSS Modules     |
| Backend   | Node.js + Express                 |
| Database  | MongoDB + Mongoose                |
| Auth      | JWT (JSON Web Tokens) + bcrypt    |
| Routing   | React Router v6                   |
| Toasts    | react-hot-toast                   |
| HTTP      | Axios                             |

---

## 📁 Project Structure

```
studyserve/
├── frontend/               ← React (Vite) app
│   ├── src/
│   │   ├── components/     ← Navbar, AuthModal, BookingModal
│   │   ├── pages/          ← Home, Services, TrackOrder, MyOrders, Scholarship
│   │   ├── context/        ← AuthContext (global login state)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                ← Express API
│   ├── models/             ← User, Order, Affidavit (Mongoose schemas)
│   ├── routes/             ← auth, orders, services, affidavit
│   ├── middleware/         ← JWT auth middleware
│   ├── server.js           ← Entry point
│   ├── .env                ← Environment variables
│   └── package.json
│
├── package.json            ← Root (run both with one command)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or higher → https://nodejs.org
- **MongoDB** running locally → https://www.mongodb.com/try/download/community
  - OR use MongoDB Atlas (free cloud) → https://cloud.mongodb.com

### Step 1 — Clone / Open in VS Code
Open the `studyserve` folder in VS Code.

### Step 2 — Install Dependencies (First time only)

```bash
npm run install:all
```

### Step 3 — Run the App

**🎯 EASIEST WAY (Recommended):**
```bash
./run.sh
```

**Or use npm:**
```bash
npm start
```

That's it! Open http://localhost:5173 in your browser.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| POST   | /api/auth/register | Create account     |
| POST   | /api/auth/login    | Login              |
| GET    | /api/auth/me       | Get current user   |

### Services
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | /api/services      | Get all services   |
| GET    | /api/services/:id  | Get one service    |

### Orders
| Method | Endpoint                  | Description           |
|--------|---------------------------|-----------------------|
| POST   | /api/orders               | Place new order       |
| GET    | /api/orders/track/:id     | Track order by ID     |
| GET    | /api/orders/my            | My orders (auth req)  |
| GET    | /api/orders               | All orders (admin)    |
| PATCH  | /api/orders/:id/status    | Update status (admin) |

### Affidavit
| Method | Endpoint                     | Description             |
|--------|------------------------------|-------------------------|
| POST   | /api/affidavit               | Request affidavit       |
| GET    | /api/affidavit/track/:id     | Track by request ID     |
| GET    | /api/affidavit               | All requests (admin)    |

---

## 📱 Pages

| Route          | Page                   |
|----------------|------------------------|
| `/`            | Home — Hero, Steps, Reviews |
| `/services`    | All 6 Services + Booking |
| `/scholarship` | Scholarship Affidavit Form |
| `/track`       | Track Order by ID      |
| `/my-orders`   | User's past orders     |

---

## 💡 VS Code Tips

Install these extensions for best experience:
- **ES7+ React/Redux/React-Native snippets**
- **Prettier - Code formatter**
- **MongoDB for VS Code**
- **Thunder Client** (test APIs without Postman)

---

## 🎯 Services Offered

1. 📄 **File Pages** — Ruled, plain, graph pages (₹2/page)
2. 📚 **Book Spiral Binding** — Professional binding (₹30/book)
3. 🗂️ **Files & Folders** — L-folders, box files etc (₹15/piece)
4. ✍️ **Shivani Books** — Publication guides & notes (₹80/book)
5. 🖨️ **Photocopy** — B&W and colour copies (₹1/page)
6. 🎓 **Scholarship Affidavit** — All colleges & years (₹50)

---

## 🔮 Future Enhancements

- [ ] UPI / Razorpay payment integration
- [ ] Admin dashboard panel
- [ ] SMS/WhatsApp order notifications
- [ ] Delivery partner tracking (live map)
- [ ] Referral system for students
- [ ] PWA (mobile app-like experience)

# student-service
