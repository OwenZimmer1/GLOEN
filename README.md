# GLOEN - AI-Powered OSHA Violation Detection

- [GLOEN - AI-Powered OSHA Violation Detection](#gloen---ai-powered-osha-violation-detection)
  - [Overview](#overview)
  - [Usage Workflow](#usage-workflow)
  - [Backend Setup (Flask Server)](#backend-setup-flask-server)
    - [**1. Install Dependencies**](#1-install-dependencies)
    - [**2. Start the Backend Server**](#2-start-the-backend-server)
  - [Frontend Setup (React WebApp)](#frontend-setup-react-webapp)
    - [**1. Install Dependencies**](#1-install-dependencies-1)
    - [**2. Start the Frontend Server**](#2-start-the-frontend-server)
  - [Project Structure](#project-structure)
  - [Features](#features)


##  Overview
GLOEN is a **web application** that utilizes **machine learning** to detect and analyze **OSHA (Occupational Safety and Health Administration) violations** in workplace images. Users can upload photos, and the system will assess potential hazards based on OSHA regulations, log violations, and generate reports.


---

## Usage Workflow
1. **Start the backend and frontend servers.**
2. **Upload one or more images in one go** for OSHA violation analysis.
3. **View detected violations** and related OSHA regulations.
4. **Chat with the Pocket Hazmapp** for safety compliance help.


---

## Backend Setup (Flask Server)


### **1. Install Dependencies**
Ensure you have Python installed, then run:

**Navagate to:** `GLOEN/Backend/`

```bash
python -m venv venv # create virtual environment 
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```
**Note: if installation taking too long we suggest going to the requirements.txt file and installing 1 dependency at a time**

### **2. Start the Backend Server**
```bash
python server.py
```


## Frontend Setup (React WebApp)

**While the server is running create a new terminal and navigate to `GLOEN/Webapp`**
### **1. Install Dependencies**
Ensure Node.js is installed, then run:
```bash
cd WebApp
npm install
npm install react-webcam react-router-dom lucide-react
```

### **2. Start the Frontend Server**
```bash
npm run dev
```


## Project Structure
```
GLOEN/
├── Backend/               # Flask-based backend server
│   ├── requirements.txt   # Dependencies
│   ├── server.py          # Main backend server script
│   ├── .env               # Environment variables (API keys, configs)
│   ├── models/            # ML models for violation detection
│   │   └── bestabhi2.pt   # Trained model for OSHA violations
│
├── WebApp/                # React-based frontend application
│   ├── public/            # Static files
│   ├── src/               # Frontend source code
│   │   ├── assets/        # Images, icons, and static assets
│   │   ├── components/    # Reusable UI components (ImageUpload, ChatBox, etc.)
│   │   ├── data/          # Data-related files (ViolationList, Reports, etc.)
│   │   ├── pages/         # Full-page components (History, Results, etc.)
│   │   ├── App.tsx        # Main application entry point
│   │   ├── main.tsx       # React root file
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration file
│   ├── tsconfig.json      # TypeScript configuration
│
├── model/                 # ML model training and testing scripts
│   ├── resume_train.py    # Resume training the model
│   ├── test.py            # Test the trained model
│   └── train.py           # Train the AI model from scratch
│   └── Readme.md          # Details about this folder
│
└── .github/               # GitHub Actions for CI/CD
    └── workflows/         # Automated deployment workflows
        └── main.yml                   # Main workflow file
```

## Features
**Upload & Analyze Images** – Users can upload images for AI-based OSHA violation detection.  
**View OSHA Regulations** – Displays workplace safety rules related to detected violations.  
**Violation Logging** – Users can log, save, and retrieve detected violations.  
**Chatbot Assistance** – AI-powered chatbot provides OSHA-related guidance.  
**Share & Print Reports** – Generate PDF reports or print violation details.  
**Secure & Scalable** – Uses Azure for storage and processing scalability.  

## Google Colab for training and testing of features and functionalities of the model, and saving to drive: https://colab.research.google.com/drive/1WvrcOQAOi42zF2t610bJgvTRxfN7A5vC?usp=sharing
