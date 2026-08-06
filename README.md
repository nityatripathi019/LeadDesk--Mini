# LeadDesk Mini CRM

A mini Lead Management System built with **Node.js, Express.js, MongoDB, EJS, and Bootstrap**. The application allows visitors to submit project inquiries through a public landing page, while authenticated administrators can securely manage leads from an admin dashboard.

---

## Features

### Public Landing Page

* Responsive landing page
* Lead capture form
* Client-side and server-side validation
* Success message after form submission

### Admin Dashboard

* Secure admin login
* Session-based authentication
* Password hashing using bcrypt
* Protected admin routes
* View all submitted leads
* Search leads by name or email
* Update lead status (New → Contacted → Closed)
* Logout functionality

---

## Tech Stack

### Frontend

* HTML
* CSS
* Bootstrap 5
* EJS

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* express-session
* bcrypt

---

## Folder Structure

```
lead-app/
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── Admin.js
│   └── Lead.js
│
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   └── admin.ejs
│
├── app.js
├── package.json
└── README.md
```

---

## Data Model

### Lead Schema

| Field     | Type   | Description               |
| --------- | ------ | ------------------------- |
| name      | String | Client name               |
| email     | String | Client email              |
| budget    | String | Project budget            |
| message   | String | Project requirements      |
| status    | String | New, Contacted, or Closed |
| createdAt | Date   | Automatically generated   |
| updatedAt | Date   | Automatically generated   |

### Admin Schema

| Field    | Type                   |
| -------- | ---------------------- |
| username | String                 |
| password | String (bcrypt hashed) |

---

## Authentication

The admin area is protected using **express-session**.

* Passwords are securely hashed using **bcrypt** before being stored in MongoDB.
* After successful login, the administrator's ID is stored in the session.
* Protected routes verify the session before granting access.
* Unauthorized users attempting to access `/admin` are redirected to the login page.

---

## Routes

### Public Routes

| Method | Route | Description       |
| ------ | ----- | ----------------- |
| GET    | /     | Landing page      |
| POST   | /lead | Submit a new lead |

### Authentication Routes

| Method | Route   | Description |
| ------ | ------- | ----------- |
| GET    | /login  | Login page  |
| POST   | /login  | Admin login |
| GET    | /logout | Logout      |

### Admin Routes

| Method | Route             | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | /admin            | View all leads           |
| PUT    | /admin/:id/status | Update lead status       |
| DELETE | /admin/:id        | Delete a lead (optional) |

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Start MongoDB locally.

Run the application:

```bash
node app.js
```

or

```bash
nodemon app.js
```

Open your browser:

```
http://localhost:8000
```

---

## Admin Login

Create an admin account in the database (or seed one during development).

Login using your stored admin credentials.

---

## Future Improvements

* Multiple admin accounts
* Email notifications for new leads
* Dashboard analytics
* Pagination
* Filter leads by status
* Forgot password functionality
* Role-based access control

---

## Author

**Nitya Tripathi**

Built as part of the LeadDesk Mini CRM assignment using the MERN stack (Express, MongoDB, and EJS-based frontend).
