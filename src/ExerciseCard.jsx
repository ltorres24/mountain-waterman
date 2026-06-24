export default function ExerciseCard({
  name,
  goal,
  intensity,
  sets,
  onAddSet,
  onUpdateSet,
}) {
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    name + " exercise proper form"
  )}`;

  return (
    <div className="exercise">
      <div className="exercise-head">
        <div>
          <h3>{name}</h3>
          <p>
            Goal: {goal} · {intensity}
          </p>
        </div>
      </div>

      <a
        className="video-link"
        href={youtubeSearchUrl}
        target="_blank"
        rel="noreferrer"
      >
        Watch Demo Video
      </a>

      {sets.map((set, i) => (
        <div className="set-row" key={i}>
          <span>Set {i + 1}</span>

          <input
            placeholder="Weight"
            value={set.weight}
            onChange={(e) => onUpdateSet(i, "weight", e.target.value)}
          />

          <input
            placeholder="Reps"
            value={set.reps}
            onChange={(e) => onUpdateSet(i, "reps", e.target.value)}
          />

          <input
            placeholder="RPE"
            value={set.rpe}
            onChange={(e) => onUpdateSet(i, "rpe", e.target.value)}
          />
        </div>
      ))}

      <button onClick={onAddSet}>+ Add Set</button>
    </div>
  );
}