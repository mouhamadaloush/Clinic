# Clinic Backend API

This is the backend API for the Clinic application, a comprehensive system for managing patient information, appointments, and dental materials. It is built with Django and Django REST Framework, providing a robust and scalable solution for clinic management.

## Features

-   **User Authentication**: Secure user registration with email verification, login, and password management.
-   **Appointment Scheduling**: Patients can book, view, and cancel their appointments.
-   **Medical Records**: Staff can create and manage patient medical records, including text notes and dental X-ray images.
-   **AI-Powered Image Analysis**: Dental X-ray images are automatically analyzed using Google's Gemini API to provide dentists with quick insights.
-   **Materials Management**: A complete CRUD interface for managing the inventory of dental materials.
-   **Role-Based Access Control**: Differentiates between regular users (patients) and staff, ensuring that sensitive operations are restricted to authorized personnel.

## Technologies Used

-   **Backend**: Django, Django REST Framework
-   **Authentication**: Knox for token-based authentication
-   **Database**: SQLite (default, configurable)
-   **Image Analysis**: Google Gemini API
-   **Email**: Django's email functionality for user notifications.

## API Endpoints

### User Authentication (`/api/auth/`)

-   `POST /api/auth/register/`: Register a new user.
-   `GET /api/auth/activate/`: Activate a user account with a token sent via email.
-   `POST /api/auth/login/`: Log in a user and receive an authentication token.
-   `POST /api/auth/password_change/`: Change the password for an authenticated user.
-   `GET /api/auth/`: List all active users (staff only).
-   `GET /api/auth/{id}/`: Retrieve a specific user by ID (staff only).
-   `DELETE /api/auth/delete/`: Delete a user by ID (staff only).

### Appointments (`/api/appointment/`)

-   `POST /api/appointment/make_appointment/`: Create a new appointment.
-   `GET /api/appointment/get_user_appointments/`: Get all appointments for the authenticated user.
-   `GET /api/appointment/get_unavailable_dates/`: Get a list of dates that are already booked.
-   `GET /api/appointment/list_appointments/`: List all upcoming appointments (staff only).
-   `DELETE /api/appointment/delete/`: Delete an appointment by ID.
-   `POST /api/appointment/record/`: Create a medical record for an appointment (staff only).
-   `GET /api/appointment/get_record/`: Get the medical record for a specific appointment.
-   `GET /api/appointment/list_all_appointments/`: List all appointments in the system (staff only).

### Materials (`/api/materials/`)

-   `GET /api/materials/`: List all materials with pagination.
-   `POST /api/materials/`: Create a new material.
-   `GET /api/materials/{id}/`: Retrieve a specific material by ID.
-   `PUT /api/materials/{id}/`: Update a material.
-   `PATCH /api/materials/{id}/`: Partially update a material.
-   `DELETE /api/materials/{id}/`: Delete a material.

## Database Models

### User Authentication

-   **User**: Extends Django's `AbstractUser` with fields like `email`, `phone`, `gender`, etc.
-   **MedicalHistory**: A one-to-one relationship with the `User` model to store their medical history.

### Appointments

-   **Appointment**: Stores information about each appointment, linked to a user.
-   **Record**: A one-to-one relationship with `Appointment` to store medical notes.
-   **RecordImage**: Stores base64-encoded dental X-ray images, linked to a `Record`, along with the Gemini API analysis.

### Materials

-   **Material**: Represents a dental material with `name`, `description`, `quantity`, and `price`.

## Setup and Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Create a virtual environment and activate it**:
    ```bash
    python -m venv venv
    source venv/bin/activate
    ```

3.  **Install the dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables**:
    Create a `.env` file in the `core` directory and add the following:
    ```
    GEMINI_API_KEY=<your_gemini_api_key>
    EMAIL_HOST_USER=<your_email>
    EMAIL_HOST_PASSWORD=<your_email_password>
    ```

5.  **Run database migrations**:
    ```bash
    python manage.py migrate
    ```

6.  **Run the development server**:
    ```bash
    python manage.py runserver
    ```

The API will be available at `http://127.0.0.1:8000`.
