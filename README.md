Project Vaani: AI-Powered Digital Companion
Project Vaani is a voice-first AI digital companion designed to make government social welfare schemes accessible to digitally inexperienced and multilingual citizens in India. It leverages a suite of modern AI services to provide a seamless, conversational experience, breaking down language and technology barriers.

Table of Contents
Project Aim & Vision

Core Workflow

Tech Stack

Getting Started

Prerequisites

Installation

Environment Variables

Running the Application

Project Structure

1. Project Aim & Vision
Aim: To create "Project Vaani," a voice-first AI digital companion that makes government social welfare schemes accessible to digitally inexperienced and multilingual citizens in India.

Vision: To build a future where any citizen, regardless of their language or technical literacy, can easily understand, apply for, and receive the benefits they are entitled to, using nothing more than their own voice. We are bridging the access gap by transforming complex digital processes into simple, empathetic conversations.

2. The Complete Technical Workflow
This workflow details the end-to-end process from the moment a user speaks to when they receive a spoken response, ensuring a seamless experience in their chosen language.

Initial Setup:

User Interface (React + Vite): The user opens a mobile-responsive website.

Language Selection: The user is first prompted to select their preferred language for the session (e.g., English or Hindi). This choice is stored and sent with every subsequent request.

The Conversational Loop:

Voice Input (Frontend): The user speaks their query. The browser's MediaRecorder API captures the audio, which is sent to the backend along with the chosen language code.

Audio-to-English Translation (Backend - Groq Whisper): The backend calls the Groq Whisper API's /translations endpoint, which transcribes the user's speech and translates it directly into English text.

Core Logic Processing (Backend - External API): The clean English text is sent to the external logic API (https://adityachanna04-project.onrender.com/chat). This "brain" processes the query and returns its response in English text.

Response Translation (Backend - Groq LLM): If the user's chosen language was Hindi, the backend uses a Groq language model (like llama3-8b-8192) to translate the English response from the external API into simple, conversational Hindi. This step is skipped for English users.

Text-to-Speech Generation (Backend - ElevenLabs): The backend uses the final response text (in the correct language) and the user's language choice to select the appropriate voice from the ElevenLabs API, which returns the spoken response as an MP3 file.

Final Delivery (Frontend): The backend sends a JSON object to the frontend containing the transcription, the final spoken response text, and a URL to the audio file. The frontend displays the conversation and plays the audio.

3. Tech Stack
Frontend: React (with Vite), JavaScript

Backend: Node.js, Express.js

Speech-to-Text: Groq API (Whisper-large-v3)

Language Translation & Logic: Groq API (Llama3)

Text-to-Speech: ElevenLabs API

4. Getting Started
Follow these instructions to set up and run the project on your local machine.

Prerequisites
Node.js (v18 or later recommended)

npm (or yarn)

Installation
Clone the Repository:

git clone <your-repository-url>
cd project-vaani

Install Backend Dependencies:
Navigate to the backend directory and install the required packages.

cd backend
npm install

Install Frontend Dependencies:
Navigate to the frontend directory and install the required packages.

cd ../frontend
npm install

Environment Variables
The backend requires API keys to function.

In the backend directory, create a new file named .env.

Add the following variables to the .env file, replacing the placeholder values with your actual keys and URLs:

# Port for the backend server
PORT=5000

# API Keys
GROQ_API_KEY="gsk_..."
ELEVENLABS_API_KEY="..."

# External API for core logic
EXTERNAL_API_URL="https://adityachanna04-project.onrender.com/chat"

Create Required Folders:
Inside the backend directory, you must manually create an empty folder named uploads. This is where temporary audio files will be stored before processing.

cd backend
mkdir uploads

Running the Application
You need to run both the backend and frontend servers simultaneously in separate terminal windows.

Start the Backend Server:
From the backend directory:

npm start

The server should now be running on http://localhost:5000.

Start the Frontend Development Server:
From the frontend directory:

npm run dev

The React application will open in your browser, typically at http://localhost:5173.

You can now interact with Project Vaani in your browser.

5. Project Structure
project-vaani/
├── backend/
│   ├── outputs/          # Storage for generated AI audio responses
│   ├── uploads/          # Temporary storage for user audio
│   ├── .env              # Environment variables and API keys
│   ├── .gitignore
│   ├── config.js         # (If used for configuration)
│   ├── index.js          # Main Express server and API logic
│   ├── package-lock.json
│   └── package.json
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── AudioRecorder.jsx
    │   │   ├── ChatMessage.jsx
    │   │   ├── FormModal.css
    │   │   ├── FormModal.jsx
    │   │   └── Icons.jsx
    │   ├── App.css
    │   ├── App.jsx       # Main application component
    │   ├── index.css
    │   └── main.jsx
    ├── .gitignore
    ├── eslint.config.js
    └── index.html
