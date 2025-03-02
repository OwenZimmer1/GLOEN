# YOLOv8 Object Detection API
## Backend server running steps:

## Requirements

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

### Step 4: Create new terminal 

In a new terminal navigate to GLOEN/WebApp and run:
```
npm run dev
```


### Step 5: Enable RAG with OpenAI API Key

To enable Retrieval-Augmented Generation (RAG) for the chatbot, follow these steps:

Create a new file inside GLOEN/backend named .env
Save your OpenAI API key inside .env:
```
OPENAI_API_KEY='your_api_key_here'
```
Install the new dependency (python-dotenv, openai)
```
pip install python-dotenv
```
Restart the backend as before:
```
python server.py
```
Now, the chatbot in PocketHazmapp will work correctly using RAG! 🎉
