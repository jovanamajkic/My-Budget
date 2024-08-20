# My Budget

This project is a web application for managing personal finances through accounts and transactions. It includes a backend built with Java Spring Boot and a frontend built with Angular.

## Prerequisites

Before you start, ensure you have met the following requirements:

- [Java JDK 17 or later](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- [Maven](https://maven.apache.org/download.cgi)
- [Node.js](https://nodejs.org/en/download/) (includes npm)
- [Angular CLI](https://github.com/angular/angular-cli) version 17.3.3.

## Backend (Java Spring Boot)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd your-repository-folder
   ```

2. Navigate to the backend directory:
   ```bash
   cd MyBudget-back
   ```

3. Build the project:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

5. The backend server should now be running on `http://localhost:8080`.

### Configuration

- Database configuration and other settings can be found in the `src/main/resources/application.properties` file.

## Frontend (Angular)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd MyBudget-front
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the Angular development server:
   ```bash
   ng serve
   ```

2. The frontend application should now be running on `http://localhost:4200`.

## Common Commands

- To build the frontend for production:
  ```bash
  ng build --prod
  ```

- To stop the Angular development server, press `Ctrl + C` in the terminal where `ng serve` is running.

- To stop the Spring Boot server, press `Ctrl + C` in the terminal where `mvn spring-boot:run` is running.

## Troubleshooting

- Ensure that both backend and frontend servers are running on different ports to avoid conflicts.

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues.

