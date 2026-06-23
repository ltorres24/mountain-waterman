import { athlete } from "./athlete";

export default function AthleteProfile() {
  return (
    <section className="grid">
      <div className="card">
        <h2>{athlete.name}</h2>
        <p>{athlete.profile}</p>
        <p>
          {athlete.age} years old · {athlete.height} · {athlete.bodyweight} lb
        </p>
        <p>Sleep: {athlete.sleep}</p>
      </div>

      <div className="card">
        <h2>Current Strength</h2>
        <p>Back Squat: {athlete.currentStrength.backSquat} lb</p>
        <p>Front Squat: {athlete.currentStrength.frontSquat} lb</p>
        <p>Deadlift: {athlete.currentStrength.deadlift} lb</p>
        <p>Bench: {athlete.currentStrength.benchPress} lb</p>
        <p>Overhead Press: {athlete.currentStrength.overheadPress} lb</p>
        <p>Pull-ups: {athlete.currentStrength.pullups}</p>
      </div>

      <div className="card wide">
        <h2>Goals</h2>
        <ul>
          {athlete.goals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ul>
      </div>

      <div className="card wide">
        <h2>Equipment</h2>
        <ul>
          {athlete.equipment.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="card wide">
        <h2>Limitations</h2>
        <ul>
          {athlete.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="card wide">
        <h2>Programming Rules</h2>
        <ul>
          {athlete.programmingRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}