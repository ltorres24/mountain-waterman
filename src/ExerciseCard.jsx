export default function ExerciseCard({ name, goal, intensity, sets, onAddSet, onUpdateSet }) {
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