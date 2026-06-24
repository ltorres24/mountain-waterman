import React, { useState } from "react";

import { phases, targets, warmups, conditioning } from "./data";
import { useLocalStorage } from "./useLocalStorage";
import ExerciseCard from "./ExerciseCard.jsx";
import RecoveryCheck from "./RecoveryCheck.jsx";
import BottomNav from "./components/BottomNav.jsx";
import AthleteProfile from "./AthleteProfile.jsx";
import "./style.css";

export default function App() {
  const [tab, setTab] = useState("home");
  const [phase, setPhase] = useLocalStorage("mw-phase", "Phase1");
  const [day, setDay] = useLocalStorage("mw-day", "Monday");
  const [readiness, setReadiness] = useLocalStorage("mw-readiness", "Green");
  const [completed, setCompleted] = useLocalStorage("mw-completed", []);
  const [logs, setLogs] = useLocalStorage("mw-logs", {});
  const [recovery, setRecovery] = useLocalStorage("mw-recovery", {
    sleep: 6,
    energy: 6,
    stress: 3,
    shoulder: 2,
    elbow: 2,
    neck: 3,
    hip: 2,
    back: 2,
  });

  const currentPhase = phases[phase];
  const workout = currentPhase[day];

  function addSet(exercise) {
    const key = `${phase}-${day}-${exercise}`;
    const current = logs[key] || [];

    setLogs({
      ...logs,
      [key]: [...current, { weight: "", reps: "", rpe: "" }],
    });
  }

  function updateSet(exercise, index, field, value) {
    const key = `${phase}-${day}-${exercise}`;
    const current = [...(logs[key] || [])];

    current[index] = {
      weight: "",
      reps: "",
      rpe: "",
      ...(current[index] || {}),
      [field]: value,
    };

    setLogs({
      ...logs,
      [key]: current,
    });
  }

  function completeWorkout() {
    setCompleted([
      {
        date: new Date().toLocaleDateString(),
        phase: currentPhase.name,
        title: workout.title,
        day,
        readiness,
      },
      ...completed,
    ]);
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Mountain Waterman v4.0</p>
        <h1>Training Mission Control</h1>
        <p>{currentPhase.name}</p>
      </header>

      <main>
        {tab === "home" && (
          <section className="grid">
            <div className="card">
              <h2>Today's Mission</h2>
              <h3>{workout.title}</h3>
              <p>{workout.focus}</p>

              <hr />

              <h3>
                {readiness === "Green" && "🟢 Green Day"}
                {readiness === "Yellow" && "🟡 Yellow Day"}
                {readiness === "Red" && "🔴 Red Day"}
              </h3>

              <p>
                {readiness === "Green" && "Train normally."}
                {readiness === "Yellow" &&
                  "Keep the main lifts. Reduce accessory work by about 25%."}
                {readiness === "Red" &&
                  "Recovery day. Mobility, Zone 2 and corrective work only."}
              </p>
            </div>

            <div className="card">
              <h2>Program</h2>

              <div className="button-row">
                {Object.keys(phases).map((p) => (
                  <button
                    key={p}
                    className={phase === p ? "selected" : ""}
                    onClick={() => setPhase(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="button-row">
                {["Monday", "Wednesday", "Friday"].map((d) => (
                  <button
                    key={d}
                    className={day === d ? "selected" : ""}
                    onClick={() => setDay(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <RecoveryCheck
              recovery={recovery}
              setRecovery={setRecovery}
              onStatusChange={setReadiness}
            />

            <div className="card wide">
              <h2>Conditioning</h2>
              {Object.entries(conditioning).map(([d, item]) => (
                <p key={d}>
                  <strong>{d}:</strong> {item}
                </p>
              ))}
            </div>

            <div className="card wide">
              <h2>Recent Workouts</h2>

              {completed.length === 0 ? (
                <p>No workouts completed yet.</p>
              ) : (
                completed.slice(0, 5).map((w, i) => (
                  <div className="history" key={i}>
                    {w.date} • {w.phase} • {w.day} • {w.title} • {w.readiness}
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {tab === "train" && (
          <section className="card">
            <h2>{workout.title}</h2>
            <p>{workout.focus}</p>

            <div className="button-row">
              {Object.keys(phases).map((p) => (
                <button
                  key={p}
                  className={phase === p ? "selected" : ""}
                  onClick={() => setPhase(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="button-row">
              {["Monday", "Wednesday", "Friday"].map((d) => (
                <button
                  key={d}
                  className={day === d ? "selected" : ""}
                  onClick={() => setDay(d)}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="card warmup-card">
              <h2>Warm-up</h2>
              <ul>
                {warmups[day].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="exercise-list">
              {workout.exercises.map(([name, goal, intensity]) => {
                const key = `${phase}-${day}-${name}`;
                const sets = logs[key] || [];

                return (
                  <ExerciseCard
                    key={key}
                    name={name}
                    goal={goal}
                    intensity={intensity}
                    sets={sets}
                    onAddSet={() => addSet(name)}
                    onUpdateSet={(index, field, value) =>
                      updateSet(name, index, field, value)
                    }
                  />
                );
              })}
            </div>

            <button className="complete" onClick={completeWorkout}>
              Complete Workout
            </button>
          </section>
        )}

        {tab === "progress" && (
          <section className="card">
            <h2>Strength Targets</h2>

            {targets.map(([name, current, target]) => (
              <div className="target" key={name}>
                <div>
                  <strong>{name}</strong>
                  <span>
                    {current} → {target}
                    {name === "Pull-ups" ? " reps" : " lb"}
                  </span>
                </div>

                <progress
                  value={Math.round((current / target) * 100)}
                  max="100"
                />
              </div>
            ))}
          </section>
        )}

        {tab === "recovery" && (
          <RecoveryCheck
            recovery={recovery}
            setRecovery={setRecovery}
            onStatusChange={setReadiness}
          />
        )}

        {tab === "more" && <AthleteProfile />}
      </main>

      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}