:

🗣️ Project Vaani – AI-Powered Digital Companion
Project Vaani is a voice-first AI digital companion built to help digitally inexperienced and multilingual Indian citizens access government welfare schemes with ease. It simplifies complex bureaucratic processes into natural, spoken conversations.

📌 Table of Contents
🎯 Project Aim & Vision

🔁 Complete Technical Workflow

🧰 Tech Stack

⚙️ Getting Started

📦 Prerequisites

📥 Installation

🔐 Environment Variables

🚀 Running the Application

📁 Project Structure

🎯 Project Aim & Vision
Aim: Build Project Vaani – a voice-first AI companion enabling easy access to government schemes for all citizens, especially those with limited digital skills.

Vision: Ensure inclusive access where anyone—regardless of language or tech literacy—can understand, apply for, and benefit from government support simply through voice.

🔁 Complete Technical Workflow
This outlines the complete process from user speech to audio reply:

User Interface (React + Vite)
Mobile-responsive web app launches and prompts user to choose a language (e.g., English or Hindi).

Voice Input (Frontend)
User speaks. Browser uses MediaRecorder API to capture audio.

Speech-to-English Translation (Groq Whisper)
Backend sends audio to Groq’s Whisper /translations API → gets English text.

Core Logic Processing (External API)
English text sent to:
https://adityachanna04-project.onrender.com/chat → gets English response.

Translation to Native Language (Groq LLM)
If original input was Hindi → Groq LLaMA3 model translates response back to Hindi.

Text-to-Speech (ElevenLabs API)
Final response is converted to audio using language-specific voices.

Frontend Delivery
JSON with response text, audio URL, and transcription is sent to frontend → user hears response.

🧰 Tech Stack
🖥️ Frontend
React (with Vite)

JavaScript

🛠️ Backend
Node.js

Express.js

🎙️ AI & Audio Services
Speech-to-Text: Groq Whisper (whisper-large-v3)

Logic + Translation: Groq LLaMA3

Text-to-Speech: ElevenLabs API

⚙️ Getting Started
📦 Prerequisites
Node.js v18+

npm (or Yarn)

📥 Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/JastejS28/Project_Vaani.git
cd Project_Vaani
Backend Setup
bash
Copy
Edit
cd backend
npm install
Frontend Setup
bash
Copy
Edit
cd ../frontend
npm install
🔐 Environment Variables
In the backend/ directory, create a .env file with:

env
Copy
Edit
PORT=5000

# API Keys
GROQ_API_KEY="your_groq_key"
ELEVENLABS_API_KEY="your_elevenlabs_key"

# Logic API
EXTERNAL_API_URL="https://adityachanna04-project.onrender.com/chat"
Also, create an empty folder for audio uploads:

bash
Copy
Edit
cd backend
mkdir uploads
🚀 Running the Application
Run backend and frontend in separate terminals:

Backend
bash
Copy
Edit
cd backend
npm start
# Runs at http://localhost:5000
Frontend
bash
Copy
Edit
cd frontend
npm run dev
# Opens at http://localhost:5173
You're ready to talk to Project Vaani in your browser! 🧠🎤

📁 Project Structure
bash
Copy
Edit
project-vaani/
├── backend/
│   ├── outputs/           # AI-generated audio responses
│   ├── uploads/           # Temp user audio
│   ├── .env               # API keys & config
│   ├── index.js           # Main Express server
│   ├── package.json
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AudioRecorder.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── FormModal.jsx / .css
│   │   │   └── Icons.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── ...
💡 Built with care to empower every voice.

