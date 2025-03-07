# AI Healthcare Diagnosis and Management System
## Demo 
[![YT-LINK](https://img.youtube.com/vi/sFHiLZOl8rg/0.jpg)](https://www.youtube.com/watch?v=sFHiLZOl8rg)

## Overview
The **Healthcare Diagnosis System** is an advanced AI-powered platform designed to assist with healthcare-related queries. Built using **Flask**, **LangChain**, **FAISS**, and **Ollama**, this system provides:
- **Conversational AI** for general medical queries
- **Document-based Question Answering (RAG)** for uploaded PDFs
- **Speech-based interactions** for accessibility
- **Separate login for doctors and patients**, ensuring role-based access
- **Hemorrhage analysis** for medical imaging
- **Real-time health monitoring via smartwatch (To be implemented)**
- 
## Wireframe
![Wireframe](https://raw.githubusercontent.com/Krishsh93/ctrl-hack/main/images/Untitled.jpeg)


## Features

### 🔹 User Authentication & Role-Based Access
- **Separate login for doctors and patients**
- Doctors can view and manage patient records
- Patients can access medical history and consult doctors

### 🔹 Conversational AI for Medical Queries
- Users can interact with a **text-based chatbot** to ask medical-related questions.
- The chatbot maintains chat history for contextual responses.

### 🔹 Retrieval-Augmented Generation (RAG) for Document-Based QA
- Users can upload **PDF files** containing medical literature or reports.
- The chatbot extracts relevant information and answers specific queries based on the content.

### 🔹 FAISS-Based Vector Store
- Utilizes **FAISS (Facebook AI Similarity Search)** for efficient medical data retrieval.
- Ensures **fast and accurate** information retrieval.

### 🔹 Ollama-Powered Medical AI Model
- Uses **Ollama's MedLLaMA2**, a specialized **LLM for medical applications**.
- Provides fact-based responses while avoiding speculative medical advice.

### 🔹 Hemorrhage Analysis
- Upload **brain scan images** for hemorrhage detection.
- AI-powered **computer vision model** assists doctors in analysis.

### 🔹 Real-Time Health Monitoring via Smartwatch (Upcoming)
- Future integration with **smartwatches** to monitor vitals in real time.
- AI-based alerts for abnormalities detected in health data.

### 🔹 Voice-Based Interaction
- Supports **voice queries**, transcribing speech to text using **SpeechRecognition**.
- Enhances accessibility for users with limited typing ability.

### 🔹 Secure and Ethical AI
- **No medical diagnosis**: The chatbot retrieves medical knowledge but does not diagnose.
- **Privacy-focused**: Conversations and files are processed securely.

## Tech Stack
- **Frontend**: React.js (Vite, Tailwind CSS)
- **Backend**: Express.js (Node.js)
- **AI Processing**: Flask (LangChain, FAISS, Ollama)
- **Vector Store**: FAISS
- **LLM**: MedLLaMA2 (Ollama)
- **Document Processing**: PyMuPDF, RecursiveCharacterTextSplitter
- **Speech-to-Text**: SpeechRecognition, pydub
- **API Integration**: Flask-CORS
- **Database**: MongoDB Atlas

## API Endpoints
### 1⃣ `/chat` (Text-Based Queries)
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "message": "What are the symptoms of diabetes?"
  }
  ```
- **Response**:
  ```json
  {
    "reply": "Common symptoms of diabetes include excessive thirst, frequent urination, and fatigue."
  }
  ```

### 2⃣ `/upload` (Document-Based Queries)
- **Method**: `POST`
- **Payload**:
  - `pdf` (File): PDF document
  - `question` (String): Query related to the document
- **Response**:
  ```json
  {
    "reply": "According to the uploaded document, the recommended dosage for aspirin is 75-100mg daily."
  }
  ```

### 3⃣ `/voice` (Speech-Based Queries)
- **Method**: `POST`
- **Payload**:
  - `voice` (File): Audio file in WebM format
- **Response**:
  ```json
  {
    "reply": "The chatbot processes voice inputs and provides medical knowledge accordingly."
  }
  ```

### 4⃣ `/predict_hemorrhage` (Hemorrhage Analysis)
- **Method**: `POST`
- **Payload**:
  - `file` (Image): Brain scan image
- **Response**:
  ```json
  {
    "prediction": "No hemorrhage detected."
  }
  ```

## Installation & Setup

### Frontend (React.js)
1. Clone the repository and navigate to the frontend:
   ```sh
   git clone https://github.com/Krishsh93/ctrl-hack
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React app:
   ```sh
   npm start
   ```
4. Access the frontend at `http://localhost:3000`

### Backend (Express.js)
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the Express.js server:
   ```sh
   npm run dev
   ```
4. API will be available at `http://localhost:4000`

### AI Processing (Flask Chatbot)
1. Navigate to the AI processing folder:
   ```sh
   cd flask-api
   ```
2. Create a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the Flask AI server:
   ```sh
   python chatbot.py
   ```
5. Flask API will be available at `http://localhost:8000`

### AI Processing (Hemorrhage Detection)
1. Navigate to the Flask API folder:
   ```sh
   cd hemorrhage-api
   ```
2. Create a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Start the Flask AI server:
   ```sh
   python hemorrhage.py
   ```
5. Flask API will be available at `http://localhost:5000`

## Future Enhancements
✅ Integration with **FHIR** for structured medical data retrieval  
✅ Deployment on **cloud platforms** for scalability  
✅ Advanced **NLP fine-tuning** for improved accuracy  
✅ **Real-time smartwatch monitoring** implementation  

## Screenshots
![Login Page](https://raw.githubusercontent.com/Krishsh93/ctrl-hack/main/images/landing.png)
![Chatbot](https://raw.githubusercontent.com/Krishsh93/ctrl-hack/main/images/chatbot.png)
![Doctor Dashboard](https://raw.githubusercontent.com/Krishsh93/ctrl-hack/main/images/doctordb.png)
![Patient Dashboard](https://raw.githubusercontent.com/Krishsh93/ctrl-hack/main/images/patientdb.png)
![Hemorrhage Analysis](https://raw.githubusercontent.com/Krishsh93/ctrl-hack/main/images/haemo.png)

---
**Disclaimer**: This chatbot is for informational purposes only and should not be used as a substitute for professional medical advice. Always consult a healthcare provider for medical concerns.

