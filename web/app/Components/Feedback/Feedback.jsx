import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Feedback() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error("Feedback submission error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .feedback-section {
          width: 100%;
          background: #f4f4f4;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .feedback-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #b8d4ee 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.45;
          pointer-events: none;
        }

        .feedback-inner {
          max-width: 1700px;
          margin: 0 auto;
          padding: 40px 60px 50px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          min-height: 300px;
          box-sizing: border-box;
        }

        .fb-content-left {
          flex: 1;
          text-align: left;
        }

        .fb-content-right {
          flex: 0 0 auto;
          margin-right: 60px;
        }

        .fb-headline {
          font-size: clamp(16px, 3vw, 32px);
          line-height: 1.1;
          font-weight: 700;
          color: #0d47a1;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
          margin-bottom: 16px;
          max-width: 800px;
        }

        .fb-description {
          font-size: 14px;
          line-height: 1.5;
          color: #555;
          max-width: 600px;
        }

        .fb-open-btn {
          background: #87CEEB;
          color: #333;
          border: none;
          border-radius: 8px;
          padding: 12px 32px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          z-index: 1;
          transition: background-color 0.2s ease;
        }

        .fb-open-btn:hover {
          background: #6BB6D6;
        }

        .fb-open-btn:active {
          background: #5AA3C3;
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }

        .fb-feedback-modal {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 2;
          animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
          width: 100%;
          max-width: 400px;
        }

        .fb-question {
          font-size: 14px;
          font-weight: 500;
          color: #555;
          text-align: center;
        }

        .fb-emoji-ratings {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 10px 0;
        }

        .fb-emoji-btn {
          background: none;
          border: none;
          font-size: 32px;
          cursor: pointer;
          transition: transform 0.2s ease;
          padding: 8px;
          border-radius: 8px;
        }

        .fb-emoji-btn:hover {
          transform: scale(1.2);
          background: #f0f0f0;
        }

        .fb-emoji-btn.selected {
          transform: scale(1.1);
          background: #87CEEB;
        }

        .fb-rating-labels {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 11px;
          color: #888;
          margin-top: -5px;
        }

        .fb-textarea {
          width: 100%;
          min-height: 80px;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          box-sizing: border-box;
          color: #000;
        }

        .fb-textarea:focus {
          outline: none;
          border-color: #87CEEB;
        }

        .fb-submit-btn {
          background: #87CEEB;
          color: #333;
          border: none;
          border-radius: 8px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .fb-submit-btn:hover {
          background: #6BB6D6;
        }

        .fb-thanks {
          font-size: 20px;
          font-weight: 600;
          color: #1565c0;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }

        @media (max-width: 768px) {
          .feedback-inner {
            padding: 30px 20px;
            flex-direction: column;
            align-items: flex-start;
            min-height: auto;
          }
          .fb-content-left {
            margin-bottom: 20px;
          }
          .fb-content-right {
            margin-right: 0;
          }
          .fb-headline {
            font-size: clamp(14px, 4vw, 24px);
            margin-bottom: 12px;
          }
          .fb-description {
            font-size: 12px;
          }
          .fb-open-btn {
            padding: 14px 28px;
            font-size: 15px;
          }
          .fb-feedback-modal {
            max-width: 300px;
            gap: 16px;
          }
          .fb-question {
            font-size: 13px;
          }
          .fb-emoji-ratings {
            gap: 12px;
          }
          .fb-emoji-btn {
            font-size: 28px;
            padding: 6px;
          }
          .fb-textarea {
            font-size: 13px;
            padding: 10px;
            min-height: 70px;
          }
          .fb-submit-btn {
            padding: 8px 20px;
            font-size: 13px;
          }
          .fb-rating-labels {
            justify-content: flex-start;
            gap: 20px;
          }
        }

        @media (max-width: 480px) {
          .feedback-inner {
            padding: 20px 16px;
          }
          .fb-content-left {
            margin-bottom: 30px;
          }
          .fb-headline {
            font-size: clamp(12px, 5vw, 20px);
            margin-bottom: 10px;
          }
          .fb-description {
            font-size: 11px;
            margin-bottom: 20px;
          }
          .fb-feedback-modal {
            max-width: 280px;
            gap: 14px;
            align-items: flex-start;
          }
          .fb-question {
            font-size: 12px;
            text-align: left;
          }
          .fb-emoji-ratings {
            gap: 10px;
            margin: 6px 0;
            justify-content: flex-start;
          }
          .fb-emoji-btn {
            font-size: 24px;
            padding: 5px;
            border-radius: 6px;
          }
          .fb-textarea {
            font-size: 12px;
            padding: 8px;
            min-height: 60px;
            border-radius: 6px;
          }
          .fb-submit-btn {
            padding: 6px 16px;
            font-size: 12px;
            border-radius: 6px;
          }
          .fb-open-btn {
            padding: 8px 16px;
            font-size: 12px;
          }
          .fb-content-right {
            margin-right: 0;
          }
        }
      `}</style>

      <section className="feedback-section">
        <div className="feedback-inner">

          <div className="fb-content-left">
            <h2 className="fb-headline">
              HOW WAS YOUR VISIT?<br />
              <span>TELL US WHAT YOU THINK</span>
            </h2>
            <p className="fb-description">
              Your feedback helps us improve our library services and create a better experience for everyone. Share your thoughts and wishlist books with us.
            </p>
          </div>

          <div className="fb-content-right">
            {!showFeedback && !submitted && (
              <button className="fb-open-btn" onClick={() => setShowFeedback(true)}>
                Give us your feedback
              </button>
            )}

            {showFeedback && !submitted && (
              <div className="fb-feedback-modal">
                <p className="fb-question">What was your experience while using library?</p>

                <div className="fb-emoji-ratings">
                  {['😞', '😕', '😐', '😊', '😍'].map((emoji, index) => (
                    <button
                      key={index}
                      className={`fb-emoji-btn${rating === index + 1 ? " selected" : ""}`}
                      onClick={() => setRating(index + 1)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <div className="fb-rating-labels">
                  <span>Dissatisfied</span>
                  <span>Satisfied</span>
                </div>

                <textarea
                  className="fb-textarea"
                  placeholder="What do you think of the website? Do you have books you want uploaded?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {error && (
                  <p style={{ color: "#dc2626", fontSize: "12px", margin: 0 }}>{error}</p>
                )}

                <button 
                  className="fb-submit-btn" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            )}

            {submitted && (
              <p className="fb-thanks">Thanks for your feedback! 🎉</p>
            )}
          </div>

        </div>
      </section>
    </>
  );
}