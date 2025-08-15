# API Documentation

This documentation provides a detailed overview of the available API endpoints, including explanations, request examples, and response examples.

## Table of Contents

- [Authentication API (`/auth/`)](#authentication-api-auth)
- [Appointment API (`/appointment/`)](#appointment-api-appointment)
- [Materials API (`/materials/`)](#materials-api-materials)

---

## Authentication API (`/auth/`)

Handles user registration, login, logout, and management.

### 1. Register a New User

- **Endpoint:** `POST /auth/register/`
- **Description:** Creates a new user account. An activation email is sent to the provided email address. A medical history can be optionally created at the same time.
- **Permissions:** Allow anyone.

- **Request Body:**
  ```json
  {
      "email": "patient@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+963912345678",
      "dob": "1990-01-15",
      "gender": "M",
      "is_staff": false,
      "password": "a-very-strong-password",
      "medical_history": {
          "text": "Patient has a history of hypertension."
      }
  }
  ```

- **Success Response (`201 Created`):**
  ```json
  {
      "message": "Registration successful. Please check your email to activate your account."
  }
  ```

- **Error Response (`400 Bad Request`):**
  ```json
  {
      "email": [
          "user with this email already exists."
      ],
      "phone": [
          "The phone number entered is not valid."
      ]
  }
  ```

### 2. Activate User Account

- **Endpoint:** `GET /auth/activate/<user_id>&<confirmation_token>/`
- **Description:** Activates a user's account using the link sent to their email. This is not a typical JSON API endpoint but rather the link the user clicks.
- **Permissions:** Allow anyone.

- **Request:**
  The user clicks a link like: `https://yourdomain.com/auth/activate/123&abc-123-def-456/`

- **Success Response (`200 OK`):**
  ```json
  {
      "message": "Email successfully confirmed. Your account is now active."
  }
  ```

- **Error Response (`400 Bad Request`):**
  ```json
  {
      "message": "Token is invalid or expired."
  }
  ```

### 3. User Login

- **Endpoint:** `POST /auth/login/`
- **Description:** Authenticates a user and returns an authentication token.
- **Permissions:** Allow anyone.

- **Request Body:**
  ```json
  {
      "username": "patient@example.com",
      "password": "a-very-strong-password"
  }
  ```

- **Success Response (`200 OK`):**
  ```json
  {
      "expiry": "2025-08-25T10:00:00.000000Z",
      "token": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
      "user": {
          "id": 1,
          "email": "patient@example.com",
          "first_name": "John",
          "last_name": "Doe",
          "is_staff": false
      }
  }
  ```

### 4. User Logout

- **Endpoint:** `POST /auth/logout/`
- **Description:** Logs out the user by invalidating the provided token.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Success Response (`204 No Content`):**
  An empty response is returned on successful logout.

### 5. Change Password

- **Endpoint:** `POST /auth/password_change/`
- **Description:** Allows an authenticated user to change their password.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Request Body:**
  ```json
  {
      "current_password": "a-very-strong-password",
      "new_password": "a-new-stronger-password"
  }
  ```

- **Success Response (`200 OK`):**
  ```json
  {
      "message": "Password changed successfully."
  }
  ```

---

## Appointment API (`/appointment/`)

Handles creating and managing appointments and medical records.

### 1. Make an Appointment

- **Endpoint:** `POST /appointment/make_appointment/`
- **Description:** Allows an authenticated user to book a new appointment.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Request Body:**
  ```json
  {
      "chosen_date": "2025-09-20T14:00:00Z",
      "reason_of_appointment": "Annual check-up and cleaning."
  }
  ```

- **Success Response (`201 Created`):**
  ```json
  {
      "appointment_id": 5
  }
  ```

### 2. Get User's Appointments

- **Endpoint:** `GET /appointment/get_user_appointments/`
- **Description:** Retrieves a list of appointments for the authenticated user, grouped by date.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Success Response (`200 OK`):**
  ```json
  {
      "2025-09-20": [
          {
              "id": 5,
              "user": 1,
              "reason_of_appointment": "Annual check-up and cleaning.",
              "time": "14:00:00Z"
          }
      ],
      "2025-10-15": [
          {
              "id": 6,
              "user": 1,
              "reason_of_appointment": "Toothache.",
              "time": "10:30:00Z"
          }
      ]
  }
  ```

### 3. Get Unavailable Dates

- **Endpoint:** `GET /appointment/get_unavailable_dates/`
- **Description:** Retrieves a list of all booked appointment slots to help users find a vacant time.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Success Response (`200 OK`):**
  ```json
  {
      "2025-09-20": [
          "14:00:00Z",
          "15:00:00Z"
      ],
      "2025-09-21": [
          "11:00:00Z"
      ]
  }
  ```

### 4. Create a Medical Record

- **Endpoint:** `POST /appointment/record/`
- **Description:** Creates a medical record for a specific appointment, including notes and images.
- **Permissions:** Staff members only.
- **Request:** Requires `Authorization: Token <staff_user_token>` header.

- **Request Body:**
  ```json
  {
      "appointment": 5,
      "text_note": "Patient presented with mild plaque. No signs of cavities. Recommended regular flossing.",
      "images": [
          {
              "encoded_data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...",
              "mime_type": "image/jpeg"
          }
      ]
  }
  ```

- **Success Response (`201 Created`):**
  ```json
  {
      "record": {
          "id": 1,
          "appointment": 5,
          "text_note": "Patient presented with mild plaque. No signs of cavities. Recommended regular flossing."
      },
      "images": [
          {
              "id": 1,
              "record": 1,
              "mime_type": "image/jpeg",
              "image": "/media/records/image_name.jpg",
              "gemini_analysis": "Dental X-ray shows no significant bone loss or decay. Existing restoration on molar appears intact."
          }
      ],
      "message": "Record and images saved successfully."
  }
  ```

### 5. Get a Medical Record

- **Endpoint:** `GET /appointment/get_record/`
- **Description:** Retrieves the medical record and associated images for a given appointment ID.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Query Parameters:**
  - `appointment_id`: The ID of the appointment.
  - Example: `/appointment/get_record/?appointment_id=5`

- **Success Response (`200 OK`):**
  ```json
  {
      "record": {
          "id": 1,
          "appointment": 5,
          "text_note": "Patient presented with mild plaque. No signs of cavities. Recommended regular flossing."
      },
      "images": [
          {
              "id": 1,
              "record": 1,
              "mime_type": "image/jpeg",
              "image": "/media/records/image_name.jpg",
              "gemini_analysis": "Dental X-ray shows no significant bone loss or decay. Existing restoration on molar appears intact."
          }
      ]
  }
  ```

---

## Materials API (`/materials/`)

Provides CRUD operations for managing dental materials inventory.

### 1. List Materials

- **Endpoint:** `GET /materials/`
- **Description:** Retrieves a paginated list of all dental materials.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Success Response (`200 OK`):**
  ```json
  {
      "count": 25,
      "next": "https://yourdomain.com/materials/?page=2",
      "previous": null,
      "results": [
          {
              "id": 1,
              "name": "Composite Resin",
              "description": "A-type composite resin for fillings.",
              "quantity": 150.5,
              "price": "25.00"
          },
          {
              "id": 2,
              "name": "Amalgam",
              "description": "Dental amalgam for fillings.",
              "quantity": 500.0,
              "price": "15.50"
          }
      ]
  }
  ```

### 2. Create a Material

- **Endpoint:** `POST /materials/`
- **Description:** Adds a new material to the inventory.
- **Permissions:** Authenticated users only (typically staff).
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Request Body:**
  ```json
  {
      "name": "Dental Sealant",
      "description": "Protective sealant for molars.",
      "quantity": 100,
      "price": "30.00"
  }
  ```

- **Success Response (`201 Created`):**
  ```json
  {
      "id": 3,
      "name": "Dental Sealant",
      "description": "Protective sealant for molars.",
      "quantity": 100.0,
      "price": "30.00"
  }
  ```

### 3. Retrieve a Material

- **Endpoint:** `GET /materials/{id}/`
- **Description:** Retrieves the details of a specific material by its ID.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Success Response (`200 OK`):**
  ```json
  {
      "id": 1,
      "name": "Composite Resin",
      "description": "A-type composite resin for fillings.",
      "quantity": 150.5,
      "price": "25.00"
  }
  ```

### 4. Update a Material

- **Endpoint:** `PUT /materials/{id}/` or `PATCH /materials/{id}/`
- **Description:** Updates the details of an existing material. `PUT` requires all fields, while `PATCH` allows partial updates.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Request Body (`PATCH`):**
  ```json
  {
      "quantity": 140.0
  }
  ```

- **Success Response (`200 OK`):**
  ```json
  {
      "id": 1,
      "name": "Composite Resin",
      "description": "A-type composite resin for fillings.",
      "quantity": 140.0,
      "price": "25.00"
  }
  ```

### 5. Delete a Material

- **Endpoint:** `DELETE /materials/{id}/`
- **Description:** Deletes a material from the inventory.
- **Permissions:** Authenticated users only.
- **Request:** Requires `Authorization: Token <user_token>` header.

- **Success Response (`204 No Content`):**
  An empty response is returned on successful deletion.
