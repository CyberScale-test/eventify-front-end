# Eventify (Frontend) 🎉

**Eventify** is the frontend of an event management platform built with Next.js and React. Users can browse events, join with one click, and view real-time updates.

---

## ✨ Frontend Features

- **User Authentication UI**  
  Clean login/registration interface (custom auth flow).

- **Event PArticipation**  
  - Join events instantly via a **"Participate"** button.  

- **Real-Time Notifications UI**  
  Visual alerts when event details change (e.g., Event Updated).  

- **Event Creation Form**  
  Intuitive form for organizers to create new events.  

- **Light Design**  
 Navigate smoothly.  

---

## 🛠 Tech Stack

- **Framework**: Next.js (React)  
- **State Management**: Context API and React Hooks  
- **Routing**: Next.js Dynamic Routing  
 



## 🚀 Installation

1. **Clone the Frontend Repository**  
   ```bash
   git clone [https://github.com/CyberScale-test/eventify-front-end.git]
   ```
2. **Enter The Folder** 
   ```bash   
   cd eventify
   ```
3. **Install Dependencies** 
   ```bash   
   npm install
   ``` 
4. **Copy .env.example** 
   ```bash   
   cp .env.example .env
   ```
5. **Install Additional Packages** 
   ```bash   
   npm install dayjs pusher-js react-toastify
   ```
6. **Configure the Pusher** 
   ```bash   
   NEXT_PUBLIC_PUSHER_APP_KEY=your_app_key
   NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
   ```
7. **Start Development Server** 
   ```bash   
   npm run dev
   ```  
  
---

  ## Screenshots From The Frontend

![Events page Preview](image.png)

![My Events Page Preview](<eventify my.PNG>)

![My Bookings page Preview](<eventify Bookings.PNG>)