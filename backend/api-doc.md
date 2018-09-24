# Foodie Connector API Doc

Generated at 2018-09-24 18:44:24

## **authentication**

Everything about authentication

### **POST - /api/v1/auth/login**

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
    "api_token": "ZmY4ZDUyZDMyZGZhYjk0MmRjM2M1NmZjZGVmMGYwMDk0ZGUzOWJmOTU5NmRiZTdlMWFiMWZkNTdhOTUzZWYyNTE=",
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "user@foodie-connector.delivery",
        "email_verified_at": null,
        "created_at": "2018-09-24 18:44:23",
        "updated_at": "2018-09-24 18:44:23"
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

### **POST - /api/v1/auth/register**

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
    "api_token": "ZDgzNTllZTQzMWNlMzJjY2YwMmU3OTc4ZmVmYTE0MGFjMjkyZDZjNDgxZjE5Y2E5ZGE3MWMwMzljYWE3Y2Q2ODE=",
    "user": {
        "id": 1,
        "name": "Test User",
        "email": "user@foodie-connector.delivery",
        "email_verified_at": null,
        "created_at": "2018-09-24 18:44:23",
        "updated_at": "2018-09-24 18:44:23"
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

### **POST - /api/v1/auth/reset-password-email**

Send email containing password reset link

#### Status Code: 200

Successful operation

Request:
```
{
    "email": "user@foodie-connector.delivery"
}
```

Response:
```
[]
```
#### Status Code: 404

We can&#039;t find a user with that e-mail address.

Request:
```
{
    "email": "wrong@foodie-connector.delivery"
}
```

Response:
```
{
    "message": "We can't find a user with that e-mail address."
}
```
#### Status Code: 422

Validation failed.

Request:
```
{
    "email": "not_email"
}
```

Response:
```
{
    "message": "Validation failed.",
    "information": {
        "email": [
            "The email must be a valid email address."
        ]
    }
}
```

