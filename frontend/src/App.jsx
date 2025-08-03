import React, { useState, useEffect } from 'react';
import './App.css';
import AudioRecorder from './components/AudioRecorder';
import FormModal from './components/FormModal';
import { Mic, MicOff, Volume2, Settings, Globe, Users } from './components/Icons';

function App() {
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userId] = useState('vaani_user_' + Date.now());
  const [showForm, setShowForm] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recording, setRecording] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  // Language options with the new additions
  const languages = [
    { code: 'hi', name: 'हिंदी', english: 'Hindi' },
    { code: 'en', name: 'English', english: 'English' },
    { code: 'bn', name: 'বাংলা', english: 'Bengali' },
    { code: 'te', name: 'తెలుగు', english: 'Telugu' },
    { code: 'mr', name: 'मराठी', english: 'Marathi' },
    { code: 'ta', name: 'தமிழ்', english: 'Tamil' }
  ];

  // Get language display name
  const getLanguageDisplayName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  // Handle recording status audio visualization
  useEffect(() => {
    if (recording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [recording]);

  // Modal handling for form
  useEffect(() => {
    if (showForm) {
      document.body.classList.add('modal-open');
      
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          setShowForm(false);
        }
      };
      
      window.addEventListener('keydown', handleEsc);
      
      return () => {
        document.body.classList.remove('modal-open');
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [showForm]);

  const handleRecordingComplete = async (audioBlob) => {
    if (!selectedLanguage) {
      alert("Please select a language first.");
      return;
    }

    try {
      setProcessing(true);
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('userId', userId);
      
      // Format conversation history to include language information
      const enhancedHistory = conversationHistory.map(item => ({
        ...item,
        language: selectedLanguage
      }));
      
      formData.append('conversationHistory', JSON.stringify(enhancedHistory));
      formData.append('language', selectedLanguage);
      
      console.log(`Sending audio to backend with language: ${selectedLanguage}`);
      const apiResponse = await fetch('http://localhost:5000/api/process-audio', {
        method: 'POST',
        body: formData,
      });
      
      if (!apiResponse.ok) {
        throw new Error(`Server responded with status: ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      console.log('Backend response:', data);
      
      if (data.success) {
        setResponse({
          ...data,
          hasAudio: !!data.audioUrl,
          hasForm: !!data.form_filename
        });
        
        // Just play audio without auto-opening form
        if (data.audioUrl) {
          const audio = new Audio(`http://localhost:5000${data.audioUrl}`);
          audio.play().catch(err => console.error("Audio playback error:", err));
        }
      } else {
        // Handle case where response is not successful
        setResponse({
          ...data,
          success: false
        });
      }
      
    } catch (error) {
      console.error('Error sending audio:', error);
      setResponse({
        transcription: 'Connection issue occurred',
        spokenResponse: 'Sorry, there was a connection problem. Please try again.',
        success: false
      });
    } finally {
      setProcessing(false);
    }
  };

  // Welcome Screen with Language Selection
  const renderWelcomeScreen = () => (
    <div className="vaani-welcome-screen">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1>Welcome to <span className="gradient-text">Vaani</span></h1>
          
          <p className="welcome-description">
            Your intelligent voice companion that bridges the gap to government welfare schemes. 
            Speak in your preferred language.
          </p>
        </div>
        
        <div className="central-animation">
          <div className="circle-outer"></div>
          <div className="circle-middle"></div>
          <div className="circle-inner">
            <Mic size={32} />
            <h3>Speak Freely</h3>
            <p>AI listens & understands</p>
          </div>
          
          <div className="floating-icon users-icon">
            <Users />
          </div>
          
          <div className="floating-icon globe-icon">
            <Globe />
          </div>
        </div>
        
        <div className="feature-cards">
          <div className="feature-card">
            <Mic />
            <h3>Voice-First</h3>
            <p>Talk naturally</p>
          </div>
          
          <div className="feature-card">
            <Globe />
            <h3>Multilingual</h3>
            <p>{languages.length} languages</p>
          </div>
        </div>
        
        <div className="language-selector">
          <h3>Choose Your Language</h3>
          
          <div className="language-buttons">
            {languages.map((lang) => (
              <button 
                key={lang.code}
                className={`language-button ${selectedLanguage === lang.code ? 'selected' : ''}`}
                onClick={() => setSelectedLanguage(lang.code)}
              >
                <div className="lang-name">{lang.name}</div>
                <div className="lang-native">{lang.english}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Main Conversation Interface
  const renderConversation = () => (
    <div className="vaani-conversation-screen">
      <div className="top-bar">
        <div className="language-pill">
          <span role="img" aria-label="language">🎤</span>
          <span>{getLanguageDisplayName(selectedLanguage)}</span>
        </div>
        
        <button className="settings-button" onClick={() => setSelectedLanguage(null)}>
          <Settings />
        </button>
      </div>
      
      <div className="header-content">
        <h1>Talk with Vaani</h1>
        <p>Your voice-first assistant for government services</p>
      </div>
      
      <div className="chat-container">
        <div className="chat-header">
          <div className="assistant-icon">
            <Volume2 />
          </div>
          <div>
            <h3>Vaani Assistant</h3>
            <p className={processing ? 'status-processing' : 'status-online'}>
              {processing ? 'Processing...' : 'Online'}
            </p>
          </div>
        </div>
        
        <div className="chat-messages">
          {!response && !processing && (
            <div className="message bot-message">
              <div className="message-content">
                <p>Hello! I'm Vaani, your voice assistant. I'm here to help you with government schemes and forms. What would you like to know?</p>
              </div>
            </div>
          )}
          
          {response && (
            <>
              <div className="message user-message">
                <div className="message-content">
                  <p>{response.transcription}</p>
                </div>
              </div>
              
              <div className="message bot-message">
                <div className="message-content">
                  <p>{response.spokenResponse}</p>
                  {response.audioUrl && (
                    <audio 
                      controls 
                      className="audio-player" 
                      src={`http://localhost:5000${response.audioUrl}`}
                    />
                  )}
                </div>
              </div>
            </>
          )}
          
          {processing && (
            <div className="message-typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Processing your request...</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="voice-controls">
        <div className="audio-visualizer">
          {[...Array(24)].map((_, i) => (
            <div 
              key={i} 
              className="visualizer-bar"
              style={{ 
                height: recording ? `${8 + (audioLevel * (i + 1) / 100) % 24}px` : '3px' 
              }}
            ></div>
          ))}
        </div>
        
        <AudioRecorder 
          onRecordingComplete={handleRecordingComplete} 
          onRecordingStatusChange={setRecording} 
        />
        
        <p className="tap-instruction">
          {recording ? 'Listening... Speak now' : 'Tap to talk'}
        </p>
      </div>
      
      {response && response.form_filename && (
        <div className="form-action-card">
          <div className="form-card-content">
            <div className="form-card-header">
              <span className="form-icon">📝</span>
              <h3>Application Form Available</h3>
            </div>
            <p>A government form is available for this scheme</p>
            <button 
              onClick={() => setShowForm(true)}
              className="vaani-form-btn"
            >
              Open Form
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="vaani-app">
      {!selectedLanguage ? renderWelcomeScreen() : renderConversation()}
      
      {showForm && response && response.form_filename && (
        <FormModal 
          formFilename={response.form_filename} 
          onClose={() => setShowForm(false)} 
        />
      )}
    </div>
  );
}

export default App;
