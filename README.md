<div align="center">
  <h1>🧠 AI Quiz Battle ⚔️</h1>
  <p><strong>A dynamic, AI-powered quiz application built with the MERN stack and Google Gemini AI.</strong></p>

  <!-- Tech Stack Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue" alt="Framer Motion" />
  </p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" alt="Google Gemini" />
  </p>
</div>

<br />

## 📖 Description

**AI Quiz Battle** is an innovative, full-stack web application designed to test your knowledge on *any* subject imaginable. By leveraging the advanced capabilities of Google's Gemini AI, the application dynamically generates unique, engaging quizzes tailored to the user's chosen topic and difficulty level. 

Whether you want to learn something new or challenge your existing expertise, AI Quiz Battle provides an immersive and interactive learning experience with a beautiful, modern UI.

### 🏷️ Recommended GitHub Tags / Topics
When publishing this repository to GitHub, consider adding these topics in your repository settings to increase discoverability:
`ai` `quiz` `react` `nodejs` `mongodb` `gemini-api` `framer-motion` `tailwind-css` `fullstack` `education-tech`

---

## ✨ Key Features

- 🤖 **Dynamic Quiz Generation:** Say goodbye to static question banks. Input any topic, and the Gemini AI instantly crafts a fresh set of questions and answers.
- 🎨 **Interactive & Stunning UI:** Built with React and styled with Tailwind CSS, featuring smooth, professional animations powered by Framer Motion.
- 💾 **Persistent Game History:** Your progress, scores, and past game details are securely stored using MongoDB, allowing you to track your learning journey.
- 🔊 **Immersive Audio Experience:** Interactive sound effects for correct/incorrect answers and UI interactions keep the user engaged.
- 📱 **Fully Responsive:** Play seamlessly on your desktop, tablet, or mobile device.

---

## 💻 Tech Stack Deep Dive

### Frontend 🎨
- **React 18:** Component-based UI rendering.
- **Vite:** Blazing fast build tool and development server.
- **Tailwind CSS:** Utility-first styling for rapid UI development.
- **Framer Motion:** Declarative animations for a premium feel.
- **React Router DOM:** Client-side routing for seamless navigation.
- **Lucide React:** Beautiful, consistent icon set.

### Backend ⚙️
- **Node.js & Express:** Scalable RESTful API architecture.
- **MongoDB & Mongoose:** NoSQL database for flexible and persistent data storage.
- **Google Generative AI SDK:** Integration with the Gemini model for content generation.
- **Zod:** Robust schema validation for API requests.
- **Dotenv:** Secure environment variable management.

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-quiz-battle
```

### 2. Setup Backend
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your credentials:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
```
> **Note:** If you don't provide a `MONGODB_URI`, the backend can fallback to `mongodb-memory-server` for development purposes.

Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
> *(Ensure the frontend is configured to point to your backend API URL, which defaults to `http://localhost:5000`)*

Start the frontend development server:
```bash
npm run dev
```

### 4. Play! 🎉
Open your browser and navigate to [http://localhost:5173](http://localhost:5173).

---

## 📸 Screenshots
*(Pro-tip: Add screenshots of your application to a `docs/` folder and uncomment the lines below to make the README even more impressive!)*

<!--
- **Home Screen:** <br/> <img src="./docs/home.png" alt="Home Screen" width="600"/>
- **Gameplay:** <br/> <img src="./docs/gameplay.png" alt="Gameplay" width="600"/>
- **History Page:** <br/> <img src="./docs/history.png" alt="History" width="600"/>
-->

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
