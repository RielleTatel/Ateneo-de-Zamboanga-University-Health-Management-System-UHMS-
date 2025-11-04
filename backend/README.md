# Backend Server

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

**Important**: Port 5000 is often used by macOS AirPlay Receiver. If you experience connection issues on port 5000:
- **Option 1**: Change `PORT=3001` in your `.env` file (recommended)
- **Option 2**: Disable AirPlay Receiver in System Settings > General > AirDrop & Handoff > AirPlay Receiver

3. Run the server:
```bash
npm run dev    # Development with auto-reload
npm start      # Production
```

## API Endpoints

- `GET /api/ping` - Health check endpoint
- `GET /api/users` - Fetch all users from Supabase

## Testing

Test the server is running:
```bash
curl http://localhost:3001/api/ping
```

Expected response:
```json
{"message":"Pong from backend"}
```

