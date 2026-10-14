# EventSync web demo

This is a simple HTML, CSS, and JavaScript version of EventSync. It runs as a static website and does not need TiDB, a server, API keys, or database credentials.

## Try it on your computer

Open `index.html` in a browser. Use the sidebar to open Events, Sessions, Participants, Registration, Attendance, Payments, or Certificates. You can add, edit, search, and delete records. Registration records are added to the waitlist when an event has reached its capacity.

The starting records are examples. Your changes are saved in the current browser on the current device using local storage. They do not sync to other people or devices. Use **Reset sample data** on the Dashboard to restore the original examples.

## Deploy on Vercel

1. Sign in to Vercel and choose **Add New… → Project**.
2. Import the GitHub repository where you uploaded these files. (The repository root should contain `index.html`, `styles.css`, and `app.js`.)
3. For a static site, leave the framework preset as **Other**. Leave the build command and output directory empty.
4. Select **Deploy** and wait for Vercel to show the website link.

You can also use Vercel's manual upload flow if it is available in your account: upload the folder containing `index.html`, `styles.css`, and `app.js`.

## Files

- `index.html` — page structure
- `styles.css` — dashboard styling
- `app.js` — dashboard interactions and sample records

There are no environment variables to set for this browser-only demo.
