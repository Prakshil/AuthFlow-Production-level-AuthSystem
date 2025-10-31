# Quick Admin Creation Commands

## For Production (After Deployment):

### Using PowerShell:
```powershell
$body = @{
    name = "Prakshil Patel"
    email = "prakshilmpatel@gmail.com"
    password = "123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-vercel-app-url.vercel.app/api/admin/create" -Method POST -Body $body -ContentType "application/json"
```

### Using curl:
```bash
curl -X POST https://your-vercel-app-url.vercel.app/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Prakshil Patel","email":"prakshilmpatel@gmail.com","password":"123456"}'
```

## Replace `your-vercel-app-url.vercel.app` with your actual Vercel URL!

## Response (Success):
```json
{
  "message": "Admin user created successfully!",
  "admin": {
    "id": "...",
    "email": "prakshilmpatel@gmail.com",
    "username": "Prakshil Patel",
    "role": "admin"
  }
}
```

## Then Login:
- Go to: https://your-vercel-app-url.vercel.app/login
- Email: prakshilmpatel@gmail.com
- Password: 123456

## Access Dashboard:
- After login, go to your profile
- Click "🛡️ Admin Dashboard"
- View all users!
