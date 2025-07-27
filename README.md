# Project Vaani

Project Vaani is an AI-powered, voice-first digital assistant designed to bridge the gap between citizens and government social welfare schemes in India. By leveraging advanced speech recognition, translation, and generative AI technologies, Vaani empowers digitally inexperienced and multilingual users to access critical information and benefits with ease.

---

## 📑 Table of Contents

1. [Vision](#vision)
2. [Key Features](#key-features)
3. [How It Works](#how-it-works)
4. [Tech Stack](#tech-stack)
5. [Project Structure](#project-structure)
6. [Supported Languages](#supported-languages)
7. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Configuration](#environment-configuration)
   - [Running the Application](#running-the-application)
8. [Usage Guide](#usage-guide)
9. [Contributing](#contributing)
10. [License](#license)
11. [Contact](#contact)
12. [Acknowledgements](#acknowledgements)

---

## 1. 🌟 Vision

Project Vaani aims to create an inclusive digital platform where any citizen, regardless of language or technical expertise, can interact using natural voice commands to discover, understand, and apply for government welfare programs. Our mission is to democratize access to public services and promote social equity through the power of AI.

---

## 2. 🚩 Key Features

- **Voice-First User Experience:** Speak queries in your native language for a seamless experience.
- **Multilingual Support:** Handles multiple Indian languages and English.
- **AI-Powered Query Resolution:** Uses generative AI to understand complex questions and provide accurate responses.
- **End-to-End Automation:** Automates the entire workflow from voice input to actionable output.
- **Mobile Responsive:** Designed for accessibility on smartphones and tablets.
- **Privacy First:** User audio is processed securely and not stored beyond session needs.

---

## 3. 🎤 How It Works

1. **Voice Input:**  
   Users speak their queries in the language of their choice using a mobile-friendly web app.

2. **Speech-to-Text & Translation:**  
   Audio is transcribed and translated to English via Groq Whisper API, handling multiple Indian languages.

3. **AI Logic Processing:**  
   Translated queries are sent to a generative AI (Groq Llama3) for understanding and response formulation.

4. **Translation of Response:**  
   The AI-generated answer is translated back into the user's selected language.

5. **Text-to-Speech:**  
   ElevenLabs API converts the final response into clear, natural speech in the user's language.

6. **Conversational UI:**  
   The frontend displays both text and audio responses, creating a seamless, voice-first conversational experience.

---

## 4. 🛠️ Tech Stack

- **Frontend:** React (Vite), JavaScript, HTML, CSS
- **Backend:** Node.js, Express.js
- **Speech Recognition:** Groq Whisper API
- **AI Logic & Translation:** Groq Llama3 API
- **Text-to-Speech:** ElevenLabs API

---

## 5. 📂 Project Structure

```
Project_Vaani/
├── backend/          # Node.js server, handles API requests and audio processing
│   ├── uploads/      # Temporary storage for user audio files
│   └── ...
├── frontend/         # React web app (Vite)
│   └── ...
├── README.md
└── ...
```

---

## 6. 🗣️ Supported Languages

- Hindi
- English
- (Extendable to other major Indian languages)

---

## 7. 🏁 Getting Started

### 7.1 Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### 7.2 Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/JastejS28/Project_Vaani.git
    cd Project_Vaani
    ```

2. **Install backend dependencies**
    ```bash
    cd backend
    npm install
    ```

3. **Install frontend dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

### 7.3 Environment Configuration

Create a `.env` file in the `backend` directory with your API keys and configuration:
```
PORT=5000
GROQ_API_KEY=your_groq_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
EXTERNAL_API_URL=https://adityachanna04-project.onrender.com/chat
```

Create an `uploads` folder for storing audio files:
```bash
cd backend
mkdir uploads
```

### 7.4 Running the Application

1. **Start the backend**
    ```bash
    cd backend
    npm start
    # Backend runs at http://localhost:5000
    ```

2. **Start the frontend**
    ```bash
    cd frontend
    npm run dev
    # Frontend runs at http://localhost:5173
    ```

---

## 8. 📖 Usage Guide

1. Open your browser and visit http://localhost:5173
2. Select your preferred language.
3. Press the microphone button and speak your query.
4. Listen to the response or read the on-screen text.
5. Repeat as needed—Project Vaani is conversational!

---

## 9. 🤝 Contributing

We welcome contributions!

- Fork the repo
- Create your feature branch (`git checkout -b feature/my-feature`)
- Commit your changes
- Push to the branch
- Open a Pull Request

For detailed contributor guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md) if present.

---

## 10. 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 11. 💡 Contact

Questions, suggestions, or feedback?  
- Open an issue on GitHub
- Contact the maintainers via their GitHub profiles

---

## 12. 🙏 Acknowledgements

- [Groq Whisper API](https://groq.com/)
- [Groq Llama3 API](https://groq.com/)
- [ElevenLabs API](https://elevenlabs.io/)
- Government of India - Social Welfare Schemes Data Source

---

*Empowering citizens, one voice at a time.*
