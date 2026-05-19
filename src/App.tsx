import { TopBar } from "./components/TopBar";
import { StageNav } from "./components/StageNav";
import { Stage1 } from "./components/Stage1";
import { Stage2 } from "./components/Stage2";
import { Stage3 } from "./components/Stage3";
import { useDemoState } from "./hooks/useDemoState";
import { useState } from "react";

function App() {
  const { stage, setStage, tab, setTab, speed, setSpeed } = useDemoState();
  const [agentsComplete, setAgentsComplete] = useState(stage === 3);

  const resetDemo = () => {
    setAgentsComplete(false);
    setStage(1);
  };

  return (
    <div className="h-screen flex flex-col bg-cream overflow-hidden">
      <TopBar stage={stage} onResetDemo={resetDemo} />
      <div className="flex-1 flex overflow-hidden">
        <StageNav stage={stage} setStage={setStage} agentsComplete={agentsComplete} />
        {stage === 1 && <Stage1 onAdvance={() => setStage(2)} />}
        {stage === 2 && (
          <Stage2
            onAgentsComplete={() => setAgentsComplete(true)}
            onProceed={() => setStage(3)}
            speed={speed}
            setSpeed={setSpeed}
          />
        )}
        {stage === 3 && <Stage3 tab={tab} setTab={setTab} />}
      </div>
    </div>
  );
}

export default App;
