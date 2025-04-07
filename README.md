# EZeats 🍽️

EZeats is a microservice-based Node.js application for managing user authentication and food orders.  
It includes two main services:

- **`auth-service`**: Handles user registration, login, and JWT-based authentication.
- **`order-service`**: Manages food orders.

---

## 📁 Project Structure

EZeats/ ├── auth-service/ # Authentication microservice │ ├── Dockerfile │ ├── .env.example │ └── ... ├── order-service/ # Order management microservice │ ├── Dockerfile │ ├── .env.example │ └── ... ├── docker-compose.yml # Root-level Docker Compose file └── README.md # Project documentation


---

## ⚙️ Setup Instructions (Without Docker)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manwa1997/EZeats.git
   cd EZeats

# 2. Run auth-service:
cd auth-service
npm install
npm run start:dev

# 3. In a new terminal, run order-service
cd ../order-service
npm install
npm run start:dev

# 4. Both services should now be running:

auth-service: http://localhost:3000
order-service: http://localhost:3001

# 🐳 Docker Setup (Recommended)
# 1. Requirements
  Docker installed
  Docker Compose installed

# 2. Create Environment Files
  auth-service/.env
  Create a .env file inside auth-service/:

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ezeats
DB_USER=postgres
DB_PASSWORD=1234
JWT_REFRESH_SECRET=myStrongRefreshSecret
JWT_EXPIRATION=30m
JWT_REFRESH_EXPIRATION=7d

NODE_ENV=production
DATABASE_URL=postgres://root:1234@db:5432/zeat
JWT_SECRET=myStrongSecret
JWT_EXPIRATION=60m        

order-service typically gets DB config from docker-compose.yml.

# 3. Run Services with Docker
From the project root:
docker-compose up --build

# Run tests for auth-service
cd auth-service
npm test

# Run tests for order-service
cd ../order-service
npm test

# 🛠️ Technologies Used
Node.js
NestJS
PostgreSQL
Docker + Docker Compose
JWT (Authentication)
TypeORM

# Swagger Endpoints 
1- for order-service http://localhost:3001/api/orders
2- for Auth-Service http://localhost:3000/api-docs
# 👤 Author
Manwa Rabaya
JavaScript & Java Backend Developer
Feel free to connect or raise an issue for collaboration!

