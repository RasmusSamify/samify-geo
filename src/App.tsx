import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { TopBar } from "./components/TopBar";
import { StageNav } from "./components/StageNav";
import { Stage1 } from "./components/Stage1";
import { Stage2 } from "./components/Stage2";
import { Stage3 } from "./components/Stage3";
import { useDemoState } from "./hooks/useDemoState";
import { ProjectsPage } from "./pages/ProjectsPage";
import { KnowledgeBasePage } from "./pages/KnowledgeBasePage";
import { TemplatesPage } from "./pages/TemplatesPage";
import { IntegrationsPage } from "./pages/IntegrationsPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { DashboardPage } from "./pages/DashboardPage";
import { BillingPage } from "./pages/BillingPage";
import { AccessDeniedPage } from "./pages/AccessDeniedPage";
import { useRole } from "./hooks/useRole";
import { IntroPopup } from "./components/IntroPopup";

const DemoWorkflow = () => {
  const { stage, setStage, tab, setTab, speed, setSpeed } = useDemoState();
  const [agentsComplete, setAgentsComplete] = useState(stage === 3);

  const resetDemo = () => {
    setAgentsComplete(false);
    setStage(1);
  };

  return (
    <>
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
    </>
  );
};

const StandalonePage = ({ children }: { children: React.ReactNode }) => (
  <>
    <TopBar stage={1} onResetDemo={() => {}} />
    <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
  </>
);

const RoleGuard = ({
  route,
  children,
}: {
  route: string;
  children: React.ReactNode;
}) => {
  const { canAccess } = useRole();
  return <>{canAccess(route) ? children : <AccessDeniedPage />}</>;
};

function App() {
  return (
    <div className="h-screen flex flex-col bg-cream overflow-hidden">
      <IntroPopup />
      <Routes>
        <Route path="/" element={<DemoWorkflow />} />
        <Route
          path="/dashboard"
          element={
            <StandalonePage>
              <DashboardPage />
            </StandalonePage>
          }
        />
        <Route
          path="/projects"
          element={
            <StandalonePage>
              <ProjectsPage />
            </StandalonePage>
          }
        />
        <Route
          path="/knowledge"
          element={
            <StandalonePage>
              <KnowledgeBasePage />
            </StandalonePage>
          }
        />
        <Route
          path="/templates"
          element={
            <StandalonePage>
              <TemplatesPage />
            </StandalonePage>
          }
        />
        <Route
          path="/integrations"
          element={
            <StandalonePage>
              <IntegrationsPage />
            </StandalonePage>
          }
        />
        <Route
          path="/roadmap"
          element={
            <StandalonePage>
              <RoadmapPage />
            </StandalonePage>
          }
        />
        <Route
          path="/billing"
          element={
            <StandalonePage>
              <RoleGuard route="/billing">
                <BillingPage />
              </RoleGuard>
            </StandalonePage>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
