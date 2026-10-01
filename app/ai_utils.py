import os
import json
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=GEMINI_API_KEY)


def call_gemini(prompt, max_output_tokens=2500):
    """
    Generate a Gemini response with a low thinking level
    to keep the study app responsive.
    """

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    thinking_config=types.ThinkingConfig(
                        thinking_level="low"
                    ),
                    max_output_tokens=max_output_tokens
                )
            )

            return response.text

        except Exception as error:
            error_message = str(error)

            if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
                if attempt < 2:
                    time.sleep(5)
                    continue

                raise RuntimeError(
                    "Gemini API limit reached. Please try again later."
                )

            if "503" in error_message or "UNAVAILABLE" in error_message:
                if attempt < 2:
                    time.sleep(5)
                    continue

                raise RuntimeError(
                    "Gemini service is temporarily unavailable. Please try again."
                )

            raise error


def generate_summary(text: str):

    prompt = f"""
You are an expert study assistant.

Create clear study notes from the following PDF content.

Requirements:
- Use ONLY the supplied material.
- Use simple student-friendly language.
- Keep important technical terms.
- Explain difficult terms simply.
- Use headings and bullet points.
- Include important definitions.
- Include important differences when useful.
- Include key points for revision.
- Include a short quick-revision section.
- End with a short final takeaway.
- Do not invent information.
- Do not write a long essay.
- Use Markdown.

PDF CONTENT:

{text}
"""

    try:
        return call_gemini(prompt, max_output_tokens=3000)

    except Exception as error:
        return f"AI Summary could not be generated.\n\n{str(error)}"


def generate_quiz(text: str):

    prompt = f"""
You are a helpful study assistant.

Create exactly 5 multiple-choice questions using ONLY the study material below.

Return ONLY valid JSON.

Format:

[
  {{
    "question": "Question text",
    "options": {{
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    }},
    "correct_answer": "A"
  }}
]

Rules:
- Exactly 5 questions
- Exactly 4 options per question
- Options must be A, B, C and D
- Exactly one correct answer per question
- Questions must be based only on the PDF
- No explanations
- No Markdown
- Return only the JSON array

PDF CONTENT:

{text}
"""

    try:
        quiz_text = call_gemini(prompt, max_output_tokens=1500)

        # Remove accidental Markdown fences if Gemini adds them.
        quiz_text = quiz_text.strip()

        if quiz_text.startswith("```"):
            quiz_text = quiz_text.replace("```json", "", 1)
            quiz_text = quiz_text.replace("```", "")
            quiz_text = quiz_text.strip()

        # Validate JSON before sending it to the frontend.
        quiz_data = json.loads(quiz_text)

        if not isinstance(quiz_data, list):
            raise ValueError("Gemini did not return a JSON array.")

        if len(quiz_data) == 0:
            raise ValueError("No quiz questions were generated.")

        return json.dumps(quiz_data, ensure_ascii=False)

    except Exception as error:

        return json.dumps({
            "error": f"AI quiz could not be generated. {str(error)}"
        })