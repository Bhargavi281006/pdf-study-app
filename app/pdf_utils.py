import fitz
import pytesseract

from PIL import Image
from io import BytesIO


def extract_text_from_pdf(pdf_path):
    """
    Extract text from a PDF.

    First we try normal PDF text extraction.
    If a page contains little/no text, we use OCR.
    """

    document = fitz.open(pdf_path)

    all_text = []

    for page in document:

        text = page.get_text()

        # Normal PDF text was found
        if text.strip():
            all_text.append(text)

        # No normal text → use OCR
        else:
            pix = page.get_pixmap()

            image_bytes = pix.tobytes("png")

            image = Image.open(
                BytesIO(image_bytes)
            )

            ocr_text = pytesseract.image_to_string(
                image
            )

            all_text.append(ocr_text)

    document.close()

    return "\n".join(all_text)