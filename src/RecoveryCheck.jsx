export default function RecoveryCheck({
  recovery,
  setRecovery,
  onStatusChange,
}) {
  function update(field, value) {
    const next = {
      ...recovery,
      [field]: Number(value),
    };

    setRecovery(next);

    const score =
      100 -
      next.stress * 8 -
      next.shoulder * 6 -
      next.elbow * 6 -
      next.neck * 5 -
      next.hip * 5 -
      next.back * 5 +
      next.sleep * 4 +
      next.energy * 4;

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    let status = "Green";

    if (finalScore < 70) status = "Yellow";
    if (finalScore < 50) status = "Red";

    onStatusChange(status);
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
        <div className={`score ${status.toLowerCase()}`}>
          {finalScore}%
        </div>

        <div>
          <h3>{status} Day</h3>

          <p>
            {status === "Green" &&
              "Train normally. Full intensity."}

            {status === "Yellow" &&
              "Keep main lifts. Reduce accessory volume 25%."}

            {status === "Red" &&
              "Mobility, Zone 2, and corrective work only."}
          </p>
        </div>
      </div>

      {[
        ["sleep", "Sleep"],
        ["energy", "Energy"],
        ["stress", "Stress"],
        ["shoulder", "Shoulder Pain"],
        ["elbow", "Elbow Pain"],
        ["neck", "Neck Tightness"],
        ["hip", "Hip Pain"],
        ["back", "Back Pain"],
      ].map(([key, label]) => (
        <label className="slider-row" key={key}>
          <span>
            {label}: {recovery[key]}
          </span>

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