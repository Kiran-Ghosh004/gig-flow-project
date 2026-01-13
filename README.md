🚀 GigFlow – Full Stack Freelance Marketplace

GigFlow is a full-stack freelance marketplace where clients can post gigs, freelancers can place bids, and hiring happens with real-time notifications.
The platform supports secure authentication, role-based actions, and modern responsive UI.

🔥 Key Features

🔐 Authentication & Security
User registration & login (JWT + HTTP-only cookies)
Protected routes for authenticated users
Public routes blocked when logged in
Secure logout

🧑‍💼 Client Features

Create gigs with budget & description
View all bids on their gigs
Hire one freelancer per gig
Automatically reject other bids
See hired freelancer name & email
Real-time notification sent to hired freelancer

🧑‍💻 Freelancer Features

Browse available gigs
View client name & email before bidding
Place bids with price & message
Prevent duplicate bids (UI + backend)
Prevent bidding on own gig
Receive real-time hire notification

⚡ Real-Time

Socket.IO based hiring notifications
Freelancer gets instant alert when hired

🧠 UX & UI

Responsive design (desktop + mobile)
Slide-in mobile menu (no screen blackout)
Status badges (pending / hired / rejected)
Disabled actions after hiring
Clean dashboards for client & freelancer

🛠 Tech Stack

Frontend

React (Vite)
Tailwind CSS
React Router
Context API
Axios
Socket.IO Client

Backend

Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Socket.IO
MongoDB Transactions

🗂 Project Structure

Backend

backend/

├── controllers/

├── models/

├── routes/

├── middleware/

├── config/

├── utils/

├── app.js

└── server.js

Frontend

frontend/
├── components/
├── pages/
├── context/
├── App.jsx
└── main.jsx


---

## 🔄 Application Flow

### Client Flow
1. Register / Login  
2. Create a gig  
3. View bids on the gig  
4. Hire a freelancer  
5. Freelancer receives a real-time notification  

### Freelancer Flow
1. Register / Login  
2. Browse gigs  
3. View gig & client details  
4. Place a bid  
5. Get notified instantly when hired  

---

## 🧪 Important Validations
- ❌ Cannot bid on own gig
- ❌ Cannot place multiple bids on the same gig
- ❌ Cannot hire more than one freelancer
- ❌ Cannot access protected routes when logged out
- ❌ Cannot access login/register pages when logged in

---

## ⚙️ Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development


▶️ Run Locally

Backend

cd backend
npm install
npm run dev

Frontend

cd frontend
npm install
npm run dev

📡 API Highlights

| Method | Endpoint              | Description     |
| ------ | --------------------- | --------------- |
| POST   | /api/auth/register    | Register user   |
| POST   | /api/auth/login       | Login user      |
| POST   | /api/gigs             | Create gig      |
| GET    | /api/gigs             | Browse gigs     |
| GET    | /api/gigs/:id         | Get gig details |
| POST   | /api/bids             | Place bid       |
| GET    | /api/bids/:gigId      | View bids       |
| PATCH  | /api/bids/:bidId/hire | Hire freelancer |


👨‍💻 Author

Kiran Ghosh
4th year engineering student 
Full Stack Developer



