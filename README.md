# 🐾 Pet Paal - Beginner's Guide to the Codebase

Welcome to **Pet Paal**, a modern web application for pet adoption and care! This guide is designed to help you understand how this project works, even if you are new to coding.

---

## 🏗️ How It Works (The Big Picture)

Imagine a restaurant:
1.  **The Customer (Frontend/Client)**: Looks at the menu and orders food. This is what users see in their browser.
2.  **The Waiter (API/Server)**: Takes the order to the kitchen. This processes requests.
3.  **The Kitchen (Database)**: Ingredients are stored and meals are prepared here. This is where data lives (MongoDB).

In **Pet Paal**:
*   **Client (`/client` folder)**: Built with **React**. It's the website you interact with.
*   **Server (`/server` folder)**: Built with **Node.js & Express**. It handles logic (login, saving pets, payments).
*   **Database**: We use **MongoDB** to store user and pet data.

---

## 📂 Project Structure Explained

The project is split into two main folders:

```
pet-paal/
├── client/   (Farontend - User Interface)
└── server/   (Backend - Logic & Data)
```

### 1. The Server Folder (`/server`)
This is the distinct "brain" of the application.

*   **`server.js`**: 🚪 **The Main Entrance**.
    *   This is the file that starts the server. It connects to the database and sets up all the rules.
*   **`config/`**: ⚙️ **Settings**.
    *   Contains database connection settings (`db.js`).
*   **`models/`**: 📝 **Blueprints**.
    *   Defines what data looks like. For example, a `User` model says a user must have a name, email, and password.
    *   *Examples: `userModel.js`, `petModel.js`.*
*   **`routes/`**: 🗺️ **The Map**.
    *   Defines the URL paths (like `/api/users/login`). It tells the server "When someone goes here, do this."
    *   *Examples: `userRoutes.js`, `petRoutes.js`.*
*   **`controllers/`**: 👨‍💼 **The Managers**.
    *   This is where the actual work happens. When a route is hit, a controller function runs to save data, check passwords, etc.
    *   *Examples: `authController.js` (handles login), `petController.js` (handles pets).*
*   **`middleware/`**: 🛡️ **The Security Guards**.
    *   Code that runs *before* the controller. For example, ensuring a user is logged in before they can post a pet.
    *   *Example: `authMiddleware.js`.*

### 2. The Client Folder (`/client`)
This is what the user sees and clicks.

*   **`src/`**: 📦 **Source Code**. All your React code lives here.
    *   **`main.jsx`**: The starting point that loads React into the web page.
    *   **`App.jsx`**: The main container. It usually holds the Navigation Bar and decides which "Page" to show.
    *   **`pages/`**: 📄 **The Screens**.
        *   Each file here typically represents one full screen on the website.
        *   *Examples: `HomePage.jsx`, `LoginPage.jsx`, `PetDetails.jsx`.*
    *   **`components/`**: 🧩 **Building Blocks**.
        *   Reusable small pieces like Buttons, Cards, or Forms that are used inside Pages.
        *   *Examples: `Navbar.jsx`, `PetCard.jsx`, `Footer.jsx`.*
    *   **`redux/`**: 🧠 **Memory**.
        *   Stores global data like "Is the user logged in?" so every page knows about it.

---

## 🚀 How to Run the Project

You need to run **two** terminals (command windows) at the same time.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*This starts the server on port 5000 (usually).*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*This starts the React website (usually on localhost:5173).*

---
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the `backend` folder.

`PORT` is usually set to 5000.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_complex_jwt_secret
NODE_ENV=development

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret


## Key Technologies Used

*   **MERN Stack**: MongoDB, Express, React, Node.js.
*   **Vite**: A tool that makes the React app run very fast.
*   **Tailwind CSS**: Used for styling the website (colors, spacing) easily.
*   **Redux Toolkit**: Manages complex data states.
*   **Socket.io**: Used for real-time chat functionality.

---

## Troubleshooting Tips

*   **"Connection Refused"**: Make sure your **Server** is running! The Client needs the Server to get data.
*   **"Env variable missing"**: Check your `.env` files in both `client` and `server` folders. They hold secret keys like database passwords.
