import os
import json
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# SUMMARY GENERATION
# ============================================================

def generate_summary(text: str):

    prompt = f"""
You are an expert study-notes creator.

Your task is to convert the following study material into
clean, simple, well-structured study notes.

The notes must help a student:

- understand the topic easily
- learn the topic step by step
- revise quickly before an exam
- remember important definitions
- understand difficult concepts
- distinguish between similar concepts

IMPORTANT RULES:

1. Do NOT write a long essay.
2. Do NOT start with phrases such as:
   "Here is a summary"
   "Here is a clear summary"
   "The study material discusses"
3. Use simple student-friendly language.
4. Keep important technical terms.
5. Explain difficult technical terms in simple language.
6. Use clear headings and subheadings.
7. Use numbered steps when explaining a process.
8. Use bullet points for important information.
9. Give small examples whenever they help understanding.
10. Avoid unnecessary repetition.
11. Do not add unrelated information.
12. Do not invent facts.
13. Use ONLY information from the supplied study material.
14. Make the notes useful for exam preparation.
15. Use Markdown formatting.
16. Make the notes clean and easy to scan.

FOLLOW THIS STRUCTURE:

# [TOPIC NAME]

Write the main topic name as the title.

---

## 1. What is this topic?

Explain the topic in very simple language.

Give a short and clear explanation.

---

## 2. Why is it important?

Explain why this topic is useful or important,
if the information is available in the study material.

---

## 3. How it works

Explain the process step by step.

### Step 1
Explain what happens.

### Step 2
Explain what happens.

### Step 3
Explain what happens.

Use more or fewer steps depending on the study material.

---

## 4. Important Concepts

For every major concept, use this format:

### Concept Name

**Meaning:**
Explain the concept simply.

**How it works:**
Explain how it works.

**Example:**
Give a small example if the material supports one.

Continue for all important concepts.

---

## 5. Important Definitions

Create a clean list:

- **Term:** Simple definition.
- **Term:** Simple definition.
- **Term:** Simple definition.

Include the important technical terms from the material.

---

## 6. Important Differences

If the material contains concepts that students may confuse,
create a comparison table.

Example:

| Concept A | Concept B |
|---|---|
| Difference | Difference |
| Difference | Difference |

Only create this section when a comparison is actually useful.

---

## 7. Key Points to Remember

Use short points.

⭐ **IMPORTANT:** Point 1

⭐ **IMPORTANT:** Point 2

⭐ **IMPORTANT:** Point 3

Include the most important points for revision.

---

## 8. Quick Revision

Create approximately 5 short questions and answers based
ONLY on the study material.

**Q1. What is [concept]?**

**Answer:** Simple answer.

**Q2. Why is [concept] important?**

**Answer:** Simple answer.

**Q3. How does [concept] work?**

**Answer:** Simple answer.

Make the questions useful for exam revision.

---

## 9. Final Takeaway

Give a short 3–5 sentence explanation of the entire topic.

The student should be able to read this section quickly
and remember the main idea.

---

IMPORTANT:

- Keep the language simple.
- Keep the explanations clear.
- Keep the notes organized.
- Do not remove important technical terms.
- Explain technical terms in simple words.
- Do not invent information.
- Do not add information outside the study material.
- Do not write unnecessary introductory sentences.
- Do not write a generic conclusion.
- Make the output look like high-quality student notes.

STUDY MATERIAL:

{text}
"""

    try:

        interaction = client.interactions.create(
            model="gemini-3.8-flash",
            input=prompt
        )

        return interaction.output_text

    except Exception as error:

        error_message = str(error)

        if "429" in error_message or "Rate limit" in error_message:

            return (
                "⚠️ AI Summary Temporarily Unavailable\n\n"
                "The Gemini API free-tier daily request limit "
                "has been reached.\n\n"
                "Please try again after the API limit resets."
            )

        raise error


# ============================================================
# QUIZ GENERATION
# ============================================================

def generate_quiz(text: str):

    prompt = f"""
You are a helpful study assistant.

Read the following study material and create exactly 5
multiple-choice questions.

Return ONLY valid JSON.

The JSON must be an array containing exactly 5 objects.

Each object must have exactly these fields:

- "question"
- "options"
- "correct_answer"

The "options" field must contain exactly:

- "A"
- "B"
- "C"
- "D"

Example format:

[
  {{
    "question": "What is machine learning?",
    "options": {{
      "A": "A type of database",
      "B": "A type of programming language",
      "C": "A method where computers learn from data",
      "D": "A web browser"
    }},
    "correct_answer": "C"
  }}
]

IMPORTANT:

- Create exactly 5 questions.
- Questions must be based ONLY on the study material.
- Keep questions simple and clear.
- Each question must have exactly four options.
- Options must be A, B, C and D.
- Only one option should be correct.
- Do not add explanations.
- Do not add Markdown.
- Do not use ```json.
- Return ONLY the JSON array.

STUDY MATERIAL:

{text}
"""

    for attempt in range(3):

        try:

            interaction = client.interactions.create(
                model="gemini-3.8-flash",
                input=prompt
            )

            quiz_text = interaction.output_text

            return quiz_text

        except Exception as error:

            error_message = str(error)

            if "429" in error_message or "Rate limit" in error_message:

                return json.dumps({
                    "error": (
                        "AI quiz temporarily unavailable because "
                        "the Gemini API free-tier daily request "
                        "limit has been reached."
                    )
                })

            if attempt < 2:

                time.sleep(3)

            else:

                raise error