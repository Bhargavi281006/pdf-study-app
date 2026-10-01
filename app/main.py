from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from . import models
from .users import router as users_router
from .auth import router as auth_router
from .materials import router as materials_router


app = FastAPI(title="PDF Study Assistant API")


# Allow the frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Add API routes
app.include_router(users_router)
app.include_router(auth_router)
app.include_router(materials_router)


@app.get("/")
def home():
    return {
        "message": "PDF Study Assistant is running!"
    }