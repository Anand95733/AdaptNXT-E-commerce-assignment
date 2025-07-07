# Anand's E-commerce API (Backend) - AdaptNXT Full Stack Assignment

This project implements a robust RESTful API for an e-commerce platform, built as part of the NxtWave Full Stack Development assignment. It provides core functionalities for user management, product handling, shopping cart operations, and order processing, designed with a focus on practical solutions and MERN stack principles.

## 🚀 Deployed Backend API
The backend API is deployed and live on Render:
**URL:** [https://anand-ecommerce-api.onrender.com](https://anand-ecommerce-api.onrender.com)

## ✨ Key Features

* **User Authentication & Authorization:** Secure registration and login for both customers and administrators using JWT (JSON Web Tokens) and Bcrypt for password hashing. Role-based access control implemented for sensitive operations.
* **Product Management:** CRUD (Create, Read, Update, Delete) operations for products, with admin-only access for creation and modification.
* **Shopping Cart Functionality:** Users can add, view, update quantities, and remove items from their personalized shopping cart.
* **Order Processing:** Authenticated users can create orders from their cart, which automatically updates product stock and clears the cart. Admin users can manage order statuses.
* **Database Integration:** Utilizes MongoDB Atlas for cloud-hosted data storage, accessed via Mongoose.
* **RESTful API Design:** Clean and well-structured API endpoints following REST principles.

## 🛠️ Technologies Used (Backend)

* **Node.js:** JavaScript runtime environment.
* **Express.js:** Web application framework for Node.js.
* **MongoDB Atlas:** Cloud-based NoSQL database.
* **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
* **JSON Web Tokens (JWT):** For secure authentication.
* **Bcrypt.js:** For password hashing.
* **Dotenv:** For environment variable management.
* **CORS:** Middleware for enabling Cross-Origin Resource Sharing.

## 📦 How to Test the Backend API (Using Postman)

The API is fully functional and can be tested using the provided Postman collection.

1.  **Download Postman:** If you don't have it, download Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).
2.  **Import Collection:**
    * Download the Postman Collection JSON file: [anand_ecommerce_api_postman_collection.json](anand_ecommerce_api_postman_collection.json) (You will need to upload this file to the root of this GitHub repo).
    * In Postman, click "Import" -> "Upload Files" and select the downloaded JSON.
3.  **Use Deployed URL:** All requests in the collection are pre-configured to use the deployed Render API URL: `https://anand-ecommerce-api.onrender.com`.
4.  **Follow the Collection Order:** Execute requests in the order they appear (e.g., Register, Login, Create Product, Add to Cart, Create Order) to test the full flow.

---
**Screenshot: Successful API Interaction (Example - Product Creation via Postman)**
*(Replace this text with a screenshot of your successful Postman test against the Render URL, e.g., product creation or order creation. Make sure the URL `https://anand-ecommerce-api.onrender.com` is visible.)*
![Successful Product Creation via Postman on Render](https://placehold.co/800x400/000000/FFFFFF?text=YOUR_POSTMAN_SCREENSHOT_HERE)

---

## 🌐 Frontend Application (Separate Project)

A separate React.js frontend application, built with Vite.js, consumes this backend API to provide a user interface.

* **Frontend GitHub Repository:** [**PASTE YOUR FRONTEND GITHUB REPO LINK HERE**]
* **Deployed Frontend URL:** [**PASTE YOUR DEPLOYED FRONTEND URL HERE (from Netlify/Render)**]

### Frontend Features:
* User Registration and Login (Customer & Admin roles).
* JWT-based authentication and protected routes.
* Listing of all available products from the API.
* **Add to Cart functionality.**
* **View Cart functionality.**
* Basic dark-themed UI with responsive design.

---
**Screenshot: Working Frontend (Example - Product Listing)**
*(Replace this text with a screenshot of your working Vite.js frontend, e.g., the product listing page or the cart page. Make sure the browser URL `localhost:5173` or the deployed frontend URL is visible.)*
![Working Frontend Demo](https://placehold.co/800x400/000000/FFFFFF?text=YOUR_FRONTEND_SCREENSHOT_HERE)

---

## 🚀 Local Setup (Optional)

To run the backend API locally:

1.  **Clone the repository:**
    `git clone https://github.com/Anand95733/AdaptNXT-E-commerce-assignment.git`
    `cd AdaptNXT-E-commerce-assignment/ecommerce-api`
2.  **Install dependencies:**
    `npm install`
3.  **Create a `.env` file** in the `ecommerce-api` directory with your MongoDB Atlas URI and JWT secret:
    ```
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=3000
    ```
4.  **Start the server:**
    `npm run dev` (for development with nodemon) or `npm start` (for production)

To run the frontend application locally (from its separate repository):

1.  **Clone the frontend repository:**
    `git clone https://github.com/Anand95733/AdaptNXT-E-commerce-assignment.git`
    `cd my-ecommerce-frontend`
2.  **Install dependencies:**
    `npm install`
3.  **Start the development server:**
    `npm run dev`