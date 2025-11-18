import { LayoutDashboard, Users2, NotebookPen, Shield, HelpCircle, LogOut, User, Circle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  // Derive active tab from URL
  const pathToTab = {
    "/dashboard": "overview",
    "/records": "records",
    "/Consult": "Consult", 
    "/createProfile": "/create",
    "/profile": "/profile",
    "/Clinical": "/profile",
    "/admin": "admin",
    "/help": "help",
  };

  const [activeTab, setActiveTab] = useState(pathToTab[location.pathname] || "overview");
  const [logoutDialog, setLogoutDialog] = useState(false);

  // Mock logged-in user data (will be replaced with actual auth data later)
  const currentUser = {
    name: "Dr. Maria Santos",
    email: "maria.santos@adzu.edu.ph",
    position: "Doctor",
    status: "online" // online, away, busy
  };

  // Get position badge color
  const getPositionColor = (position) => {
    switch (position.toLowerCase()) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'doctor':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'nurse':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'staff':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleNavClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleLogoutClick = () => {
    setLogoutDialog(true);
  };

  const handleConfirmLogout = () => {
    // Clear any stored user data/tokens
    localStorage.clear();
    sessionStorage.clear();
    setLogoutDialog(false);
    navigate("/"); // Redirect to login page
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

      {/* User Account Indicator */}
      <div className="w-full px-2 mb-4">
        <div className="bg-container rounded-[14px] border-1 border-outline p-2">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              {/* Online Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm">
                <Circle 
                  className={`w-full h-full rounded-full ${getStatusColor(currentUser.status)}`} 
                  fill="currentColor"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {currentUser.name}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPositionColor(currentUser.position)}`}>
                {currentUser.position}
              </span>
            </div>
          </div>
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
            <Button variant="outline" onClick={handleCancelLogout}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Navigation;
