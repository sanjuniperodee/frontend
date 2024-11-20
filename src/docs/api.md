# API Documentation

## Authentication

### Login
```http
POST /api/auth/login
```

Request body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "user" | "admin"
  }
}
```

### Register
```http
POST /api/auth/register
```

Request body:
```json
{
  "username": "string",
  "password": "string"
}
```

## Markers

### Get All Markers
```http
GET /api/markers
```

Query parameters:
- `category` (optional): Filter by category
- `search` (optional): Search in title and description
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

### Create Marker
```http
POST /api/markers
```

Request body:
```json
{
  "title": "string",
  "description": "string",
  "latitude": number,
  "longitude": number,
  "category": "string"
}
```

### Update Marker
```http
PUT /api/markers/:id
```

Request body: Same as create

### Delete Marker
```http
DELETE /api/markers/:id
```

## Categories

### Get All Categories
```http
GET /api/categories
```

### Create Category (Admin only)
```http
POST /api/categories
```

Request body:
```json
{
  "name": "string",
  "icon": "string"
}
```

## Error Responses

All endpoints may return these error responses:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Rate Limiting

API requests are limited to:
- 100 requests per 15 minutes per IP
- 5 login attempts per hour per IP

## Authentication

All endpoints except login and register require authentication via Bearer token:

```http
Authorization: Bearer <token>
```