import os
import json

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from .ai_utils import generate_summary, generate_quiz
from .auth import get_current_user
from .database import SessionLocal
from .models import Material, User
from .pdf_utils import extract_text_from_pdf


router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# =====================================================
# UPLOAD PDF
# =====================================================

@router.post("/materials/upload")
async def upload_material(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file_content = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(file_content)

    # Extract text from the PDF
    extracted_text = extract_text_from_pdf(file_path)

    material = Material(
        filename=file.filename,
        file_path=file_path,
        extracted_text=extracted_text,
        owner_id=current_user.id
    )

    db.add(material)
    db.commit()
    db.refresh(material)

    return {
        "message": "PDF uploaded successfully",
        "material_id": material.id,
        "filename": material.filename,
        "owner_id": current_user.id,
        "text_length": len(extracted_text)
    }


# =====================================================
# GET ALL MATERIALS FOR CURRENT USER
# =====================================================

@router.get("/materials")
def get_materials(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    materials = db.query(Material).filter(
        Material.owner_id == current_user.id
    ).order_by(
        Material.id.desc()
    ).all()

    return [
        {
            "material_id": material.id,
            "filename": material.filename,
            "text_length": len(
                material.extracted_text or ""
            )
        }
        for material in materials
    ]


# =====================================================
# GENERATE SUMMARY
# =====================================================

@router.post("/materials/{material_id}/summary")
def generate_material_summary(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    material = db.query(Material).filter(
        Material.id == material_id,
        Material.owner_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    if not material.extracted_text:
        raise HTTPException(
            status_code=400,
            detail="No extracted text available for this PDF"
        )

    summary = generate_summary(
        material.extracted_text
    )

    return {
        "material_id": material.id,
        "filename": material.filename,
        "summary": summary
    }


# =====================================================
# GENERATE QUIZ
# =====================================================

@router.post("/materials/{material_id}/quiz")
def generate_material_quiz(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    material = db.query(Material).filter(
        Material.id == material_id,
        Material.owner_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    if not material.extracted_text:
        raise HTTPException(
            status_code=400,
            detail="No extracted text available for this PDF"
        )

    quiz = generate_quiz(
        material.extracted_text
    )

    return {
        "material_id": material.id,
        "filename": material.filename,
        "quiz": json.loads(quiz)
    }
@router.delete("/materials/{material_id}")
def delete_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    material = db.query(Material).filter(
        Material.id == material_id,
        Material.owner_id == current_user.id
    ).first()

    if not material:
        raise HTTPException(
            status_code=404,
            detail="Material not found"
        )

    # Delete the PDF file from uploads/
    if os.path.exists(material.file_path):
        os.remove(material.file_path)

    # Delete the database record
    db.delete(material)
    db.commit()

    return {
        "message": "PDF removed successfully",
        "material_id": material_id
    }