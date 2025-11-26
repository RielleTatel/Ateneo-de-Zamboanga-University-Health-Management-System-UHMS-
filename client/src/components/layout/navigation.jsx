import { LayoutDashboard, Users2, NotebookPen, Shield, HelpCircle, LogOut, User, Circle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";  // Import AuthContext
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();  // Get logout function from AuthContext

  // Derive active tab from URL
  const pathToTab = {
    "/dashboard": "overview",
    "/records": "records",
    "/Consult": "Consult", 
    "/createProfile": "/create",
    "/profile": "/profile",
    "/Clinical": "/profile",
    "/admin": "admin",
    "/controls": "controls",
    "/help": "help",
  };

  const [activeTab, setActiveTab] = useState(pathToTab[location.pathname] || "overview");
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const handleNavClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Call logout from AuthContext - this signs out from Supabase
      await logout();
      
      // Clear any remaining local storage
      localStorage.clear();
      sessionStorage.clear();
      
      setLogoutDialog(false);
      
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      setLogoutDialog(false);
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    setLogoutDialog(false);
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
        {/* Main Section */}
        <div className="w-full mt-4 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-6">
            Main
          </p>
        </div> 
        
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

        {/* Settings Section */}
        <div className="w-full mt-6 mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-6">
            Settings
          </p>
        </div>

        {/* Admin */}
        <div
          className={`w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all cursor-pointer ${
            activeTab === "admin" ? "bg-attention-blue" : "bg-container"
          }`}
          onClick={() => handleNavClick("admin", "/admin")}
        >
          <Shield
            className={`ml-10 w-6 h-6 transition-colors ${
              activeTab === "admin" ? "text-white" : "text-text-primary"
            }`}
          />
          <p
            className={`font-semibold transition-colors hidden md:block ${
              activeTab === "admin" ? "text-white" : "text-text-primary"
            }`}
          >
            Admin
          </p>
        </div>

        {/* Controls */}
        <div
          className={`w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all cursor-pointer ${
            activeTab === "controls" ? "bg-attention-blue" : "bg-container"
          }`}
          onClick={() => handleNavClick("controls", "/controls")}
        >
          <Circle
            className={`ml-10 w-6 h-6 transition-colors ${
              activeTab === "controls" ? "text-white" : "text-text-primary"
            }`}
          />
          <p
            className={`font-semibold transition-colors hidden md:block ${
              activeTab === "controls" ? "text-white" : "text-text-primary"
            }`}
          >
            Controls
          </p>
        </div>

        {/* Help */}
        <div
          className={`w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all cursor-pointer ${
            activeTab === "help" ? "bg-attention-blue" : "bg-container"
          }`}
          onClick={() => handleNavClick("help", "/help")}
        >
          <HelpCircle
            className={`ml-10 w-6 h-6 transition-colors ${
              activeTab === "help" ? "text-white" : "text-text-primary"
            }`}
          />
          <p
            className={`font-semibold transition-colors hidden md:block ${
              activeTab === "help" ? "text-white" : "text-text-primary"
            }`}
          >
            Help
          </p>
        </div>

        {/* Logout */}
        <div
          className="w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-red-500 hover:shadow-md transition-all cursor-pointer bg-container"
          onClick={handleLogoutClick}
        >
          <LogOut
            className="ml-10 w-6 h-6 transition-colors text-text-primary group-hover:text-white"
          />
          <p className="font-semibold transition-colors hidden md:block text-text-primary group-hover:text-white">
            Logout
          </p>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialog} onOpenChange={(open) => !open && handleCancelLogout()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to logout?
              <br />
              <br />
              You will need to login again to access the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancelLogout}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navigation;
