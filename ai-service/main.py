
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="AI Interview Engine",
    description="Python service for evaluating interview answers",
    version="1.0.0"
)


# Step 1: Define the input data
class EvaluationRequest(BaseModel):
    question: str
    answer: str
    expected_keywords: list[str]


# Step 2: Create the home page
@app.get("/")
def home():
    return {
        "message": "AI Interview Engine is running!",
        "status": "success"
    }


# Step 3: Check service health
@app.get("/health")
def health_check():
    return {
        "service": "AI Interview Engine",
        "status": "healthy"
    }


# Step 4: Evaluate an interview answer
@app.post("/evaluate")
def evaluate_answer(request: EvaluationRequest):

    answer = request.answer.lower()

    matched_keywords = []
    missing_keywords = []

    for keyword in request.expected_keywords:

        if keyword.lower() in answer:
            matched_keywords.append(keyword)
        else:
            missing_keywords.append(keyword)

    total_keywords = len(request.expected_keywords)

    if total_keywords > 0:
        score = round(
            (len(matched_keywords) / total_keywords) * 100
        )
    else:
        score = 0

    if score >= 80:
        feedback = "Good answer! Most important concepts are covered."
    elif score >= 50:
        feedback = "Average answer. Some important concepts are missing."
    else:
        feedback = "Needs improvement. Review the key concepts."

    return {
        "question": request.question,
        "score": score,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "feedback": feedback
    }
