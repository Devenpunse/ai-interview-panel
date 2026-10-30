
import { useState } from "react";
import "./App.css";

// Sample interview questions
const questionBank = {
  "Python Developer": [
    "What is Python, and what are its main advantages?",
    "What is the difference between a list and a tuple?",
    "Explain object-oriented programming in Python.",
    "What is the difference between == and is in Python?",
    "What are Python decorators?",
  ],
  "React Developer": [
    "What is React, and why is it used?",
    "What is the difference between props and state?",
    "What are React Hooks?",
    "What is the Virtual DOM?",
    "What is the purpose of useEffect?",
  ],
  "Laravel Developer": [
    "What is Laravel, and what are its main features?",
    "What is MVC architecture?",
    "What is Eloquent ORM?",
    "What is middleware in Laravel?",
    "What are Laravel migrations?",
  ],
  "Full Stack Developer": [
    "What is the difference between frontend and backend development?",
    "What is a REST API?",
    "What is the purpose of a database?",
    "Explain HTTP methods GET and POST.",
    "What is authentication?",
  ],
  "Data Analyst": [
    "What is data analysis?",
    "What is the difference between SQL and NoSQL?",
    "What is data cleaning?",
    "What is the difference between mean and median?",
    "What is a data visualization?",
  ],
  "Machine Learning Engineer": [
    "What is machine learning?",
    "Explain supervised and unsupervised learning.",
    "What is overfitting?",
    "What is a training dataset?",
    "What is model evaluation?",
  ],
};

function App() {
  // Dashboard states
  const [jobRole, setJobRole] = useState("Python Developer");
  const [difficulty, setDifficulty] = useState("Beginner");

  // Interview states
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [interviewId, setInterviewId] = useState(null);

  // Interview history states
  const [showHistory, setShowHistory] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Get questions for selected job role
  const questions = questionBank[jobRole];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // Fetch all previous interviews
  const handleShowHistory = async () => {
      setHistoryLoading(true);
      setShowHistory(true);
      setSelectedInterview(null);
      setInterviewStarted(false);
      setInterviewCompleted(false);

      try {
          const response = await fetch(
              'http://127.0.0.1:8000/api/interviews',
              {
                  headers: {
                      'Accept': 'application/json',
                  },
              }
          );

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result.message || 'Could not load history');
          }

          setInterviewHistory(result.data);
      } catch (error) {
          console.error(error);
          alert('Could not load interview history: ' + error.message);
      } finally {
          setHistoryLoading(false);
      }
  };

  // Fetch details of one interview
  const handleViewInterview = async (id) => {
      try {
          const response = await fetch(
              `http://127.0.0.1:8000/api/interviews/${id}`,
              {
                  headers: {
                      'Accept': 'application/json',
                  },
              }
          );

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result.message || 'Could not load interview');
          }

          setSelectedInterview(result.data);
      } catch (error) {
          console.error(error);
          alert('Could not load interview details: ' + error.message);
      }
  };

  // Return to interview history
  const handleBackToHistory = () => {
      setSelectedInterview(null);
  };

  // Start interview
  const handleStartInterview = async () => {
    try {
        const response = await fetch(
            'http://127.0.0.1:8000/api/interviews',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    job_role: jobRole,
                    difficulty: difficulty,
                    total_questions: 5,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || 'Failed to create interview'
            );
        }

        console.log('Interview saved:', result.data);

        setInterviewId(result.data.id);

        setAnswers(Array(5).fill(''));
        setCurrentQuestionIndex(0);
        setInterviewCompleted(false);
        setInterviewStarted(true);

    } catch (error) {
        console.error('Error:', error);
        alert('Could not save interview: ' + error.message);
    }
  };

  // Save candidate answer
  const handleAnswerChange = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
    setAnswers(updatedAnswers);
  };

  // Go to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Go to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit interview
  const handleSubmitInterview = async () => {
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/api/interviews/${interviewId}/answers`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    answers: questions.map((question, index) => ({
                        question_number: index + 1,
                        question_text: question,
                        answer_text: answers[index] || '',
                    })),
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Could not save answers');
        }

        console.log('Answers saved:', result.data);

        setInterviewCompleted(true);
        setInterviewStarted(false);

    } catch (error) {
        console.error('Error:', error);
        alert('Could not save answers: ' + error.message);
    }
  };

  // Restart interview
  const handleRestartInterview = () => {
    setInterviewStarted(false);
    setInterviewCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <span className="logo-icon">AI</span>
          <span>InterviewPanel</span>
        </div>

        <nav>
            <a href="#dashboard" onClick={() => {
                setShowHistory(false);
                setSelectedInterview(null);
                setInterviewCompleted(false);
            }}>
                Dashboard
            </a>

            <a href="#practice">Practice</a>

            <button
                type="button"
                onClick={handleShowHistory}
                className="nav-history-button"
            >
                Interview History
            </button>

            <a href="#about">About</a>
        </nav>

        <div className="profile">DP</div>
      </header>

      <main className="container">

        {/* DASHBOARD */}
        {!interviewStarted && !showHistory && !selectedInterview && !interviewCompleted && (
          <>
            <section className="welcome-section" id="dashboard">
              <p className="eyebrow">
                AI POWERED INTERVIEW PRACTICE
              </p>

              <h1>Prepare for your next big opportunity.</h1>

              <p className="subtitle">
                Practice interviews, improve your answers, and build
                confidence with your personal interview assistant.
              </p>
            </section>

            <section className="dashboard-grid">
              <div className="setup-card">
                <h2>Set up your interview</h2>

                <p className="card-description">
                  Customize your interview before getting started.
                </p>

                <div className="form-group">
                  <label htmlFor="jobRole">Select Job Role</label>

                  <select
                    id="jobRole"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                  >
                    {Object.keys(questionBank).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="difficulty">
                    Interview Difficulty
                  </label>

                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Number of Questions</label>
                  <div className="question-count">
                    5 sample questions
                  </div>
                </div>

                <button
                  className="start-button"
                  onClick={handleStartInterview}
                >
                  Start Interview →
                </button>
              </div>

              <div className="info-card">
                <div className="info-icon">✦</div>

                <h2>Your personal interview assistant</h2>

                <p>
                  Practice technical interviews in a comfortable
                  environment and receive feedback on your answers.
                </p>

                <div className="feature">✓ Role-based questions</div>
                <div className="feature">✓ Multiple difficulty levels</div>
                <div className="feature">✓ Answer evaluation</div>
                <div className="feature">✓ Performance reports</div>
              </div>
            </section>
          </>
        )}

        {/* INTERVIEW HISTORY */}
        {showHistory && !selectedInterview && (
            <section className="interview-card history-card">
                <p className="eyebrow">YOUR PREVIOUS INTERVIEWS</p>

                <h1>Interview History</h1>

                <p className="subtitle">
                    Review your previous interview sessions and answers.
                </p>

                {historyLoading ? (
                    <p>Loading interviews...</p>
                ) : interviewHistory.length === 0 ? (
                    <p>No previous interviews found. Start your first interview!</p>
                ) : (
                    <div className="history-list">
                        {interviewHistory.map((interview) => (
                            <div className="history-item" key={interview.id}>
                                <div>
                                    <h3>{interview.job_role}</h3>

                                    <p>
                                        Difficulty: {interview.difficulty}
                                    </p>

                                    <p>
                                        Questions: {interview.total_questions}
                                    </p>

                                    <p>
                                        Date: {new Date(
                                            interview.created_at
                                        ).toLocaleString()}
                                    </p>

                                    <span className={
                                        interview.status === 'completed'
                                            ? 'status-completed'
                                            : 'status-progress'
                                    }>
                                        {interview.status}
                                    </span>
                                </div>

                                <button
                                    className="secondary-button"
                                    onClick={() => handleViewInterview(interview.id)}
                                >
                                    View Details →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    className="start-button"
                    onClick={() => {
                        setShowHistory(false);
                        setSelectedInterview(null);
                    }}
                >
                    Back to Dashboard
                </button>
            </section>
        )}

        {/* INTERVIEW DETAILS */}
        {selectedInterview && (
            <section className="interview-card history-card">
                <p className="eyebrow">INTERVIEW RESULTS</p>

                <h1>{selectedInterview.job_role}</h1>

                <div className="summary-details">
                    <p>
                        <strong>Difficulty:</strong> {selectedInterview.difficulty}
                    </p>

                    <p>
                        <strong>Status:</strong> {selectedInterview.status}
                    </p>

                    <p>
                        <strong>Total Questions:</strong> {selectedInterview.total_questions}
                    </p>

                    <p>
                        <strong>Date:</strong>{" "}
                        {new Date(selectedInterview.created_at).toLocaleString()}
                    </p>
                </div>

                <h2>Questions and Answers</h2>

                {(selectedInterview.answers || []).length === 0 ? (
                    <p>No answers have been saved for this interview.</p>
                ) : (
                    selectedInterview.answers.map((answer) => (
                        <div className="summary-answer" key={answer.id}>
                            <strong>
                                Question {answer.question_number}: {answer.question_text}
                            </strong>

                            <p>
                                {answer.answer_text?.trim() || "No answer provided."}
                            </p>
                        </div>
                    ))
                )}

                <button
                    className="start-button"
                    onClick={handleBackToHistory}
                >
                    ← Back to History
                </button>
            </section>
        )}

        {/* INTERVIEW ROOM */}
        {interviewStarted && !interviewCompleted && (
          <section className="interview-card">
            <div className="interview-header">
              <div>
                <p className="eyebrow">LIVE INTERVIEW SESSION</p>
                <h1>{jobRole} Interview</h1>
                <p className="subtitle">
                  Difficulty: {difficulty}
                </p>
              </div>

              <button
                className="exit-button"
                onClick={handleRestartInterview}
              >
                Exit Interview
              </button>
            </div>

            <div className="progress-info">
              <span>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>

              <span>{Math.round(progress)}% Completed</span>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="question-section">
              <p className="eyebrow">INTERVIEW QUESTION</p>

              <h2>{currentQuestion}</h2>

              <label htmlFor="answer">Your Answer</label>

              <textarea
                id="answer"
                rows="9"
                placeholder="Write your answer here..."
                value={answers[currentQuestionIndex] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
              />

              <p className="answer-hint">
                Take your time and explain your answer clearly.
              </p>
            </div>

            <div className="interview-actions">
              <button
                className="secondary-button"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  className="start-button next-button"
                  onClick={handleNextQuestion}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  className="start-button next-button"
                  onClick={handleSubmitInterview}
                >
                  Submit Interview
                </button>
              )}
            </div>
          </section>
        )}

        {/* INTERVIEW SUMMARY */}
        {interviewCompleted && (
          <section className="interview-card summary-card">
            <div className="info-icon">✓</div>

            <h1>Interview Submitted!</h1>

            <p className="subtitle">
              You have completed your {jobRole} practice interview.
            </p>

            <div className="summary-details">
              <p><strong>Job Role:</strong> {jobRole}</p>
              <p><strong>Difficulty:</strong> {difficulty}</p>
              <p><strong>Total Questions:</strong> {totalQuestions}</p>
              <p>
                <strong>Answered:</strong>{" "}
                {answers.filter((answer) => answer.trim() !== "").length}
              </p>
            </div>

            <h3>Your submitted answers</h3>

            {questions.map((question, index) => (
              <div className="summary-answer" key={index}>
                <strong>Question {index + 1}: {question}</strong>
                <p>
                  {answers[index]?.trim() || "No answer provided."}
                </p>
              </div>
            ))}

            <button
              className="start-button"
              onClick={handleRestartInterview}
            >
              Back to Dashboard
            </button>
          </section>
        )}

        <footer>
          AI InterviewPanel © 2026 | Built with React
        </footer>
      </main>
    </div>
  );
}

export default App;
