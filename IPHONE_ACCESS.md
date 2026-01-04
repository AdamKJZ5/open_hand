# iPhone Access Guide for OpenHand Care

## Overview
Access your local development server from your iPhone on the same WiFi network.

## Your Network Details
- **Mac IP Address**: `10.0.0.236`
- **Backend Server**: `http://10.0.0.236:5001`
- **Frontend URL**: `http://10.0.0.236:5173`

## Setup Steps

### 1. Make Sure Both Servers are Running

**Backend:**
```bash
cd backend
npm run dev
```
You should see:
```
Server running in development mode on port 5001
Local: http://localhost:5001
Network: http://10.0.0.236:5001
Frontend URL for iPhone: http://10.0.0.236:5173
```

**Frontend:**
```bash
cd frontend
npm run dev
```
You should see:
```
Local: http://localhost:5173
Network: http://10.0.0.236:5173
```

### 2. Connect Your iPhone to the Same WiFi

Make sure your iPhone is connected to the **same WiFi network** as your Mac.

### 3. Access from iPhone

Open Safari (or any browser) on your iPhone and go to:
```
http://10.0.0.236:5173
```

## What's Been Configured

### Backend (`backend/src/server.ts`)
- ✅ CORS configured to allow requests from iPhone
- ✅ Server listening on `0.0.0.0` (all network interfaces)
- ✅ Allowed origins include both `localhost:5173` and `10.0.0.236:5173`

### Frontend (`frontend/src/api.ts`)
- ✅ API automatically detects if you're accessing via network IP
- ✅ Switches backend URL based on your access method
- ✅ Works seamlessly on both localhost and network

### Frontend (`frontend/vite.config.ts`)
- ✅ Already configured with `host: true` for network access

## Mobile-Responsive Pages

All admin pages now have mobile-optimized layouts:
- **ManageApplications**: Tables switch to cards on mobile
- **ManageUsers**: Tables switch to cards on mobile
- **All forms and modals**: Responsive on all screen sizes

## Troubleshooting

### Can't Access from iPhone?

1. **Check WiFi**: Ensure iPhone and Mac are on the same network
2. **Check Firewall**: Mac firewall might be blocking connections
   ```bash
   # On Mac, check firewall settings
   System Preferences > Security & Privacy > Firewall
   ```

3. **Verify IP Address**: Your Mac's IP might have changed
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   If different from `10.0.0.236`, update:
   - `backend/src/server.ts` (lines 22 and 93)
   - This guide

4. **Check Servers**: Make sure both frontend and backend are running

5. **Try Force Refresh**: On iPhone Safari, hold refresh button

### Backend Not Accepting Connections?

If you see CORS errors:
1. Check backend terminal for the network URL
2. Verify the IP in `backend/src/server.ts` matches your actual IP
3. Restart backend server after changes

## Testing on iPhone

1. **Register/Login**: Full authentication works
2. **Navigation**: All navbar links work on mobile
3. **Forms**: Touch-friendly buttons and inputs
4. **Tables**: Switch to card view automatically
5. **Modals**: Full-screen responsive on mobile
6. **Dashboards**: All role dashboards work

## Security Note

This configuration is for **development only**. The server accepts connections from your local network. Do not use this setup in production.

## Need to Update IP?

If your Mac's IP address changes:

1. Get new IP:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Update `backend/src/server.ts`:
   - Line 22: Update the IP in `allowedOrigins`
   - Line 93: Update the IP in console.log

3. Restart backend server

4. Frontend will automatically use the new IP when you access it

## Quick Reference

| Service | Localhost | iPhone Access |
|---------|-----------|---------------|
| Frontend | http://localhost:5173 | http://10.0.0.236:5173 |
| Backend API | http://localhost:5001/api | http://10.0.0.236:5001/api |
| MongoDB | mongodb://localhost:27017 | (local only) |

## Have Fun Testing! 📱

Your app is now fully accessible from your iPhone. Test the UX, try all the features, and enjoy the vibrant gradients on mobile! 🎨
