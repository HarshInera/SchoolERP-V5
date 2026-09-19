# SchoolERP V5

SchoolERP V5 is a desktop school management application I'm building to make everyday school administration simpler.

The goal is to keep common tasks like managing students, fees, attendance, exams, results, payments, and reports in one place, while still being able to work without an internet connection.

## Features

- Student management
- Class and section management
- Subject management
- Fee collection and fee records
- Payment management
- Student attendance
- Exams and results
- Reports and printing
- School settings
- Admin and security settings
- Offline data storage
- SQLite database
- Software licensing

## Built With

- Electron
- JavaScript
- Node.js
- SQLite
- HTML
- CSS

## Getting Started

If you want to run the project locally, make sure you have Node.js and npm installed.

### 1. Clone the repository

```bash
git clone https://github.com/HarshInera/SchoolERP-V5.git

### 2. Go to the project folder
cd SchoolERP-V5
### 3. Install dependencies
npm install
### 4. Start the application
npm start
Building the Application
To create a Windows build, run:
npm run build

The generated build files will be available in the dist folder.

Why SQLite?

SchoolERP is designed to work offline, so it uses SQLite for local data storage.

This means the application doesn't need a separate database server and can be used on a local computer without an internet connection.

Project Structure

The project is built as an Electron desktop application.

SchoolERP V5
├── main.js
├── preload.js
├── database.js
├── index.html
├── license.js
├── license.html
├── package.json
└── package-lock.json
Project Status

SchoolERP V5 is actively being developed.

The core parts of the application are already working, and I'm continuing to improve the application, add new features, fix issues, and refine the overall user experience.

What's Next?

There are several things I would like to work on as the project grows:

Better reports and analytics
Improved UI and user experience
More automation
Online synchronization
Payment integrations
Communication features
Support for different types of educational institutions
More tools for administration and reporting
Contributing

This project is currently being developed as a personal project.

Suggestions, ideas, and feedback are always welcome.

Author

Harsh Vyas

GitHub: https://github.com/HarshInera

Thanks for checking out SchoolERP V5! 👋
