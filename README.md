# 🔥 Project Helper  
![Status](https://img.shields.io/badge/Status-Live-brightgreen)  
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20Socket.IO-blue)  
![License](https://img.shields.io/badge/License-MIT-yellow)  

🚀 A **real-time project collaboration platform** where developers can **share ideas, manage tasks, chat, and video call all in one place**!  

🌐 **Live Demo:** [Click Here](https://project-helper-aqm2.onrender.com)  

---

## ✨ Features  
✅ **Authentication & Security**  
   - JWT-based Auth  
   - HTTP-only Secure Cookies  

✅ **Project Management**  
   - Create, Join & Manage Projects  
   - Task & Issue Tracking  

✅ **Real-Time Chat 💬**  
   - **1-on-1 & Group Chats** using Socket.IO  
   - **Seen/Unseen Indicators**  
   - **Edit & Delete Messages (Live Updates)**  
   - **Live Message Notifications**  

✅ **Video Calling 🎥**  
   - High-quality video calls powered by **Stream API**  

✅ **Friends & Notifications 👥**  
   - Send Friend Requests, Accept/Reject  
   - **Real-Time Friend Status Updates**  
   - Notifications for **messages, requests, and project events**  

✅ **Performance & UX ⚡**  
   - **Redis Caching**, DB Indexing, Compression  
   - **Responsive Design + Framer Motion Animations**  

---

## 🛠 Tech Stack  
| **Category**   | **Technologies** |
|---------------|------------------|
| **Frontend**  | React, Tailwind CSS, Framer Motion |
| **Backend**   | Node.js, Express |
| **Database**  | MongoDB |
| **Real-Time** | Socket.IO |
| **Video Calls**| Stream API |
| **Caching**   | Redis |
| **Auth**      | JWT + Secure Cookies |
| **Hosting**   | Render |

---


## 🏗 Architecture  
```mermaid
graph TD
A[Frontend: React + Tailwind + Framer Motion] --> B[Backend: Node.js + Express]
B --> C[MongoDB: Data Storage]
B --> D[Redis: Caching & Session]
B --> E[Socket.IO: Real-Time Communication]
B --> F[Stream API: Video Calling]
