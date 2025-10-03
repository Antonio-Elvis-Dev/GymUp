import { useState } from "react";
import { Login } from "./Login";
import { Dashboard } from "./Dashboard";
import { Gyms } from "./Gyms";
import { Profile } from "./Profile";
import { Admin } from "./Admin";
import { BottomNav } from "@/components/layout/BottomNav";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard />;
      case "gyms":
        return <Gyms />;
      case "profile":
        return <Profile />;
      case "admin":
        return <Admin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative">
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
