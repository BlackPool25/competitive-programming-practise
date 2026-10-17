import { useState } from "react";
import "./App.css";
import { Exam } from "./components/Exam";
import { Home } from "./components/Home";
import { Notes } from "./components/Notes";
import { Practice } from "./components/Practice";
import { ALL_QUESTIONS, WEEKS } from "./data/questions";

type View = "home" | "practice" | "exam" | "notes";

function App() {
  const [view, setView] = useState<View>("home");
  const goHome = () => setView("home");

  return (
    <div className="app">
      <nav className="topnav">
        <button className="brand" onClick={goHome}>
          CP <span>Trainer</span>
        </button>
        <span className="spacer" />
        <button
          className={"ghost" + (view === "notes" ? " active" : "")}
          onClick={() => setView("notes")}
        >
          Notes
        </button>
        <span className="stat">
          {ALL_QUESTIONS.length} Q · {WEEKS.length} weeks
        </span>
      </nav>
      {view === "home" && <Home onPick={setView} />}
      {view === "practice" && <Practice onExit={goHome} />}
      {view === "exam" && <Exam onExit={goHome} />}
      {view === "notes" && <Notes onExit={goHome} />}
    </div>
  );
}

export default App;
