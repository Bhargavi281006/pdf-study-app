from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import User
from .auth import hash_password


router = APIRouter()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/users")
def create_user(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == email
    ).first()


    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    hashed_password = hash_password(password)


    user = User(
        name=name,
        email=email,
        password=hashed_password
    )


    db.add(user)

    db.commit()

    db.refresh(user)


    return {
        "message": "User created successfully",
        "user_id": user.id,
        "name": user.name,
        "email": user.email
    }