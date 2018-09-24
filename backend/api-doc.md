# Foodie Connector API Doc

Generated at 2018-09-24 13:41:34

## **authentication**

Everything about authentication

### **POST - /api/user/login**

Login

#### Status Code: 200

Successful operation

Request:
```
{
    "email": "user@foodie-connector.delivery",
    "password": "test123456"
}
```

Response:
```
{
    "api_token": "OTMzNDI2OGE4MzhiYWM5NDFjZDliMzAwZjI0YWQxNWQxMDZjODFhOWI1YmFhMTM0YzhlZGY5ZDllOTgxOWJjNjE=",
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "user@foodie-connector.delivery",
        "email_verified_at": null,
        "created_at": "2018-09-24 13:41:34",
        "updated_at": "2018-09-24 13:41:34"
    }
}
```
#### Status Code: 401

These credentials do not match our records.

Request:
```
{
    "email": "wrong@foodie-connector.delivery",
    "password": "test123456"
}
```

Response:
```
{
    "message": "These credentials do not match our records."
}
```
#### Status Code: 422

Validation failed.

Request:
```
{
    "email": "user@foodie-connector.delivery"
}
```

Response:
```
{
    "message": "Validation failed.",
    "information": {
        "password": [
            "The password field is required."
        ]
    }
}
```
#### Status Code: 429

Too many attempts

Request:
```
{
    "email": "user@foodie-connector.delivery",
    "password": "test123456"
}
```

Response:
```
{
    "message": "Too many attempts",
    "information": {
        "available_seconds": 60
    }
}
```

### **POST - /api/user/register**

Register for a new user

#### Status Code: 200

Successful operation

Request:
```
{
    "email": "user@foodie-connector.delivery",
    "password": "test123456",
    "name": "Test User"
}
```

Response:
```
{
    "api_token": "NjM5ZDFmZmFmZGY5ZDg0NTc3NzcwZDYxNzRkNDEzMTk0Njc1MjEwYzVmMDc4ZWZmYzYxZWI5OGRiMGYzNDY4YzE=",
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "user@foodie-connector.delivery",
        "email_verified_at": null,
        "created_at": "2018-09-24 13:41:34",
        "updated_at": "2018-09-24 13:41:34"
    }
}
```
#### Status Code: 409

The email has already been taken.

Request:
```
{
    "email": "user@foodie-connector.delivery",
    "password": "test123456",
    "name": "Test User"
}
```

Response:
```
{
    "message": "The email has already been taken."
}
```
#### Status Code: 422

Validation failed.

Request:
```
{
    "email": "user@foodie-connector.delivery",
    "password": "short",
    "name": "Test User"
}
```

Response:
```
{
    "message": "Validation failed.",
    "information": {
        "password": [
            "The password must be at least 6 characters."
        ]
    }
}
```

