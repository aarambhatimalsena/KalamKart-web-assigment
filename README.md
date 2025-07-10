# KalamKart – Full-Stack E-commerce Web Application

KalamKart is a modern e-commerce web application developed as part of the Web API Development coursework. It supports customer and admin roles with secure login, product browsing, invoicing, and more.


## Features

### User Features:
- Register/Login
- View products and categories
- Add to Cart and Wishlist
- Checkout with invoice download
- View past orders
- Edit profile info (email, password, upload image, etc.)
- View product details and write reviews
- Apply discount coupons during checkout
- Add reviews
- Choose payment method during checkout:
  - eSewa 
  - Khalti 
  - Cash on Delivery (COD)

### Admin Features:
- Admin dashboard with metrics
- Manage products, categories, and users
- View all orders and invoices
- Secure access controls
- Create, update, and delete products
- Manage categories
- Create and manage coupon codes
- View and delete any product review

### Testing
- 10 frontend UI tests using Playwright
- 50+ backend unit & integration tests using Jest
- Mocked email sending and invoice generation in test mode using 'NODE_ENV=test'

---

## 💻 Tech Stack
- Frontend: React, Tailwind
- Backend: Node.js, Express, MongoDB
- Email & PDF: nodemailer (for email), pdfkit (for invoice generation)
- Testing:
     - Jest & Supertest (for backend unit & integration tests)
     - Playwright (for frontend UI testing)
- DevOps: Docker, dotenv


