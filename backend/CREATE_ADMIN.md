# Create Admin Account

## Method 1: Using API Endpoint (Easiest)

Make sure your backend server is running (`npm run dev` in the backend folder), then use one of these methods:

### Using cURL:
```bash
curl -X POST http://localhost:5001/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@eversol.com",
    "password": "Admin@123"
  }'
```

### Using Postman or Thunder Client:
- **Method**: POST
- **URL**: `http://localhost:5001/api/auth/admin/register`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
```json
{
  "name": "Admin User",
  "email": "admin@eversol.com",
  "password": "Admin@123"
}
```

## Method 2: Using the Script

Run the create-admin script:

```bash
cd backend
node scripts/create-admin.js
```

## Default Admin Credentials (after creation):

**Email**: `admin@eversol.com`  
**Password**: `Admin@123`

⚠️ **Important**: Change the password after first login!

## Login

After creating the admin account, go to:
- **URL**: `http://localhost:3000/login`
- Enter the email and password above
- You'll be automatically redirected to the admin dashboard at `/admin`

