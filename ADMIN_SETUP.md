# 🛡️ Admin Setup Guide

## Create Your Admin Account

After deployment, follow these steps to create your admin account:

### Step 1: Create Admin User

Use any API testing tool (Postman, Thunder Client, or curl) to make a POST request:

**Endpoint:** `https://your-app.vercel.app/api/admin/create`

**Method:** POST

**Body (JSON):**
```json
{
  "name": "Prakshil Patel",
  "email": "prakshilmpatel@gmail.com",
  "password": "123456"
}
```

**Using curl:**
```bash
curl -X POST https://your-app.vercel.app/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Prakshil Patel",
    "email": "prakshilmpatel@gmail.com",
    "password": "123456"
  }'
```

**Using PowerShell:**
```powershell
$body = @{
    name = "Prakshil Patel"
    email = "prakshilmpatel@gmail.com"
    password = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-app.vercel.app/api/admin/create" -Method POST -Body $body -ContentType "application/json"
```

### Step 2: Login as Admin

1. Go to your app's login page
2. Enter:
   - **Email:** prakshilmpatel@gmail.com
   - **Password:** 123456
3. Click "Sign In"

### Step 3: Access Admin Dashboard

Once logged in:
1. You'll be redirected to your profile
2. You'll see a special "🛡️ Admin Dashboard" section (only visible to admins)
3. Click it to access the admin dashboard

---

## 🎯 Admin Dashboard Features

### Overview Statistics
- **Total Users:** See the total number of registered users
- **Verified Users:** Count of email-verified accounts
- **Unverified Users:** Users pending email verification
- **Admin Count:** Number of admin accounts
- **Regular Users:** Number of standard user accounts

### User Management
- **Search:** Find users by name or email
- **Filter by Role:** View only admins or regular users
- **Filter by Status:** Show verified or unverified accounts
- **User Details:** See complete user information including:
  - Username and email
  - Role (Admin/User)
  - Verification status
  - Join date

### User Table Columns
1. **User:** Avatar and username
2. **Email:** User's email address
3. **Role:** Badge showing Admin or User
4. **Status:** Verified/Unverified badge
5. **Joined:** Account creation date

---

## 🔒 Security Features

- ✅ **Protected Routes:** Only logged-in admins can access the dashboard
- ✅ **JWT Authentication:** Secure token-based access control
- ✅ **Auto-verified Admin:** Admin account is automatically verified
- ✅ **No Password Storage:** Passwords are bcrypt hashed

---

## 📝 Important Notes

1. **Delete the Create Endpoint:** After creating your admin account, you should delete the `/api/admin/create/route.ts` file for security
2. **Change Password:** After first login, consider changing your password
3. **Production Security:** The password "123456" is just for initial setup - change it immediately!

---

## 🎨 Theme

The admin dashboard follows your dark theme with:
- Glass morphism effects
- Smooth animations
- Responsive design
- Color-coded status badges
- Interactive hover effects

Enjoy your admin powers! 🚀
