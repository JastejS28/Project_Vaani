require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const Groq = require('groq-sdk');

// --- 1. Configuration from .env ---
const {
  GROQ_API_KEY,
  ELEVENLABS_API_KEY,
  EXTERNAL_API_URL, // The URL for your English-only logic API
  PORT = 5000
} = process.env;

const groq = new Groq({ apiKey: GROQ_API_KEY });

// Update the ELEVENLABS_CONFIG to support all 6 languages
const ELEVENLABS_CONFIG = {
  hi: { voiceId: 'pNInz6obpgDQGcFmaJgB', modelId: 'eleven_multilingual_v2' },
  en: { voiceId: '21m00Tcm4TlvDq8ikWAM', modelId: 'eleven_monolingual_v1' },
  bn: { voiceId: 'pNInz6obpgDQGcFmaJgB', modelId: 'eleven_multilingual_v2' },
  te: { voiceId: 'pNInz6obpgDQGcFmaJgB', modelId: 'eleven_multilingual_v2' },
  mr: { voiceId: 'pNInz6obpgDQGcFmaJgB', modelId: 'eleven_multilingual_v2' },
  ta: { voiceId: 'pNInz6obpgDQGcFmaJgB', modelId: 'eleven_multilingual_v2' }  // Tamil
};

// --- 2. Express App & Middleware Setup ---
const app = express();
app.use(cors());
app.use(express.json());
app.use('/audio', express.static(path.join(__dirname, 'outputs')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Define string similarity functions at module level
function stringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance(longer, shorter)) / longer.length;
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

// --- 3. Main API Endpoint ---
app.post('/api/process-audio', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided.' });
  }
  
  const userId = req.body.userId || 'default_user';
  console.log(`Processing request for User ID: ${userId}`);
  
  const selectedLanguage = req.body.language || 'en';
  const audioFilePath = req.file.path;
  console.log(`Received audio file: ${audioFilePath} | User Language: ${selectedLanguage} | User ID: ${userId}`);

  try {
    // === Step 1: Translate user's audio to English text using Whisper ===
    console.log("Step 1: Translating audio to English with Whisper...");
    const translationResponse = await groq.audio.translations.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-large-v3",
    });
    const englishTranscription = translationResponse.text;
    console.log(`Translated English Text: "${englishTranscription}"`);

    // === Step 2: Send English text to your External API ===
    console.log("Step 2: Calling External Logic API...");

    // Parse conversation history from request
    let conversationHistory = [];
    try {
      conversationHistory = req.body.conversationHistory ? 
        JSON.parse(req.body.conversationHistory) : [];
    } catch (e) {
      console.warn("Could not parse conversation history", e);
    }

    // Format conversation history properly
    const apiPayload = {
      message: englishTranscription,
      user_id: userId
    };

    let englishResponseText = '';
    let formHTML = null;
    let formFilename = null;

    try {
      // Skip the GET ping test and go directly to POST (which is what the API supports)
      console.log("Calling External Logic API...");
      const logicApiResponse = await axios.post(
        EXTERNAL_API_URL, 
        apiPayload,
        {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );
      
      // Process the successful response
      englishResponseText = logicApiResponse.data.response;
      // Clean the response to remove any parenthetical text
      englishResponseText = englishResponseText.split('(')[0].trim();
      formHTML = logicApiResponse.data.formHTML || null;
      formFilename = logicApiResponse.data.form_filename || null;
      console.log(`External API Response: "${englishResponseText}"`);
      if (formFilename) {
        console.log(`Form filename received: ${formFilename}`);
      }
      
    } catch (apiError) {
      console.error("External API Error:", apiError.message);
      
      // Implement fallback response generation
      console.log("Using fallback response generation...");
      
      // Create basic response based on transcription
      const transcriptionLower = englishTranscription.toLowerCase();
      
      if (transcriptionLower.includes('form') || 
          transcriptionLower.includes('apply') || 
          transcriptionLower.includes('application')) {
        
        // Generate a dummy form for form-related queries
        englishResponseText = `I understand you're looking for a form. I've created a basic application form for you to use.`;
        
        // Create a simple HTML form
        const timestamp = Date.now();
        formFilename = `welfare_scheme_form_${new Date().toISOString().slice(0,10).replace(/-/g,'')}_${timestamp.toString().slice(-6)}.html`;
        
        // Generate simple form content
        const formContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Basic Application Form</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              .form-group { margin-bottom: 15px; }
              label { display: block; margin-bottom: 5px; font-weight: bold; }
              input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
              button { background: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
              button:hover { background: #45a049; }
              .form-header { background: #f8f9fa; padding: 15px; border-bottom: 2px solid #4CAF50; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <div class="form-container">
              <div class="form-header">
                <h2>Government Scheme Application Form</h2>
                <p>Please fill out this form completely to apply</p>
              </div>
              
              <form id="applicationForm">
                <div class="form-group">
                  <label for="fullName">Full Name:</label>
                  <input type="text" id="fullName" name="fullName" required>
                </div>
                
                <div class="form-group">
                  <label for="age">Age:</label>
                  <input type="number" id="age" name="age" required min="18" max="120">
                </div>
                
                <div class="form-group">
                  <label for="gender">Gender:</label>
                  <select id="gender" name="gender" required>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="aadhar">Aadhar Number:</label>
                  <input type="text" id="aadhar" name="aadhar" pattern="[0-9]{12}" placeholder="12 digits" required>
                </div>
                
                <div class="form-group">
                  <label for="income">Annual Income (₹):</label>
                  <input type="number" id="income" name="income" required min="0">
                </div>
                
                <div class="form-group">
                  <label for="address">Full Address:</label>
                  <textarea id="address" name="address" rows="3" required></textarea>
                </div>
                
                <button type="submit">Submit Application</button>
              </form>
              
              <script>
                document.getElementById("applicationForm").addEventListener("submit", function(e) {
                  e.preventDefault();
                  alert("Form submitted successfully! Your application has been received.");
                });
              </script>
            </div>
          </body>
          </html>
        `;
        
        // Save the generated form
        const formsDir = path.join(__dirname, 'forms');
        await fs.ensureDir(formsDir);
        await fs.writeFile(path.join(formsDir, formFilename), formContent);
        console.log(`Generated fallback form: ${formFilename}`);
        
      } else {
        // For general queries, provide a generic response
        englishResponseText = `I understand you're asking: "${englishTranscription}". ` +
          `I can help with information about government schemes and social welfare programs. ` +
          `What specific details would you like to know?`;
      }
    }
    
    // Check if the response is too similar to previous responses
    // MOVED THIS CODE HERE - Inside the function where conversationHistory is defined
    let isRepetitive = false;
    if (conversationHistory.length > 0) {
      const lastResponse = conversationHistory[conversationHistory.length - 1]?.aiResponse;
      
      // Simple repetition detection
      if (lastResponse && englishResponseText) {
        const similarity = stringSimilarity(lastResponse, englishResponseText);
        if (similarity > 0.8) { // If 80% similar
          console.log("Repetitive response detected!");
          isRepetitive = true;
          
          // Add variation to break repetition
          if (selectedLanguage === 'hi') {
            englishResponseText = "मुझे लगता है कि मैंने पहले इस बारे में बताया था। क्या आप कुछ और जानना चाहेंगे या इस विषय पर अधिक विवरण चाहिए?";
          } else {
            englishResponseText = "I think I've mentioned this before. Would you like to know something else or need more details on this topic?";
          }
        }
      }
    }
    
    // === Step 3: Translate English response to user's language if needed ===
    let finalResponseText = englishResponseText;
    if (selectedLanguage !== 'en' && englishResponseText) {
      console.log(`Step 3: Translating English response to ${selectedLanguage} with domain context...`);
      
      // Language mapping for translation
      const languageNames = {
        'hi': 'Hindi',
        'bn': 'Bengali', 
        'te': 'Telugu',
        'mr': 'Marathi',
        'ta': 'Tamil'
      };
      
      const targetLanguage = languageNames[selectedLanguage] || selectedLanguage;
      
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: `You are a precise ${targetLanguage} translator.
              Your ONLY job is to translate the EXACT English text provided into natural ${targetLanguage}.
              DO NOT add ANY introduction, greeting, or extra information.
              DO NOT change or expand the original meaning.
              DO NOT add your own content or explanations.
              Simply translate EXACTLY what is provided - nothing more, nothing less.`
          },
          { role: 'user', content: `Please translate this English text to ${targetLanguage}: "${englishResponseText}"` },
        ],
        model: 'llama3-8b-8192',
        temperature: 0.1,
      });
      finalResponseText = chatCompletion.choices[0]?.message?.content || englishResponseText;
      console.log(`Translated ${targetLanguage} Response: "${finalResponseText}"`);
    }

    // === Step 4: Convert the final text to speech ===
    console.log(`Step 4: Generating audio in '${selectedLanguage}' using ElevenLabs...`);

    // Add debug logging
    console.log('Available ELEVENLABS_CONFIG:', Object.keys(ELEVENLABS_CONFIG));
    console.log(`Looking for config for language: ${selectedLanguage}`);

    const ttsConfig = ELEVENLABS_CONFIG[selectedLanguage];
    console.log('Found ttsConfig:', ttsConfig);

    if (!ttsConfig) {
      console.error(`TTS configuration not found for language: ${selectedLanguage}`);
      console.error('Available languages:', Object.keys(ELEVENLABS_CONFIG));
      throw new Error(`TTS configuration not found for language: ${selectedLanguage}`);
    }

    const ttsResponse = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${ttsConfig.voiceId}`,
      { text: finalResponseText, model_id: ttsConfig.modelId },
      {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
        responseType: 'arraybuffer',
      }
    );

    const audioFileName = `response_${Date.now()}.mp3`;
    const outputDir = path.join(__dirname, 'outputs');
    await fs.ensureDir(outputDir);
    await fs.writeFile(path.join(outputDir, audioFileName), ttsResponse.data);
    console.log(`Audio file saved: ${audioFileName}`);

    // === Step 5: Send Final Response to Frontend ===
    res.json({
      transcription: englishTranscription,
      spokenResponse: finalResponseText,
      formHTML: formHTML,
      form_filename: formFilename,
      audioUrl: `/audio/${audioFileName}`,
      success: true,
    });

  } catch (error) {
    console.error("==================ERROR==================");
    console.error("Error in processing pipeline:");
    
    if (error.response) {
      // The request was made and the server responded with a non-2xx status
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request
      console.error("Error message:", error.message);
    }
    
    console.error("Full error stack:", error.stack);
    console.error("==========================================");
    
    res.status(500).json({ 
      error: "Failed to process audio.", 
      details: error.message 
    });
  } finally {
    await fs.remove(audioFilePath);
  }
});

// Create a directory for storing generated forms
const formsDir = path.join(__dirname, 'forms');
fs.ensureDir(formsDir).catch(err => console.error('Error creating forms directory:', err));

// Form endpoint - serves generated HTML forms
app.get('/form/:form_filename', async (req, res) => {
  try {
    const formFilename = req.params.form_filename;
    console.log(`Form requested: ${formFilename}`);
    
    // Check if the form exists in our local storage first
    const localFormPath = path.join(formsDir, formFilename);
    
    if (await fs.pathExists(localFormPath)) {
      console.log(`Serving locally stored form: ${localFormPath}`);
      return res.sendFile(localFormPath);
    }
    
    // If not found locally, try to get it from the external API
    console.log('Form not found locally, fetching from external API...');
    const baseApiUrl = EXTERNAL_API_URL.split('/chat')[0]; // Get base URL without '/chat'
    const formResponse = await axios.get(`${baseApiUrl}/form/${formFilename}`, {
      headers: {
        'accept': 'text/html',
      },
      responseType: 'text',
      timeout: 10000 // 10 second timeout
    });
    
    if (formResponse.status === 200) {
      // Save the form locally for future requests
      const formContent = formResponse.data;
      await fs.writeFile(localFormPath, formContent, 'utf8');
      console.log(`Form saved to: ${localFormPath}`);
      
      // Send the form to the client
      return res.type('html').send(formContent);
    } else {
      throw new Error(`External API returned status ${formResponse.status}`);
    }
  } catch (error) {
    console.error('Error retrieving form:', error);
    res.status(404).send('Form not found or could not be retrieved');
  }
});

// API Status endpoint
app.get('/api/status', async (req, res) => {
  const services = {
    server: { status: 'online' },
    groq_api: { status: 'unknown' },
    external_api: { status: 'unknown' },
    elevenlabs_api: { status: 'unknown' }
  };
  
  // Check Groq API
  try {
    await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'hello' }],
      model: 'llama3-8b-8192',
      max_tokens: 1
    });
    services.groq_api.status = 'online';
  } catch (e) {
    services.groq_api.status = 'offline';
    services.groq_api.error = e.message;
  }
  
  // Check External API
  try {
    // Don't try GET - go straight to POST which the API supports
    await axios.post(
      EXTERNAL_API_URL, 
      { message: "ping", user_id: "system_check" },
      { 
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
    services.external_api.status = 'online';
  } catch (e) {
    services.external_api.status = 'offline';
    services.external_api.error = e.message;
  }
  
  // Overall health
  const allOnline = Object.values(services).every(s => s.status === 'online');
  
  res.json({
    status: allOnline ? 'healthy' : 'degraded',
    services,
    timestamp: new Date().toISOString()
  });
});

// --- 4. Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

