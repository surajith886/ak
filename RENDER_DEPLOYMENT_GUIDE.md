# Render.com Deployment Guide for MediVault

## Issue & Solution
The `render.yaml` approach doesn't work automatically with Render.com. **You need to manually configure each service** in the Render dashboard.

## Step-by-Step Deployment

### **Part 1: Deploy Backend Service**

1. **Go to Render Dashboard**
   - Visit https://render.com/dashboard
   - Click **"New +"** button
   - Select **"Web Service"**

2. **Connect Repository**
   - Select your GitHub account
   - Choose repository: `surajith886/ak`
   - Branch: `master`
   - Click **"Connect"**

3. **Configure Backend Service**
   - **Name**: `medivault-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to you (e.g., `Singapore`, `US East`)
   - **Build Command**: 
     ```
     cd backend && npm install --include=dev && npm run build
     ```
   - **Start Command**: 
     ```
     node backend/dist/server.js
     ```
   - **Instance Type**: Free (for now)

4. **Add Environment Variables**
   Click **"Advanced"** and add these under "Environment":
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGO_URI` | `mongodb+srv://surajith886_db_user:O4fAWGvhIMsRJn2S@medivault.yg96n6b.mongodb.net/medivault?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `supersecretjwtkeyfordevelopment` |
   | `CORS_ORIGIN` | `https://ak-cwwf.vercel.app/,YOUR_FRONTEND_URL_HERE` |

5. **Click "Create Web Service"**
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://medivault-backend.onrender.com`)

---

### **Part 2: Deploy Frontend Service**

1. **Create Another Service**
   - Dashboard → **"New +"** → **"Static Site"**
   - Connect to same repo

2. **Configure Frontend Service**
   - **Name**: `medivault-frontend`
   - **Branch**: `master`
   - **Build Command**:
     ```
     cd frontend && npm install && npm run build
     ```
   - **Publish Directory**: `frontend/dist`

3. **Add Environment Variables**
   Click **"Advanced"** and add:
   
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://medivault-backend.onrender.com/api` |
   | `VITE_APP_TITLE` | `MediVault` |

4. **Click "Create Static Site"**
   - Wait for deployment
   - Note your frontend URL (e.g., `https://medivault-frontend.onrender.com`)

---

### **Part 3: Update CORS & MongoDB**

1. **Update Backend CORS_ORIGIN**
   - Go to Backend Service → **Environment**
   - Update `CORS_ORIGIN`:
     ```
     https://ak-cwwf.vercel.app/,https://medivault-frontend.onrender.com,https://yourdomain.com
     ```
   - Save changes

2. **Whitelist Render IP in MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Your Cluster → **Security** → **Network Access**
   - Click **"Add IP Address"**
   - Choose **"Allow from anywhere"** (0.0.0.0/0) or add Render's IP
   - Save

3. **Redeploy Backend**
   - Backend service → **"Manual Deploy"** → **"Deploy latest commit"**

---

### **Part 4: Test Deployment**

```bash
# Test backend
curl https://medivault-backend.onrender.com/api/config

# Expected response:
# {"status":"API is running"}

# Try registration
curl -X POST https://medivault-backend.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123","role":"customer"}'
```

---

## Troubleshooting

### **Build Fails: Cannot find type definition file for 'node'**
**Solution**: Ensure build command includes:
```
npm install --include=dev
```

### **Backend not connecting to MongoDB**
**Solution**: 
1. Check MongoDB Atlas IP whitelist includes Render's IP
2. Verify `MONGO_URI` environment variable is correct
3. Check service logs: Services → Backend → **"Logs"**

### **CORS Errors in Frontend**
**Solution**:
1. Update `CORS_ORIGIN` in backend environment variables
2. Redeploy backend service
3. Check that frontend URL matches exactly

### **Static Site Shows 404**
**Solution**:
1. Verify **Publish Directory** is set to `frontend/dist`
2. Check build command includes `npm run build`
3. Add redirect rule: Rewrites & Redirects → `/*` → `/index.html` (status 200)

---

## File Locations After Deployment

- **Backend**: `https://medivault-backend.onrender.com`
- **Frontend**: `https://medivault-frontend.onrender.com`
- **API Base**: `https://medivault-backend.onrender.com/api`
- **GitHub**: `https://github.com/surajith886/ak`

---

## Important Notes

⚠️ **Do NOT commit `.env` with secrets** - Use Render dashboard for sensitive data

🔐 **Keep MongoDB credentials safe** - Don't share in public repositories

📌 **Render free tier limitations**:
- Spins down after 15 minutes of inactivity
- ~0.5GB disk space
- Limited networking

Ready to deploy? Start with **Part 1: Deploy Backend Service** above! 🚀
