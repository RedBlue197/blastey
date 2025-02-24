# Backend Documentation

## Overview

The backend is built using FastAPI, a modern, high-performance, Python web framework for building APIs. It uses PostgreSQL as the database.

## Architecture

The backend follows a layered architecture:

*   **Routers (Controllers):** Define the API endpoints and handle incoming requests. They use dependencies for authentication, authorization, and database access.
*   **Services:** Contain the business logic of the application. They interact with the database through interfaces.
*   **Interfaces:** Define abstract methods for interacting with the database models. This allows for easier testing and decoupling of the application.
*   **Models:** Represent the database tables as Python classes using SQLAlchemy.
*   **Schemas:** Define the data structures for request and response bodies using Pydantic.
*   **Middleware:** Handle cross-cutting concerns such as logging, decryption, and database session management.

## Endpoints

The API endpoints are defined in the `routers` directory. There are two main categories of routers:

*   `frontoffice`: These endpoints are exposed to the frontend and are used by users of the application.
    *   `v1`: Contains the first version of the API endpoints.
        *   `anonymous`: Endpoints that can be accessed without authentication.
        *   `professional`: Endpoints that can be accessed by professional users.
        *   `user`: Endpoints that can be accessed by authenticated users.
    *   `v2`: (Currently empty) Intended for future versions of the API.
*   `backoffice`: (Currently empty) Intended for administrative endpoints.

Here's a summary of the key endpoints:

*   `/core/frontoffice/v1/activities`: Manages activities.
*   `/core/frontoffice/v1/auth`: Handles authentication (login).
*   `/core/frontoffice/v1/bookings`: Manages bookings.
*   `/core/frontoffice/v1/cities`: Manages cities.
*   `/core/frontoffice/v1/newsletters`: Manages newsletter subscriptions.
*   `/core/frontoffice/v1/trips`: Manages trips.
*   `/core/frontoffice/v1/users`: Manages users.

## Database

The database is PostgreSQL, accessed using SQLAlchemy. The database models are defined in the `models` directory.

### Table Relationships

The following describes the relationships between the key database tables:

*   **Users:**
    *   One-to-many relationship with `Trip` (as `host_id`): A user can host multiple trips.
    *   One-to-many relationship with `Booking` (as `client_id` and `host_id`): A user can make multiple bookings as a client and can be the host for multiple bookings.
    *   One-to-many relationship with `Rating` (as `traveler_id` and `client_id`): A user can give and receive multiple ratings.
    *   One-to-many relationship with `Activity` (as `user_id`): A user can create multiple activities.
    *   One-to-one relationship with `UserDetails`: Each user has one set of user details.
    *   One-to-many relationship with `VerificationCode`: A user can have multiple verification codes (although only one should be active at a time).
*   **Trips:**
    *   One-to-many relationship with `TripItem`: A trip can have multiple trip items.
    *   One-to-many relationship with `TripOpening`: A trip can have multiple trip openings.
    *   One-to-many relationship with `TripImage`: A trip can have multiple images.
    *   One-to-many relationship with `TripRating`: A trip can have multiple ratings.
    *   Many-to-one relationship with `User` (as `host_id`): Each trip is hosted by one user.
*   **Activities:**
    *   One-to-many relationship with `ActivityItem`: An activity can have multiple activity items.
    *   One-to-many relationship with `ActivityRating`: An activity can have multiple ratings.
    *   Many-to-one relationship with `User` (as `user_id`): Each activity is created by one user.
*   **Bookings:**
    *   One-to-many relationship with `BookingItem`: A booking can have multiple booking items.
    *   Many-to-one relationship with `User` (as `client_id` and `host_id`): Each booking has one client and one host.
    *   One-to-many relationship with `Payment`: A booking can have multiple payments.
*   **TripOpenings:**
    *   One-to-many relationship with `TripOpeningItem`: A trip opening can have multiple trip opening items.

## Important Subjects

*   **Authentication and Authorization:** Authentication is handled using JWT tokens. The `auth_dependency.py` file defines dependencies for verifying tokens and extracting user information. Role-based authorization is implemented using the `role_dependency.py` file.
*   **Data Validation:** Pydantic schemas are used to validate request and response bodies.
*   **Error Handling:** The `utils/responses.py` file defines a consistent API response format for handling errors.
*   **Middleware:** Middleware is used to handle cross-cutting concerns such as logging, decryption, and database session management.
*   **Dependency Injection:** FastAPI's dependency injection system is used to provide dependencies such as database sessions and user authentication.
