import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  Dumbbell,
  HeartPulse,
  BarChart3,
  Settings,
  CheckCircle2,
  Circle,
  TimerReset,
} from "lucide-react";
import "./style.css";

const workouts = {
  Monday: {
    title: "Heavy Squat Day",
    focus: "Raw strength + pulling volume",
    exercises: [
      { name: "Box Jump", goal: "3 x 3", load: "", rpe: "5" },
      { name: "Back Squat", goal: "5 x 5", load: "175", rpe: "6–7" },
      { name: "Bench Press", goal: "4 x 6", load: "115", rpe: "7" },
      { name: "Pull-up", goal: "4 x 5", load: "BW", rpe: "1–2 RIR" },
      { name: "Romanian Deadlift", goal: "3 x 8", load: "", rpe: "7" },
      { name: "Face Pull", goal: "3 x 15", load: "", rpe: "Easy" },
      { name: "Cable Y Raise", goal: "2 x 12", load: "", rpe: "Easy" },
      { name: "Hammer Curl", goal: "2 x 12", load: "", rpe: "Easy" },
      { name: "Cable Chop", goal: "3 x 10/side", load: "", rpe: "Controlled" },
      { name: "Ab Wheel", goal: "3 x 8", load: "", rpe: "Controlled" },
      { name: "Farmer Carry", goal: "4 x 40 yd", load: "", rpe: "Heavy" },
    ],
  },
  Wednesday: {
    title: "Light Squat + Press",
    focus: "Technique + overhead strength + shoulder health",
    exercises: [
      { name: "KB Swing", goal: "4 x 8", load: "", rpe: "Fast" },
      { name: "Tempo Squat", goal: "4 x 5", load: "", rpe: "6" },
      { name: "Standing Press", goal: "5 x 5", load: "75", rpe: "6–7" },
      { name: "Single-arm Cable Row", goal: "4 x 10/side", load: "", rpe: "7" },
      { name: "Neutral-grip Pull-up", goal: "3 sets", load: "BW", rpe: "Stop 2 short" },
      { name: "GHD Hip Extension", goal: "3 x 12", load: "", rpe: "Controlled" },
      { name: "Mace 360", goal: "3 x 10/dir", load: "", rpe: "Light" },
      { name: "Band External Rotation", goal: "3 x 15", load: "", rpe: "Easy" },
      { name: "Chin Tucks", goal: "2 x 15", load: "", rpe: "Easy" },
      { name: "Side Plank", goal: "3 x 30–45 sec", load: "", rpe: "Controlled" },
    ],
  },
  Friday: {
    title: "Front Squat + Athletic Strength",
    focus: "Medium squat + carries + unilateral strength",
    exercises: [
      { name: "Hang Power Clean", goal: "4 x 3", load: "", rpe: "Fast" },
      { name: "Front Squat", goal: "4 x 5", load: "115", rpe: "6" },
      { name: "Incline DB Press", goal: "4 x 8", load: "", rpe: "7" },
      { name: "Chest-supported DB Row", goal: "4 x 10", load: "", rpe: "7" },
      { name: "Bulgarian Split Squat", goal: "3 x 8/leg", load: "", rpe: "Controlled" },
      { name: "GHD Glute-Ham Raise", goal: "3 x 6–8", load: "", rpe: "Controlled" },
      { name: "Bottom-up KB Carry", goal: "3 x 30 yd/arm", load: "", rpe: "Moderate" },
      { name: "Cable Lift", goal: "3 x 10/side", load: "", rpe: "Controlled" },
      { name: "Dead Hang", goal: "3 sets", load: "BW", rpe: "Near max" },
      { name: "Suitcase Carry", goal: "3 x 40 yd/side", load: "", rpe: "Heavy" },
    ],
  },
};

const targets = [
  ["Back Squat", 230, 315],
  ["Front Squat", 170, 245],
  ["Deadlift", 250, 365],
  ["Bench Press", 160, 225],
  ["Overhead Press", 100, 145],
  ["Pull-ups", 10, 18],
];

function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [tab, setTab] = useState("home");
  const [day, setDay] = useState("Monday");
  const [readiness, setReadiness] = useLocalStorage("mw-readiness", "Green");
  const [logs, setLogs] = useLocalStorage("mw-logs", {});
  const [completed, setCompleted] = useLocalStorage("mw-completed", []);
  const [timer, setTimer] = useState(120);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (timer <= 0) {
      setRunning(false);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, timer]);

  const workout = workouts[day];

  function updateSet(exercise, setIndex, field, value) {
    const key = `${day}-${exercise}`;
    const existing = logs[key] || [];
    const updated = [...existing];

    updated[setIndex] = {
      weight: "",
      reps: "",
      rpe: "",
      ...(updated[setIndex] || {}),
      [field]: value,
    };

    setLogs({ ...logs, [key]: updated });
  }

  function addSet(exercise) {
    const key = `${day}-${exercise}`;
    const existing = logs[key] || [];
    setLogs({
      ...logs,
      [key]: [...existing, { weight: "", reps: "", rpe: "" }],
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

  function timeDisplay(sec) {
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  }

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Mountain Waterman v2.0</p>
        <h1>Training Mission Control</h1>
        <p>Leon Torres · Strength · Surf · Trail · Freedive · Spearfish</p>
      </header>

      <main>
        {tab === "home" && (
          <section className="grid">
            <Card title="Today’s Focus" text="Foundation Block: build strength, control, durability, and pain-free momentum." />
            <Card title="Readiness" text={`Current status: ${readiness}`} />

            <div className="card wide">
              <h2>Readiness Check</h2>
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
              <p>
                Green = full session. Yellow = keep main lifts, reduce accessories.
                Red = mobility, correctives, and light technique only.
              </p>
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

            <div className="timer">
              <TimerReset />
              <strong>{timeDisplay(timer)}</strong>
              <button onClick={() => setTimer(60)}>1:00</button>
              <button onClick={() => setTimer(120)}>2:00</button>
              <button onClick={() => setTimer(180)}>3:00</button>
              <button onClick={() => setRunning(!running)}>
                {running ? "Pause" : "Start"}
              </button>
            </div>

            <div className="exercise-list">
              {workout.exercises.map((ex) => {
                const key = `${day}-${ex.name}`;
                const sets = logs[key] || [];

                return (
                  <div className="exercise" key={ex.name}>
                    <div className="exercise-head">
                      <div>
                        <h3>{ex.name}</h3>
                        <p>
                          Goal: {ex.goal} · Load: {ex.load || "TBD"} · RPE: {ex.rpe}
                        </p>
                      </div>
                      {sets.length > 0 ? <CheckCircle2 /> : <Circle />}
                    </div>

                    {sets.map((set, i) => (
                      <div className="set-row" key={i}>
                        <span>Set {i + 1}</span>
                        <input
                          placeholder="Weight"
                          value={set.weight}
                          onChange={(e) => updateSet(ex.name, i, "weight", e.target.value)}
                        />
                        <input
                          placeholder="Reps"
                          value={set.reps}
                          onChange={(e) => updateSet(ex.name, i, "reps", e.target.value)}
                        />
                        <input
                          placeholder="RPE"
                          value={set.rpe}
                          onChange={(e) => updateSet(ex.name, i, "rpe", e.target.value)}
                        />
                      </div>
                    ))}

                    <button onClick={() => addSet(ex.name)}>+ Add Set</button>
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
            <Card title="Shoulders" text="Face pulls, wall slides, serratus work, mace 360s, bottom-up carries." />
            <Card title="Neck / Traps" text="Chin tucks, dead hangs, thoracic extension, lower trap raises." />
            <Card title="Elbows" text="Hammer curls, reverse curls, wrist extensor eccentrics, pronation/supination." />
            <Card title="Hips / Glutes" text="Monster walks, hip airplanes, GHD work, split squats." />
            <Card title="Core" text="Dead bug, bird dog, Pallof press, ab wheel, suitcase carry." />
          </section>
        )}

        {tab === "more" && (
          <section className="card">
            <h2>App Notes</h2>
            <p>
              This version saves your data locally on your phone. Next upgrade:
              automatic progression, pain score tracking, and a 16-week calendar.
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

function Card({ title, text }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
