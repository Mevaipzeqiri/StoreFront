Setup Instructions
Prerequisites
	Node.js 
	PostgreSQL 
	Angular CLI 
	npm 


Backend Setup
1.	Clone the repository
git clone <name>
cd backend

2.	Install dependencies
npm install

3.	Configure environment variables
Create a .env file in the root directory:
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=storefront_db
DATABASE_USER=postgres
DATABASE_PASSWORD= password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

4.	Create database
CREATE DATABASE webstore;
Xreate Tables

5.	Run database schema
psql -U postgres -d webstore -f database/schema.sql

6.  Start the server
npm start


Frontend Setup
1.	Install dependencies
npm install
2.	Configure environment
Update src/environments/environment.ts:
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
3.	Start development server
ng s

The application will be available at http://localhost:4200
Default Admin Account
After running the database schema, you can create an admin user:
POST http://localhost:3000/api/auth/register
{
  "username": "admin",
  "email": "admin@storefront.com",
  "password": "admin123",
  "role": "admin"
}
