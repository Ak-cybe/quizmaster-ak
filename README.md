# 🧠 MakeAQuiz.in

> **Create & Play Interactive Quizzes Online** — A free, modern quiz platform built with React + TypeScript. Made in India 🇮🇳

[![Live Demo](https://img.shields.io/badge/Live-makeaquiz.in-6366f1?style=for-the-badge&logo=vercel)](https://makeaquiz.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)

---

## ✨ Features

- 🎯 **Create Custom Quizzes** — Build MCQ quizzes with multiple categories and difficulty levels
- 🎮 **Play Interactive Quizzes** — Smooth, animated quiz experience with instant feedback
- 📊 **Detailed Results** — Performance analytics with score breakdown and visual charts
- 🎨 **Beautiful UI** — Glassmorphism design, dark mode, smooth animations powered by Framer Motion
- 🎊 **Confetti Celebrations** — Celebrate perfect scores with particle effects
- 📱 **Fully Responsive** — Works flawlessly on desktop, tablet, and mobile
- ⚡ **Blazing Fast** — Built with Vite for instant HMR and optimized production builds

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Component Library |
| **Framer Motion** | Animations |
| **Recharts** | Data Visualization |
| **React Router** | Client-side Routing |
| **Vitest** | Testing |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ak-cybe/quizmaster-ak.git

# Navigate to project directory
cd quizmaster-ak

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory, ready for deployment.

---

## 📁 Project Structure

```
quizmaster-ak/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages
│   │   ├── LandingPage.tsx
│   │   ├── QuizHome.tsx
│   │   ├── QuizCreator.tsx
│   │   ├── QuizPlayer.tsx
│   │   └── QuizResults.tsx
│   ├── hooks/           # Custom React hooks
│   ├── data/            # Quiz data & categories
│   ├── types/           # TypeScript type definitions
│   ├── lib/             # Utility functions
│   ├── App.tsx          # Root component with routing
│   └── main.tsx         # Entry point
├── tests/               # Test files
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── package.json
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🌐 Deployment

This project outputs a static site via `npm run build`. Deploy the `dist/` folder to any static hosting:

- **Vercel** — Zero-config, just connect the GitHub repo
- **Netlify** — Drag & drop the `dist/` folder
- **GitHub Pages** — Use GitHub Actions for automated deployment
- **Firebase Hosting** — `firebase deploy`

---

## 👤 Author

**Amresh Singh** ([@Ak-cybe](https://github.com/Ak-cybe))

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## ⭐ Support

If you found this useful, give it a ⭐ on GitHub!
