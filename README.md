# Cab Booking API and Web App

A multi-city cab booking project with a React frontend and an Express/MongoDB API. Customers can estimate fares and book rides; admins manage cities, rates, drivers, and bookings.

## Features

- Customer registration, login, and profile lookup with JWT authentication
- City listing and admin city/rate management
- Driver registration and availability lookup
- Fare estimates based on city rates and trip distance
- Ride booking, customer booking history, cancellation, and admin booking management
- Postman and Thunder Client request collections for API testing

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, Mongoose, MongoDB
- Authentication: JSON Web Tokens and bcrypt

## Project Structure

```text
backend/       Express API, routes, controllers, models, and seed script
frontend/      React application
CabBooking_Postman_Collection.json
CabBooking_ThunderClient_Collection.json
```

## Requirements

- Node.js 18 or newer and npm
- MongoDB Atlas, or a local MongoDB server

## Local Setup

Clone the repository, then install each app's dependencies from the repository root:

```bash
npm --prefix backend install
npm --prefix frontend install
```

Create `backend/.env` with your own MongoDB connection string and JWT secret:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
JWT_SECRET=<generate-a-long-random-secret>
PORT=5001
```

For local MongoDB, `MONGO_URI` can look like `mongodb://127.0.0.1:27017/cab_booking`.
The frontend currently calls `http://localhost:5001/api`, so keep the backend on port `5001` for local development. `backend/.env` is ignored by Git; do not commit secrets.

Start the backend and frontend in separate terminals from the repository root:

```bash
npm --prefix backend run dev
```

```bash
npm --prefix frontend run dev
```

Open `http://localhost:5173`. The API root is `http://localhost:5001/`.

### Seed Sample Data

To add the sample cities and drivers to the connected database:

```bash
cd backend
node seed.js
```

The seed script inserts example drivers with demo credentials. Use it only with a development database; do not use those accounts in production.

## API Reference

Unless noted otherwise, routes are under `/api`. Protected routes require `Authorization: Bearer <JWT>`.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register a customer |
| POST | `/auth/login` | Public | Login and receive a JWT |
| GET | `/auth/me` | Authenticated | Get the current user's profile |
| GET | `/cities` | Authenticated | List cities |
| GET | `/cities/:id` | Authenticated | Get a city |
| POST | `/cities` | Admin | Add a city |
| PATCH | `/cities/:id/rates` | Admin | Update city rates |
| DELETE | `/cities/:id` | Admin | Delete a city |
| GET | `/drivers` | Authenticated | List drivers |
| GET | `/drivers/available` | Authenticated | List available drivers |
| GET | `/drivers/:id` | Authenticated | Get a driver |
| POST | `/drivers/register` | Admin | Register a driver |
| POST | `/fare/estimate` | Authenticated | Estimate a fare |
| POST | `/bookings` | Authenticated | Create a booking |
| GET | `/bookings/my` | Authenticated | List the current user's bookings |
| GET | `/bookings/:id` | Authenticated | Get a booking |
| PATCH | `/bookings/:id/cancel` | Authenticated | Cancel a booking |
| GET | `/bookings` | Admin | List all bookings |
| PATCH | `/bookings/:id/complete` | Admin | Mark a booking complete |

## API Client Collections

The repository includes `CabBooking_Postman_Collection.json` and `CabBooking_ThunderClient_Collection.json`. The requests use `http://localhost:5001` by default. After login, use the returned JWT as the Bearer token for protected requests. Replace placeholder IDs such as `CITY_ID_HERE` and `DRIVER_ID_HERE` with IDs returned by the API.

## Deploying the Backend on Render

1. Push the repository to GitHub and create a Render **Web Service** connected to it.
2. Set **Root Directory** to `backend`, **Build Command** to `npm install`, and **Start Command** to `npm start`.
3. Add `MONGO_URI` and `JWT_SECRET` in the Render service's environment settings. Render supplies `PORT`; do not hard-code it in Render settings.
4. Configure MongoDB Atlas network access so the Render service can connect.
5. Deploy, then check `https://<your-render-service>.onrender.com/` for the API status response.

The frontend is currently configured for local development and calls `localhost:5001`. A deployed frontend will need its API base URL changed to the deployed backend URL before it can work remotely.

## Security Notes

- The current registration handler accepts the `role` field from the request body, including `admin`. Restrict public registration to customer accounts and create admins through a controlled process before exposing this API publicly.
- Keep `.env` files and real credentials out of GitHub. Rotate any credentials that have been committed or shared.
- Use a separate development database for seeded demo data.