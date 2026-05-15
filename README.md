# AI Quiz Battle

AI Quiz Battle is a full-stack web application that leverages Google's Gemini AI to dynamically generate quizzes on any topic. It features a modern, responsive user interface built with React and Tailwind CSS, and a robust backend powered by Node.js, Express, and MongoDB.

## Features

- **Dynamic Quiz Generation**: Powered by the Gemini AI API, users can generate custom quizzes by simply specifying a topic and difficulty.
- **Interactive UI**: A beautiful, animated frontend built with React, Framer Motion, and Tailwind CSS.
- **Game History**: Tracks past games, scores, and performance using MongoDB for persistent storage.
- **Sound Effects**: Immersive audio feedback for correct/incorrect answers and UI interactions.

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion (Animations)
- React Router DOM (Routing)
- Lucide React (Icons)

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Google Generative AI SDK (`@google/generative-ai`)
- Zod (Schema Validation)
- dotenv (Environment Variables)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ai-quiz-battle
   ```

2. Setup Backend:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGODB_URI=your_mongodb_connection_string
   ```
   *Note: If you don't provide a `MONGODB_URI`, the backend can fallback to `mongodb-memory-server` for development.*

3. Setup Frontend:
   ```bash
   cd ../frontend
   npm install
   ```
   *(Ensure the frontend is configured to point to your backend API URL, usually `http://localhost:5000` during development)*

### Running the App

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

## License

MIT License
