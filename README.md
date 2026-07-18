# CampusCompass

A simple college-enquiry website built with Spring Boot and React. Students can register, log in, search colleges, and view courses, fees, hostel facilities, placements, and a small help chatbot.

## Run it (no Maven needed)

1. Install Node.js if it is not already available. Java 24 is needed.
2. In `backend`, double-click `run-backend.bat`. It downloads Gradle automatically on its first run, then starts Spring Boot.
3. From the main project folder, run `npm.cmd install` and then `npm.cmd run dev`.
4. Open the local address displayed by the frontend (normally `http://localhost:5173`).

User accounts are stored in MySQL. Before starting the backend, set `DB_PASSWORD` in the terminal to your MySQL password; this value is never stored in the project files.
