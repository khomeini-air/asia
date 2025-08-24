# Project: asia - Automated Evaluation System

This project is a full-stack web application designed to automate the process of giving and evaluating technical tasks for job applicants.

## Tech Stack

- **Backend**: Spring Boot 3, Java 17
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker
- Docker Compose

## How to Run

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd asia
    ```

2.  **Build and run the application using Docker Compose:**
    ```sh
    docker-compose up --build
    ```

    - You can remove `--build` flag for the subsequent requests.

3.  **Access the application:**
    - **Frontend (Admin Portal)**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
    - **Backend API**: [http://localhost:8080/api/](http://localhost:8080/api)

## Admin Login Credentials

A simple hard-coded login is used for the admin portal:

- **Username**: `admin`
- **Password**: `password`

## Database Access (Optional)

You can connect to the PostgreSQL database directly using a client like pgAdmin with the following credentials:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `asia_db`
- **Username**: `admin`
- **Password**: `password`