# Vercel Deployment Guide for Apna Swad

## Prerequisites

Before deploying to Vercel, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Firebase Service Account JSON**: Download from Firebase Console
3. **JWT Secret**: Generate a random 32+ character string

## Step 1: Install Dependencies

Navigate to your project root and install backend dependencies:

```bash
cd "e:\Apna Swad"
npm install
```

This will install:
- `firebase-admin` - Firebase Admin SDK
- `jsonwebtoken` - JWT token generation/verification
- `cors` - Cross-Origin Resource Sharing support

## Step 2: Get Firebase Service Account JSON

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **apnaswad-796a9**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file (keep it secure!)

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`

4. **Add Environment Variables** (CRITICAL):
   - Click **Environment Variables**
   - Add the following:
     - **Name**: `FIREBASE_KEY`
     - **Value**: Paste the entire Firebase service account JSON (as a single line)
     - **Name**: `JWT_SECRET`
     - **Value**: A random secret string (e.g., `your-super-secret-jwt-key-change-this-in-production`)

5. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
cd "e:\Apna Swad"
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? apna-swad
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add FIREBASE_KEY
# Paste your Firebase service account JSON when prompted

vercel env add JWT_SECRET
# Enter your JWT secret when prompted

# Deploy to production
vercel --prod
```

## Step 4: Update Frontend Configuration

After deployment, update the frontend to use your Vercel backend URL:

1. Open `frontend/src/Components/Login/Signup.jsx`
2. Change line 23 from:
   ```javascript
   const backendURL = "http://localhost:4000";
   ```
   To:
   ```javascript
   const backendURL = "https://your-vercel-deployment.vercel.app";
   ```

3. Do the same for `frontend/src/Components/Login/ForgotPassword.jsx` (line 7)

**Better approach**: Use environment variables in frontend:
```javascript
const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";
```

Then add `REACT_APP_BACKEND_URL` in Vercel environment variables.

## Step 5: Verify Deployment

### Test Backend API Endpoints

Use a tool like Postman or curl to test:

**1. Test Signup:**
```bash
curl -X POST https://your-vercel-deployment.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "buyer"
  }'
```

**2. Test Login:**
```bash
curl -X POST https://your-vercel-deployment.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Test Protected Endpoint (use token from login):**
```bash
curl -X GET https://your-vercel-deployment.vercel.app/api/orders/user/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Troubleshooting

### Backend Returns 500 Error
- Check Vercel logs: `vercel logs`
- Verify `FIREBASE_KEY` environment variable is set correctly
- Ensure the JSON is valid (no extra quotes or formatting)

### CORS Errors
- The backend includes CORS support with `origin: true`
- If issues persist, check browser console for specific CORS errors

### Firebase Admin SDK Errors
- Verify service account JSON has correct permissions
- Check Firebase project ID matches your configuration

### JWT Token Issues
- Ensure `JWT_SECRET` is set in Vercel environment variables
- Verify token is being sent in `Authorization: Bearer <token>` format

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Orders (Protected - Requires JWT Token)
- `GET /api/orders` - List all orders (admin only)
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get specific order
- `PUT /api/orders/[id]/status` - Update order status (seller/admin)
- `GET /api/orders/seller/list` - Get seller's orders
- `GET /api/orders/user/list` - Get user's orders

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `FIREBASE_KEY` to Git
- Keep your `JWT_SECRET` secure
- Use strong, random values for production
- Enable Firebase security rules for Firestore
- Consider adding rate limiting for production

## Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Add environment variables
3. ✅ Update frontend backend URL
4. ✅ Test all API endpoints
5. ✅ Deploy frontend changes
6. Configure custom domain (optional)
7. Set up monitoring and logging
