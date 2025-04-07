# Users API Documentation

## Overview

The Users API allows you to manage user accounts, including creating, retrieving, updating, and deleting user information.

## Endpoints

### Create User

**POST** `/users`

**Description:** Creates a new user.

**Request Body:**

```json
{
    "name": "string",
    "email": "string",
    "password": "string"
}
```

**Response:**

-   **201 Created**

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "token": "string"
}
```

---

### Get User

**GET** `/users/{id}`

**Description:** Retrieves details of a specific user.

**Path Parameters:**

-   `id` (string): The ID of the user.

**Response:**

-   **200 OK**

```json
{
    "id": "string",
    "name": "string",
    "email": "string"
}
```

---

### Get List of Users

**GET** `/users`

**Description:** Retrieves a list of all users.

**Query Parameters:**

-   `page` (integer, optional): The page number for paginated results.
-   `limit` (integer, optional): The number of users per page.

**Response:**

-   **200 OK**

```json
{
    "users": [
        {
            "id": "string",
            "name": "string",
            "email": "string"
        },
        {
            "id": "string",
            "name": "string",
            "email": "string"
        }
    ]
}
```

---

### Update User

**PUT** `/users/{id}`

**Description:** Updates information for a specific user.

**Headers:**

```
Authorization: Bearer <token>
```

**Path Parameters:**

-   `id` (string): The ID of the user.

**Request Body:**

```json
{
    "password": "string"
}
```

**Response:**

-   **200 OK**

```json
{
    "token": "string"
}
```

---

### Delete User

**DELETE** `/users/{id}`

**Description:** Deletes a specific user.

**Headers:**

```
Authorization: Bearer <token>
```

**Path Parameters:**

-   `id` (string): The ID of the user.

**Response:**

-   **204 No Content**
