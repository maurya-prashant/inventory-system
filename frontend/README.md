# Frontend

This frontend is separate from the FastAPI backend and does not require changing any backend file.

## Setup

1. Create a local env file if needed:
   - Copy `.env.example` to `.env`
2. Make sure `VITE_API_BASE_URL` points to your FastAPI server.
3. Install dependencies:
   - `npm.cmd install`
4. Start the frontend:
   - `npm.cmd run dev`

## Default API URL

If no `.env` file is provided, the app uses:

`http://127.0.0.1:8000`

## Backend routes used

- `GET /products`
- `GET /product/{id}`
- `POST /product`
- `PUT /product?id={id}`
- `DELETE /product?id={id}`
