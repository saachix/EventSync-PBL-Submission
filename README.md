# EventSync

EventSync is an event registration and venue scheduling project. It includes a database-backed desktop application and a separate browser-based demonstration of the dashboard.

## Project parts

- **Application** — Python/Tkinter desktop application connected to a MySQL/MariaDB database.
- **EventSync-Web** — static HTML, CSS, and JavaScript dashboard deployed on Vercel.

## Desktop application

The desktop application manages events, sessions, venues, speakers, participants, registrations, waitlists, payments, attendance, certificates, and feedback.

The database uses a relational schema with 14 tables, primary and foreign keys, and integrity constraints. See the database scripts in the project files for the schema, sample data, and queries.

To run the desktop application, install Python and MySQL/MariaDB, set up the database using the provided SQL scripts, configure the local database connection, and run the application from the `Application` folder.

## Web demonstration

The web dashboard demonstrates event, session, participant, registration, attendance, payment, and certificate pages.

**Live website:** https://eventsync-web.vercel.app/

The web demo is a static site. It does not connect to the MySQL database. Changes are saved in the browser on the current device and do not sync with other users or devices.

## Technologies

- Python and Tkinter
- MySQL/MariaDB
- HTML, CSS, and JavaScript
- Vercel for the static web demo

## Project structure

- `Application/` — desktop application source code
- `EventSync-Web/` — browser-based dashboard files
