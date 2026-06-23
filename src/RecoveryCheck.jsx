export default function RecoveryCheck({ recovery, setRecovery }) {
  function update(field, value) {
    setRecovery({
      ...recovery,
      [field]: Number(value),
    });
  }

  const score =
    100 -
    recovery.stress * 8 -
    recovery.shoulder * 6 -
    recovery.elbow * 6 -
    recovery.neck * 5 -
    recovery.hip * 5 -
    recovery.back * 5 +
    recovery.sleep * 4 +
    recovery.energy * 4;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  let status = "Green";
  if (finalScore < 70) status = "Yellow";
  if (finalScore < 50) status = "Red";

  return (
    <div className="card wide">
      <h2>Recovery Check</h2>

      <div className="score-box">
        <div className={`score ${status.toLowerCase()}`}>{finalScore}%</div>
        <div>
          <h3>{status} Day</h3>
          <p>
            {status === "Green" && "Train normally."}
            {status === "Yellow" && "Keep main lifts, reduce accessories."}
            {status === "Red" && "Mobility, correctives, and light technique only."}
          </p>
        </div>
      </div>

      {[
        ["sleep", "Sleep Quality"],
        ["energy", "Energy"],
        ["stress", "Stress"],
        ["shoulder", "Shoulder Pain"],
        ["elbow", "Elbow Pain"],
        ["neck", "Neck Tightness"],
        ["hip", "Hip Pain"],
        ["back", "Back Pain"],
      ].map(([key, label]) => (
        <label className="slider-row" key={key}>
          <span>{label}: {recovery[key]}</span>
          <input
            type="range"
            min="0"
            max="10"
            value={recovery[key]}
            onChange={(e) => update(key, e.target.value)}
          />
        </label>
      ))}
    </div>
  );
}