import { LayoutDashboard, Users2, NotebookPen } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive active tab from URL
  const pathToTab = {
    "/dashboard": "overview",
    "/records": "records",
    "/Consult": "Consult", 
    "/createProfile": "/create",
    "/profile": "/profile",
  };

  const [activeTab, setActiveTab] = useState(pathToTab[location.pathname] || "overview");

  const handleNavClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="bg-background-secondary w-[260px] min-h-screen border-outline border-2 flex flex-col items-center p-2">
      {/* Logo */}
      <div className="flex flex-row items-center justify-center w-full mb-2">
        <div className="w-[64px] h-[63px] mr-2">
          <img src="/logo.png" alt="logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="text-[20px] font-bold mb-1">ADZU Infirmary</span>
          <span className="text-[10px]">Healthcare Management System</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col items-start w-full gap-y-2 text-[13px]">
        {/* Overview */}
        <div
          className={`w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all cursor-pointer ${
            activeTab === "overview" ? "bg-attention-blue" : "bg-container"
          }`}
          onClick={() => handleNavClick("overview", "/dashboard")}
        >
          <LayoutDashboard
            className={`ml-10 w-6 h-6 transition-colors ${
              activeTab === "overview" ? "text-white" : "text-text-primary"
            }`}
          />
          <p
            className={`font-semibold transition-colors hidden md:block ${
              activeTab === "overview" ? "text-white" : "text-text-primary"
            }`}
          >
            Overview
          </p>
        </div>

        {/* Records */}
        <div
          className={`w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all cursor-pointer ${
            activeTab === "records" ? "bg-attention-blue" : "bg-container"
          }`}
          onClick={() => handleNavClick("records", "/records")}
        >
          <Users2
            className={`ml-10 w-6 h-6 transition-colors ${
              activeTab === "records" ? "text-white" : "text-text-primary"
            }`}
          />
          <p
            className={`font-semibold transition-colors hidden md:block ${
              activeTab === "records" ? "text-white" : "text-text-primary"
            }`}
          >
            Records
          </p>
        </div> 



      </div>
    </div>
  );
};

export default Navigation;
