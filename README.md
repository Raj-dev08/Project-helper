# 🚀 Project Helper  

![Status](https://img.shields.io/badge/Status-Live-brightgreen)  
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20Socket.IO-blue)  
![License](https://img.shields.io/badge/License-MIT-yellow)  

**Project Helper** is a real-time project collaboration platform where developers can **share ideas, manage tasks, chat, and video call—all in one place**. Designed for scalability, performance, and a great user experience.  

🌐 **Live Demo:** [project-helper-aqm2.onrender.com](https://project-helper-aqm2.onrender.com)  

---

## ✨ Key Features  

### 🔐 Authentication & Security  
- ✅ Secure login/signup with **JWT** + HTTP-only cookies  
- 🔄 Persistent sessions with refresh tokens  

### 📁 Project Management  
- ➕ Create, join & manage projects  
- ✅ Task & issue tracking  

### 💬 Real-Time Chat  
- 🗣️ Private & group chats powered by **Socket.IO**  
- 👀 Seen/unseen message indicators  
- ✏️ Edit & delete messages (real-time updates)  
- 🔔 Live message notifications  

### 🎥 Video Calling  
- 👥 Group and peer-to-peer video calls powered by **Stream API**  

### 👥 Friends & Notifications  
- ✅ Send/accept/reject friend requests  
- 🟢 Real-time online/offline updates  
- 🔔 Notifications for messages and project events  

### ⚡ Performance & UX  
- ⚡ Redis caching and session handling  
- 📇 Indexed MongoDB schemas for performance  
- 🔄 Compression and pagination for speed  
- 🎨 Responsive UI with **Framer Motion** animations  

---

## 🛠 Tech Stack  

| Layer           | Technologies                                      |
| --------------- | ------------------------------------------------- |
| **Frontend**    | React, Tailwind CSS, Framer Motion               |
| **Backend**     | Node.js, Express                                 |
| **Database**    | MongoDB                                          |
| **Real-Time**   | Socket.IO                                        |
| **Video Calls** | Stream API                                       |
| **Caching**     | Redis                                            |
| **Auth**        | JWT + Secure Cookies                             |
| **Hosting**     | Render                                           |

---

## 🏗 Architecture Diagram  

```mermaid
graph TD
  UI[React + Tailwind + Framer Motion] --> API[Node.js + Express]
  API --> DB[MongoDB (Data Storage)]
  API --> RS[Redis (Caching & Sessions)]
  API --> SO[Socket.IO (Real-Time Chat & Notifications)]
  API --> ST[Stream API (Video Calling)]

```

---
## 📦 Getting Started (Local Setup)

## 1. Clone the Repository

```bash
git clone https://github.com/Raj-dev08/Course-It.git
cd Course-It
```

## 2. Setup env variables 

### backend/.env
- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret
- REDIS_URL=your_redis_url
- STREAM_API_KEY=your_stream_key
- STREAM_API_SECRET=your_stream_secret

- ARCJET_KEY= your_arcjet_key


### frontend/.env
- VITE_STREAM_KEY=your_stream_key

## 3. Run locally 

```
cd backend
npm install
npm run dev
```

```
cd frontend
npm install
npm run dev
```
## 🚀 Live Demo

🌍 **Check it out here:**  
🔗 [Click to Open Course-It on Render](https://course-it-2s22.onrender.com)

# demo credentials for accessing 
- Email: hi@gmail.com
- Password: 1234
- 
