# Tasks

A simple task manager/note-taking application built using React + TypeScript.

## Features

- Authentication with Firebase
- The data is stored in Firestore
- Functional components with hooks
- The routing is done with React Router
- Used some components from React Bootstrap
- The notes/tasks and categories are stored per user
- This project was bootstrapped with [Vite](https://github.com/vitejs/vite)

## Setup

To clone the project and install the dependencies:

```code
git clone https://github.com/georgelyn/react-tasks.git
cd react-tasks
npm install
```

Since this project uses Firebase and Firestore, you'll need to provide your own credentials. To do that, you must create a .env file in the root directory with the following keys:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Start the application:

```code
npm start
```

You can access it by going to [http://localhost:3000/](http://localhost:3000/)

## Screenshots

![Login page](https://i.imgur.com/kEpcDcW.png)

![Home page](https://i.imgur.com/mQFCK1z.png)

![Home page - Filter](https://i.imgur.com/jnM2kfy.png)

![Task page](https://i.imgur.com/z5LPM03.png)
