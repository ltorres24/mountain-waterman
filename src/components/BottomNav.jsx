import { Home, Dumbbell, BarChart3, HeartPulse, Settings } from "lucide-react";

export default function BottomNav({ tab, setTab }) {
  const items = [
    ["home", Home, "Home"],
    ["train", Dumbbell, "Train"],
    ["progress", BarChart3, "Progress"],
    ["recovery", HeartPulse, "Recovery"],
    ["more", Settings, "More"],
  ];

  return (
    <nav className="bottom-nav">
      {items.map(([id, Icon, label]) => (
        <button
          key={id}
          onClick={() => setTab(id)}
          className={tab === id ? "active" : ""}
        >
          <Icon />
          {label}
        </button>
      ))}
    </nav>
  );
}