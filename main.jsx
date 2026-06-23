import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Dumbbell, Waves, Mountain, Activity, HeartPulse, ClipboardList, Save } from 'lucide-react';
import './style.css';

const workouts = {
  Monday: [
    ['Box Jump', '3x3', 'RPE 5'],
    ['Back Squat', '5x5', 'RPE 6–7'],
    ['Bench Press', '4x6', 'RPE 7'],
    ['Pull-up', '4x5', '1–2 RIR'],
    ['Romanian Deadlift', '3x8', 'RPE 7'],
    ['Face Pull', '3x15', 'Easy'],
    ['Cable Y Raise', '2x12', 'Easy'],
    ['Hammer Curl', '2x12', 'Easy'],
    ['Cable Chop', '3x10/side', 'Controlled'],
    ['Ab Wheel', '3x8', 'Controlled'],
    ['Farmer Carry', '4x40 yd', 'Heavy']
  ],
  Wednesday: [
    ['KB Swing', '4x8', 'Fast'],
    ['Tempo Squat', '4x5', 'RPE 6'],
    ['Standing Press', '5x5', 'RPE 6–7'],
    ['Single-arm Cable Row', '4x10/side', 'RPE 7'],
    ['Neutral-grip Pull-up', '3 sets', 'Stop 2 reps short'],
    ['GHD Hip Extension', '3x12', 'Controlled'],
    ['Mace 360', '3x10/dir', 'Light'],
    ['Band External Rotation', '3x15', 'Easy'],
    ['Chin Tucks', '2x15', 'Easy'],
    ['Side Plank', '3x30–45s/side', 'Controlled']
  ],
  Friday: [
    ['Hang Power Clean', '4x3', 'Fast'],
    ['Front Squat', '4x5', 'RPE 6'],
    ['Incline DB Press', '4x8', 'RPE 7'],
    ['Chest-supported DB Row', '4x10', 'RPE 7'],
    ['Bulgarian Split Squat', '3x8/leg', 'Controlled'],
    ['GHD Glute-Ham Raise', '3x6–8', 'Controlled'],
    ['Bottom-up KB Carry', '3x30 yd/arm', 'Moderate'],
    ['Cable Lift', '3x10/side', 'Controlled'],
    ['Dead Hang', '3 sets', 'Near max'],
    ['Suitcase Carry', '3x40 yd/side', 'Heavy']
  ]
};

const warmup = [
  'Foam roll T-spine/lats/glutes/hip flexors — 3 min',
  'Deep squat hold — 60 sec',
  "World's Greatest Stretch — 5/side",
  '90/90 hip switches — 10/side',
  'Band pull-aparts — 20',
  'Wall slides — 12',
  'Monster walks — 15/side',
  'Dead bug — 8/side',
  'Bird dog — 8/side',
  'Pallof press — 10/side'
];

const targets = [
  ['Back Squat', 230, 315],
  ['Front Squat', 170, 245],
  ['Deadlift', 250, 365],
  ['Bench Press', 160, 225],
  ['Overhead Press', 100, 145],
  ['Pull-ups', 10, 18]
];

function App() {
  const [tab, setTab] = useState('Dashboard');
  const [day, setDay] = useState('Monday');
  const [readiness, setReadiness] = useState('Green');
  const [log, setLog] = useState(() => JSON.parse(localStorage.getItem('mwss-log') || '[]'));
  const [entry, setEntry] = useState({ exercise: '', weight: '', reps: '', rpe: '', notes: '' });

  useEffect(() => localStorage.setItem('mwss-log', JSON.stringify(log)), [log]);

  const readinessText = {
    Green: 'Full session. Pain ≤2/10, energy good.',
    Yellow: 'Keep main lifts. Cut accessories 25–30%. Pain 3–5/10 or sleep 5–6 hours.',
    Red: 'Warm-up, light technique, correctives only. Pain >5/10 or poor recovery.'
  }[readiness];

  function addLog() {
    if (!entry.exercise.trim()) return;
    setLog([{ date: new Date().toLocaleDateString(), ...entry }, ...log]);
    setEntry({ exercise: '', weight: '', reps: '', rpe: '', notes: '' });
  }

  return <div className="app">
    <header className="hero">
      <div className="badge"><Waves size={16}/> Mountain Tactical / Waterman</div>
      <h1>Mountain Waterman Strength System</h1>
      <p>Leon Torres · 32 · 6'0&quot; · 205 lb · Strength, surfing, trail running, freediving and spearfishing.</p>
    </header>

    <nav className="tabs">
      {['Dashboard','Workout','Log','Recovery','Targets'].map(t => <button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}
    </nav>

    <main>
      {tab === 'Dashboard' && <section className="grid">
        <Card icon={<Mountain/>} title="Current Phase" body="Weeks 1–4 Foundation: movement quality, tissue tolerance, correctives." />
        <Card icon={<Activity/>} title="Weekly Split" body="Mon lift · Tue Zone 2 · Wed lift · Thu air bike · Fri lift · Sat optional · Sun rest." />
        <div className="card">
          <h2>Readiness</h2>
          <div className="buttons">{['Green','Yellow','Red'].map(x => <button className={readiness===x?'selected':''} onClick={()=>setReadiness(x)} key={x}>{x}</button>)}</div>
          <p>{readinessText}</p>
        </div>
        <div className="card wide">
          <h2>Daily Warm-up</h2>
          <ul>{warmup.map(x => <li key={x}>{x}</li>)}</ul>
        </div>
      </section>}

      {tab === 'Workout' && <section className="card">
        <h2><Dumbbell/> Workout</h2>
        <div className="buttons">{Object.keys(workouts).map(d => <button className={day===d?'selected':''} onClick={()=>setDay(d)} key={d}>{d}</button>)}</div>
        <table><thead><tr><th>Exercise</th><th>Prescription</th><th>Intensity</th></tr></thead>
        <tbody>{workouts[day].map((r,i)=><tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table>
      </section>}

      {tab === 'Log' && <section className="grid">
        <div className="card wide">
          <h2><Save/> Workout Log</h2>
          <div className="form">
            {['exercise','weight','reps','rpe','notes'].map(k => <input key={k} placeholder={k} value={entry[k]} onChange={e=>setEntry({...entry,[k]:e.target.value})}/>)}
            <button onClick={addLog}>Save Set</button>
          </div>
          <table><thead><tr><th>Date</th><th>Exercise</th><th>Weight</th><th>Reps</th><th>RPE</th><th>Notes</th></tr></thead>
          <tbody>{log.map((r,i)=><tr key={i}><td>{r.date}</td><td>{r.exercise}</td><td>{r.weight}</td><td>{r.reps}</td><td>{r.rpe}</td><td>{r.notes}</td></tr>)}</tbody></table>
        </div>
      </section>}

      {tab === 'Recovery' && <section className="grid">
        {[
          ['Shoulders','Face pulls, wall slides, serratus work, mace 360s, bottom-up carries.'],
          ['Neck / Traps','Chin tucks, dead hangs, thoracic extension, lower trap raises, avoid shrugging.'],
          ['Elbows','Hammer curls, reverse curls, wrist extensor eccentrics, pronation/supination.'],
          ['Hips / Glutes','Monster walks, single-leg bridges, hip airplanes, GHD hip extensions.'],
          ['Core','Dead bug, bird dog, Pallof press, side plank, ab wheel, suitcase carry.']
        ].map(x => <Card key={x[0]} icon={<HeartPulse/>} title={x[0]} body={x[1]} />)}
      </section>}

      {tab === 'Targets' && <section className="card">
        <h2><ClipboardList/> Strength Targets</h2>
        {targets.map(([name,current,target]) => <div className="target" key={name}>
          <div><b>{name}</b><span>{current} → {target}{name==='Pull-ups'?' reps':' lb'}</span></div>
          <progress max="100" value={Math.round(current/target*100)}></progress>
        </div>)}
      </section>}
    </main>
  </div>
}

function Card({icon,title,body}) {
  return <div className="card"><h2>{icon} {title}</h2><p>{body}</p></div>
}

createRoot(document.getElementById('root')).render(<App />);
