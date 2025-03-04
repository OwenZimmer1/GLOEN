# GLOEN
- [GLOEN](#gloen)
    - [📂 **Project Structure**](#-project-structure)
    - [**💡 Project Features**](#-project-features)
- [YOLOv8 Object Detection API](#yolov8-object-detection-api)
  - [Backend server running steps:](#backend-server-running-steps)
  - [Requirements](#requirements)
  - [How to run the WebApp](#how-to-run-the-webapp)
    - [Step 1: Create a Virtual Environment](#step-1-create-a-virtual-environment)
    - [Step 2: Install Dependencies](#step-2-install-dependencies)
    - [Step 3: Start the Server](#step-3-start-the-server)
    - [Step 4: Create new terminal](#step-4-create-new-terminal)
    - [Step 5: Enable RAG with OpenAI API Key](#step-5-enable-rag-with-openai-api-key)

### 📂 **Project Structure**
This project is a **React-based web app** that analyzes OSHA violations using machine learning. Below is the folder structure:

```
/src
│── /assets       # Stores static files (images, icons, etc.)
│── /components   # Reusable UI components (buttons, forms, etc.)
│── /pages        # Full-page components (Home, Upload, Reports, etc.)
│── /utils        # Utility/helper functions (formatting, validation, etc.)
│── /services     # API calls & backend interactions
│── App.tsx       # Main entry point of the React app
│── main.tsx     # React app root
```

### **💡 Project Features**
✅ **Upload Image** – Users can upload an image to check for OSHA violations.  
✅ **View Regulations** – Displays OSHA rules related to workplace safety.  
✅ **Log Violations** – Stores detected violations for future reference.  
✅ **Share, Print, & Save as PDF** – Options to share or print violation reports.  
✅ **Contact Us** – A page for users to reach out for support.  

## Backend server running steps:

### Requirements

```
Flask==3.1.0
Flask-Cors==5.0.1
torch==2.6.0
torchvision==0.21.0
ultralytics==8.3.80
numpy==2.1.1
opencv-python==4.11.0.86
```

### Step 1: Create a Virtual Environment

**Windows:**
```powershell
python -m venv venv
.\venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Start the Server

```bash
python server.py
```

## How to run the WebApp

### 1. Open a terminal 
### 2. Navigate to the web app directory using this command 

```sh
cd WebApp
```

### 3. Install the dependencies 

```sh
npm install
npm install react-webcam
npm install react-router-dom
npm install lucide-react  
```

### 4. Start the server 

```sh
npm run dev
```


## Enable RAG with OpenAI API Key

To enable Retrieval-Augmented Generation (RAG) for the chatbot, follow these steps:

### 1. Create a new file inside GLOEN/backend named .env
### 2. Save your OpenAI API key inside .env:
```
OPENAI_API_KEY='your_api_key_here'
```
### 3. Install the new dependency (python-dotenv, openai)
```
pip install python-dotenv
```
### 4. Restart the backend as before:
```
python server.py
```
