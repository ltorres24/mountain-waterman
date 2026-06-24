import { useState } from "react";
import { videoLinks } from "./videoLinks";

export default function ExerciseCard({
  name,
  goal,
  intensity,
  sets,
  onAddSet,
  onUpdateSet,
}) {
  const [showHistory, setShowHistory] = useState(false);

  const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    name + " exercise proper form"
  )}`;

  const videoUrl = videoLinks[name] || fallbackUrl;

  return (
    <div className="exercise">
      <div className="exercise-head">
        <div>
          <h3>{name}</h3>
          <p>
            <strong>Prescription:</strong> {goal} · {intensity}
          </p>
        </div>
      </div>

      <div className="exercise-actions">
        <a
          className="video-link"
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
        >
          ▶ Demo Video
        </a>

        <button
          className="history-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide History" : "History"}
        </button>
      </div>

      {showHistory && (
        <div className="history-box">
          {sets.length === 0 ? (
            <p>No history yet.</p>
          ) : (
            sets.map((set, i) => (
              <div className="history-row" key={i}>
                <strong>Set {i + 1}</strong>

                <div>Weight: {set.weight || "--"}</div>

                <div>Reps: {set.reps || "--"}</div>

                <div>RPE: {set.rpe || "--"}</div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="log-section">
        <h4>Today's Sets</h4>

        {sets.map((set, i) => (
          <div className="set-row" key={i}>
            <span>Set {i + 1}</span>

            <input
              placeholder="Weight"
              value={set.weight}
              onChange={(e) =>
                onUpdateSet(i, "weight", e.target.value)
              }
            />

            <input
              placeholder="Reps"
              value={set.reps}
              onChange={(e) =>
                onUpdateSet(i, "reps", e.target.value)
              }
            />

            <input
              placeholder="RPE"
              value={set.rpe}
              onChange={(e) =>
                onUpdateSet(i, "rpe", e.target.value)
              }
            />
          </div>
        ))}

        <button onClick={onAddSet}>+ Add Set</button>
      </div>
    </div>
  );
}