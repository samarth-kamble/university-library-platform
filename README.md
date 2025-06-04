<div align="center">
    <br />
    <a href="https://github.com/samarth-kamble" target="_blank">
      <img src="https://github.com/user-attachments/assets/4a161355-1529-4155-bcd9-226b7ef9b0db" alt="Project Banner">
    </a>
    <br />

<div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="next.js" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-PostgreSQL-black?style=for-the-badge&logoColor=white&logo=postgresql&color=4169E1" alt="postgresql" />
    <img src="https://img.shields.io/badge/-Upstash-black?style=for-the-badge&logoColor=white&logo=upstash&color=00E9A3" alt="upstash" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
</div>

  <h3 align="center">A University Library Management System with Admin Panel</h3>

   <div align="center">
     Build this project step by step with our detailed tutorial on <a href="https://www.youtube.com/@javascriptmastery/videos" target="_blank"><b>JavaScript Mastery</b></a> YouTube. Join the JSM family!
    </div>

</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>

Built with Next.js, TypeScript, and Postgres, the University Library Management System is a production-grade platform featuring a public-facing app and an admin interface. It offers advanced functionalities like seamless book borrowing with reminders and receipts, robust user management, automated workflows, and a modern, optimized tech stack for real-world scalability.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- PostgreSQL
- Upstash
- ImageKit
- TypeScript
- Nodemailer
- Tailwind CSS

## <a name="features">🔋 Features</a>

### Features of the University Library Management System Project

### 🔐 Authentication & Onboarding

- ✨ **Open-source Authentication**: Personalized onboarding flow with secure login and email notifications.
- 📧 **Onboarding Workflows**: Automated welcome emails upon signup, with follow-up emails based on activity or inactivity.
- 🔒 **NextAuth Integration**: Robust authentication using NextAuth for secure session handling.

### 🏠 Home Page

- 📚 **Featured Books**: Highlighted books and newly added titles.
- 🌀 **Interactive UI**: Beautiful 3D effects for enhanced user experience.

### 📖 Library Management

- 🔍 **Library Page**: Advanced filtering, full-text search, and pagination for easy book discovery.
- 📄 **Book Detail Pages**: Availability tracking, book summaries, related videos, and recommendations.
- 📘 **All Books Page**: View and manage the complete library catalog with advanced search and filters.
- 🧾 **Book Management Forms**: Add new books or edit existing ones seamlessly.
- 🗂️ **Admin Book View**: Detailed book information panel for administrators.

### 👤 User Profile & Role Management

- 🙍‍♂️ **Profile Page**: Manage user account, view borrowed books, and download receipts.
- 🔧 **Role Management**: Modify user roles and promote to admin; email sent upon updates.
- 🧑‍🤝‍🧑 **All Users Page**: View, manage, and moderate all user accounts.
- 📨 **Account Requests**: Admin approval system for new user registrations with verification emails.

### 📚 Borrowing System

- 🛎️ **Reminders**: Email notifications sent before, on, and after the due date to return books or avoid late fees.
- 🧾 **Borrow Receipt**: Automatically generate customized PDF receipts when a book is borrowed.
- 📋 **Borrow Records**: Track full borrowing history with search and pagination.

### 📊 Admin Dashboard & Analytics

- 📈 **Dashboard**: Visual statistics on new users, books, borrow activities, and more.

### ⚙️ Advanced Functionalities

- 🚦 **Security**: Rate limiting and DDoS protection for safe usage.
- 🧠 **Smart Caching**: Performance optimization using **Upstash Redis**.
- 🔔 **Custom Notifications**: Send tailored notifications for user events.
- 🖼️ **Real-time Media Optimization**: Image and video processing powered by **ImageKit**.

### 🛠️ Tech Stack & Infrastructure

- 🧩 **Framework**: Built with **Next.js** and **TypeScript**.
- 🎨 **Modern UI**: Crafted using **Tailwind CSS**, **ShadCN**, and cutting-edge UI libraries.
- 🛢️ **Database**: PostgreSQL with **Neon** for scalable and collaborative cloud storage.
- 🧰 **ORM**: Clean and efficient database interaction via **Drizzle ORM**.
- 💌 **Email Services**: Automated communications with **Resend**.

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/samarth-kamble/university-library-platform.git
cd university-library-platform
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env.local` in the root of your project and add the following content:

```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=

NEXT_PUBLIC_API_ENDPOINT=
NEXT_PUBLIC_PROD_API_ENDPOINT=

DATABASE_URL=

UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

AUTH_SECRET=

# Required for workflow
QSTASH_URL=
QSTASH_TOKEN=

# NODEMAIALER
SMTP_HOST=
SMTP_PORT=
SMTP_SERVICE=
SMTP_USER=
SMTP_PASSWORD=

```

Replace the placeholder values with your actual ImageKit, NeonDB, Upstash, and Resend credentials. You can obtain these credentials by signing up on the [ImageKit](https://imagekit.io/), [NeonDB](https://fyi.neon.tech/1jsm), [Upstash](https://upstash.com/?utm_source=jsmastery1), and [Resend](https://resend.com/).

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.
