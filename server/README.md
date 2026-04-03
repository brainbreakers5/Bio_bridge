# Biometric Bridge Backend

A robust Node.js backend for integrating biometric devices with Supabase.

## Tech Stack
- **Node.js & Express**: Core framework
- **Supabase**: Database and Authentication
- **JWT**: Secure API access for users
- **API Key**: Secure integration for biometric devices
- **Joi**: Request validation

## Project Structure
```
/src
  /controllers     # Request handlers
  /routes          # API route definitions
  /middleware      # JWT & API Key authentication
  /services        # Business logic (optional)
  /utils           # Utilities (Supabase client, etc.)
server.js          # Entry point
.env               # Environment variables
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- Supabase Project

### 2. Installation
```bash
cd server
npm install
```

### 3. Configuration
Create a `.env` file in the `server` directory (use `.env.example` as a template):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
DEVICE_API_KEY=your_secure_device_api_key
PORT=5000
```

### 4. Database Schema
Ensure your Supabase project has the following tables:

#### `users`
- `id` (uuid, primary key)
- `emp_id` (text, unique)
- `full_name` (text)
- `email` (text)
- `department` (text)
- `designation` (text)
- `device_pin` (text)
- `created_at` (timestamptz)

#### `attendance_logs`
- `id` (bigint, primary key)
- `emp_id` (text, references users.emp_id)
- `device_id` (text)
- `timestamp` (timestamptz)
- `type` (text: 'IN' or 'OUT')
- `raw` (jsonb)
- `created_at` (timestamptz)

### 5. Running Locally
```bash
npm run dev
```

## API Endpoints

### User APIs (Requires Bearer JWT)
- `GET /api/users`: Get all users
- `POST /api/users`: Register a new user
- `GET /api/attendance`: Get attendance logs (supports query params: `emp_id`, `start_date`, `end_date`)

### Device APIs (Requires x-api-key header)
- `POST /api/device/attendance`: Push attendance log from device
- `POST /api/device/register-user`: Sync a user from the device to DB
- `GET /api/device/sync-users`: Get all users for device syncing

## Deployment on Render

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the following:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js` (Ensure this is in the `server` directory or set Root Directory to `server`)
4. Add all environment variables from your `.env` to the **Environment** tab in Render.
