import React, { useState } from "react";
import {
  Home,
  Dumbbell,
  BarChart3,
  HeartPulse,
  Settings,
} from "lucide-react";

import { workouts, targets } from "./data";
import { useLocalStorage } from "./useLocalStorage";
import "./style.css";

export default function App() {
  const [tab, setTab] = useState("home");
  const [day, setDay] = useLocalStorage("mw-day", "Monday");
  const [readiness, setReadiness] = useLocalStorage("mw-readiness", "Green");
  const [completed, setCompleted] = useLocalStorage("mw-completed", []);
  const [logs, setLogs] = useLocalStorage("mw-logs", {});

  const workout = workouts[day];

  function addSet(exerciseName) {
    const key = `${day}-${exerciseName}`;
    const current = logs[key] || [];
    setLogs({
      ...logs,
      [key]: [...current, { weight: "", reps: "", rpe: "" }],
    });
  }

  function updateSet(exerciseName, index, field, value) {
    const key = `${day}-${exerciseName}`;
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
        day,
        title: workout.title,
        readiness,
      },
      ...completed,
    ]);
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Mountain Waterman v3.0</p>
        <h1>Training Mission Control</h1>
        <p>Strength · Surf · Trail · Freedive · Spearfish</p>
      </header>

      <main>
        {tab === "home" && (
          <section className="grid">
            <div className="card">
              <h2>Today's Mission</h2>
              <p>{workout.title}</p>
              <p>{workout.focus}</p>
            </div>

            <div className="card">
              <h2>Readiness</h2>
              <p>{readiness} Day</p>
              <div className="button-row">
                {["Green", "Yellow", "Red"].map((r) => (
                  <button
                    key={r}
                    className={readiness === r ? "selected" : ""}
                    onClick={() => setReadiness(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="card wide">
              <h2>Recent Workouts</h2>
              {completed.length === 0 ? (
                <p>No workouts completed yet.</p>
              ) : (
                completed.slice(0, 5).map((w, i) => (
                  <div className="history" key={i}>
                    {w.date} · {w.day} · {w.title} · {w.readiness}
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
              {Object.keys(workouts).map((d) => (
                <button
                  key={d}
                  className={day === d ? "selected" : ""}
                  onClick={() => setDay(d)}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="exercise-list">
              {workout.exercises.map(([name, goal, intensity]) => {
                const key = `${day}-${name}`;
                const sets = logs[key] || [];

                return (
                  <div className="exercise" key={name}>
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
                          onChange={(e) =>
                            updateSet(name, i, "weight", e.target.value)
                          }
                        />
                        <input
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) =>
                            updateSet(name, i, "reps", e.target.value)
                          }
                        />
                        <input
                          placeholder="RPE"
                          value={set.rpe}
                          onChange={(e) =>
                            updateSet(name, i, "rpe", e.target.value)
                          }
                        />
                      </div>
                    ))}

                    <button onClick={() => addSet(name)}>+ Add Set</button>
                  </div>
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
                <progress value={Math.round((current / target) * 100)} max="100" />
              </div>
            ))}
          </section>
        )}

        {tab === "recovery" && (
          <section className="grid">
            <div className="card">
              <h2>Shoulders</h2>
              <p>Face pulls, wall slides, serratus work, mace 360s.</p>
            </div>
            <div className="card">
              <h2>Neck / Traps</h2>
              <p>Chin tucks, dead hangs, thoracic mobility, lower traps.</p>
            </div>
            <div className="card">
              <h2>Elbows</h2>
              <p>Hammer curls, reverse curls, wrist extensor work.</p>
            </div>
            <div className="card">
              <h2>Hips / Glutes</h2>
              <p>Monster walks, hip airplanes, GHD work, split squats.</p>
            </div>
          </section>
        )}

        {tab === "more" && (
          <section className="card">
            <h2>App Notes</h2>
            <p>
              Data is currently saved locally on your device. Next: recovery
              score, pain tracker, and automatic recommendations.
            </p>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <button onClick={() => setTab("home")} className={tab === "home" ? "active" : ""}>
          <Home /> Home
        </button>
        <button onClick={() => setTab("train")} className={tab === "train" ? "active" : ""}>
          <Dumbbell /> Train
        </button>
        <button onClick={() => setTab("progress")} className={tab === "progress" ? "active" : ""}>
          <BarChart3 /> Progress
        </button>
        <button onClick={() => setTab("recovery")} className={tab === "recovery" ? "active" : ""}>
          <HeartPulse /> Recovery
        </button>
        <button onClick={() => setTab("more")} className={tab === "more" ? "active" : ""}>
          <Settings /> More
        </button>
      </nav>
    </div>
  );
}