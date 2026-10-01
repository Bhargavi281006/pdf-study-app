# PDF Study Assistant

An AI-powered PDF study assistant built with **FastAPI, SQLite, SQLAlchemy, Tesseract OCR, and Google Gemini**.

The application allows users to register and log in securely, upload PDF study materials, extract text from PDFs using normal text extraction and OCR, generate AI-powered study notes, and create quiz questions from uploaded study material.

---

## 1. Features

- User registration
- Secure password hashing
- JWT-based authentication
- Protected API endpoints
- PDF upload
- PDF text extraction
- OCR for scanned/image-based PDF pages
- AI-generated study summaries
- AI-generated multiple-choice quizzes
- SQLite database
- SQLAlchemy ORM
- Interactive Swagger API documentation
- Simple web frontend
- Error handling for unavailable AI services

---

## 2. Technology Stack

### Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- JWT Authentication
- Passlib / bcrypt

### PDF and OCR

- PyMuPDF
- Tesseract OCR
- Pytesseract
- Pillow

### AI

- Google Gemini API
- `google-genai`

### Frontend

- HTML
- CSS
- JavaScript

---

## 3. Project Structure

```text
pdf-study-app/
│
├── .env
├── .env.example
├── .gitignore
├── README.md
├── requirements.txt
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── users.py
│   ├── auth.py
│   ├── materials.py
│   ├── pdf_utils.py
│   └── ai_utils.py
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── summary.html
│   ├── quiz.html
│   ├── style.css
│   ├── script.js
│   ├── dashboard.js
│   ├── summary.js
│   └── quiz.js
│
├── uploads/
│
└── study_app.db


## Application Architechture

                    USER
                     │
                     ▼
              FRONTEND
          HTML / CSS / JS
                     │
                     ▼
                FASTAPI
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
   AUTHENTICATION          MATERIAL API
       JWT                      │
          │                     ▼
          │                PDF PROCESSING
          │                     │
          │              ┌──────┴──────┐
          │              │             │
          │              ▼             ▼
          │        PDF Text       Tesseract OCR
          │        Extraction
          │              │
          └──────────────┼──────────────┐
                         ▼              │
                    SQLite DB           │
                         │              │
                         └──────┬───────┘
                                ▼
                         GOOGLE GEMINI
                                │
                     ┌──────────┴──────────┐
                     ▼                     ▼
                  SUMMARY                QUIZ

5. Authentication Flow

The application uses JWT-based authentication.

User
 │
 │ POST /users
 ▼
User Registration
 │
 ▼
Password is hashed
 │
 ▼
Stored in SQLite
 │
 │
 │ POST /auth/login
 ▼
Credentials verified
 │
 ▼
JWT access token generated
 │
 ▼
Client stores token
 │
 │
 │ Protected API request
 │ Authorization: Bearer <token>
 ▼
FastAPI validates JWT
 │
 ▼
Request is allowed

The password itself is not stored directly in the database. A hashed password is stored instead.

6. Database

SQLite is used as the database.

The application contains two main models.

User:
id
name
email
password

Material:
id
filename
file_path
extracted_text
owner_id

Each uploaded material is associated with the authenticated user who uploaded it.

7. API Endpoints

Create User:

POST /users
Creates a new user account.

Login:

POST /auth/login
Authenticates the user and returns a JWT access token.

example response:
{
  "access_token": "JWT_TOKEN",
  "token_type": "bearer"
}

Upload PDF
POST /materials/upload
Uploads a PDF file.

This endpoint requires authentication.

The uploaded PDF is:

1.Saved in the uploads directory.
2.Processed for text extraction.
3.Sent through OCR when required.
4.Stored as a material in the database.

Generate Summary:

POST /materials/{id}/summary
Generates AI-powered study notes from the extracted PDF text.
This endpoint requires authentication.

Generate Quiz:

POST /materials/{id}/quiz
Generates five multiple-choice questions from the extracted PDF text.
This endpoint requires authentication.

8. PDF Processing and OCR

The application first attempts normal PDF text extraction using PyMuPDF.
If a PDF page contains little or no extractable text, the page is converted into an image and processed using Tesseract OCR.

PDF
 │
 ▼
PyMuPDF Text Extraction
 │
 ├── Text available ───────► Use extracted text
 │
 └── No text
          │
          ▼
       PDF Page
          │
          ▼
      Image Conversion
          │
          ▼
      Tesseract OCR
          │
          ▼
     Extracted Text
This allows the application to process both normal text PDFs and scanned/image-based PDFs.

9. AI Summary Generation

The extracted study material is sent to Google Gemini.

The AI is instructed to generate:

Topic explanation
Important concepts
Definitions
Step-by-step explanations
Important differences
Key points
Quick revision questions
Final takeaway

The generated content is designed to be easier for students to understand and revise.

10. AI Quiz Generation

The extracted study material is also used to generate a quiz.
The application requests exactly five multiple-choice questions.
Each question contains:

Question
A
B
C
D
Correct Answer
The frontend displays the questions interactively and calculates the student's score.

11. Environment Variables

API keys and authentication secrets are stored using environment variables.
Create a .env file:

GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
Do not commit the actual .env file to GitHub.
The project includes .env.example as a template.

12. Installation
Step 1: Clone the repository
git clone <your-github-repository-url>
cd pdf-study-app

Step 2: Create a virtual environment
python -m venv venv

Step 3: Activate the virtual environment
For Git Bash on Windows:
source venv/Scripts/activate

Step 4: Install Python dependencies
pip install -r requirements.txt


13. Tesseract OCR Installation
Tesseract OCR is required for scanned PDFs.
On Windows, Tesseract can be installed using:

winget install --id UB-Mannheim.TesseractOCR

Verify the installation:
tesseract --version

If Git Bash cannot find Tesseract, add it to the current terminal session:
export PATH="$PATH:/c/Program Files/Tesseract-OCR"
export PATH="$PATH:/c/Program Files/Tesseract-OCR"

14. Run the Backend

Activate the virtual environment:
source venv/Scripts/activate
Start FastAPI:
uvicorn app.main:app
The backend will run at:
http://127.0.0.1:8000

15. Swagger API Documentation

FastAPI automatically provides interactive API documentation.
Open:
http://127.0.0.1:8000/docs

The Swagger interface can be used to test:
POST /users
POST /auth/login
POST /materials/upload
POST /materials/{id}/summary
POST /materials/{id}/quiz
Protected endpoints require the JWT access token.

16. Run the Frontend

Open another Git Bash terminal.
Go to the frontend directory:
cd ~/pdf-study-app/frontend
Start the frontend server:
python -m http.server 5500
Open:
http://127.0.0.1:5500/index.html

17. Application Workflow

 Open the application
        ↓
 Register an account
        ↓
 Login
        ↓
 Receive JWT token
        ↓
 Open dashboard
        ↓
 Upload PDF
        ↓
 PDF text extraction / OCR
        ↓
 Material stored in database
        ↓
 Generate study summary
        ↓
 Generate quiz
        ↓
 Answer questions
        ↓
 View quiz score


18. Security

The application follows basic security practices:

Passwords are hashed before storage.
JWT is used for authentication.
Protected endpoints require a valid JWT.
Users can access their own uploaded materials.
API keys are stored in environment variables.
.env is excluded from Git.
Database and uploaded files are excluded from Git.

19. Error Handling

The application handles common errors such as:

Invalid login credentials
Duplicate email registration
Non-PDF file uploads
Missing material
Missing extracted text
Invalid authentication token
Gemini API availability or quota errors

If the Gemini free-tier request limit is reached, the application displays a user-friendly message instead of crashing.

20. Google Colab Demonstration

A separate Google Colab notebook demonstrates the PDF processing pipeline:

PDF
 ↓
Text Extraction / OCR
 ↓
Extracted Study Material
 ↓
AI Summary
 ↓
AI Quiz

The Colab notebook is intended to demonstrate the core PDF OCR → Summary → Quiz pipeline independently from the FastAPI application.
Colab link:
PASTE YOUR GOOGLE COLAB LINK HERE

21. Requirements

The main Python dependencies are listed in:
requirements.txt
Install them using:
pip install -r requirements.txt

22. Future Improvements

Possible future improvements include:

PostgreSQL deployment
Cloud storage for PDFs
User profile management
More quiz question types
Quiz history
Study progress tracking
Multi-language summaries
More advanced OCR support
Cloud deployment

23. Conclusion

PDF Study Assistant combines web development, authentication, database management, PDF processing, OCR, and generative AI into one application.
The system helps students convert PDF study material into structured study notes and interactive quizzes through a simple web interface.
