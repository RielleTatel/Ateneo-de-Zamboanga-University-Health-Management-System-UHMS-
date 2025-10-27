import { LayoutDashboard, Users2, Settings, NotebookPen  } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Overview from "./profile/overview";
import Profile from "@/pages/Profile";
import Records from "@/pages/Records";

const Navigation = () => { 
  const [activeTab, setActiveTab] = useState('overview')

    return (
      <div className="bg-background-secondary w-[260px] h-screeen border-outline border-2 flex flex-col items-center p-2">
  
          {/* navigation logo header */}
          <div className="flex flex-row items-center justify-center w-full mb-2 p-x-0">
            <div className="w-[64px] h-[63px] mr-2">
              <img 
                src="/logo.png"
                alt="logo"
                className="w-full h-full object-contain"
              /> 
            </div>
            <div className="flex flex-col leading-none text-left">
              <span className="text-[20px] font-bold mb-1">ADZU Infirmary</span>
              <span className="text-[10px]">Healthcare Management System</span>
            </div>
          </div>
    
        <div className="flex flex-col items-start w-full gap-y-2 text-[13px]">
              {/* Overview Button */}
              
          {/* Overview Button */}
          <div 
            className={`w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer ${
              activeTab == 'overview'
              ? 'bg-attention-blue' 
              : 'bg-container' 
            }`} 

            onClick={() => setActiveTab('overview')}
          > 
 
            <LayoutDashboard className={`ml-10 w-6 h-6 text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out ${
                  activeTab == 'overview'
                  ? 'text-white' 
                  : 'text-text-primary' 
            }`} /> 

            <p className={`font-semibold text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out hidden md:block ${
                  activeTab == 'overview'
                  ? 'text-white' 
                  : 'text-text-primary' 
            }
            `}> 

              <Link to="/Dashboard">Overview </Link>
            </p> 

          </div>

          {/* Records Button */}
          <div className={`w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer ${
              activeTab == 'records'
              ? 'bg-attention-blue' 
              : 'bg-container' 
          }`} 
          onClick={() => setActiveTab('records')}
          > 

            <Users2 className={`ml-10 w-6 h-6 text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out ${
              activeTab == 'records'
              ? 'text-white' 
              : 'text-text-primary' 
            }`} /> 


            <p className={`font-semibold text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out hidden md:block ${
                  activeTab == 'records'
                  ? 'text-white' 
                  : 'text-text-primary' 
            }`}> 

              <Link to="/Dashboard"> Records </Link>
            </p> 
            
            
          </div>

          {/* Consult Button */}
          <div className={`w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer ${
              activeTab == 'consult'
              ? 'text-text-primary font-medium' 
              : 'text-text-primary' 
          }`}
            onClick={() => setActiveTab('consult')}
          >
            <NotebookPen className="ml-10 w-6 h-6 text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out" />
            <p className="font-semibold text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out hidden md:block">
              <Link to="/consult"> Consult </Link>
            </p>
          </div>

          {/* Conditional Rendering based on active tab */} 

          {activeTab === 'vitals' && <Records/>}
          {activeTab === 'lab' && <Dashboard />}
          {activeTab == 'encounters' && <Profile />}
          
        </div> 
      </div>
    )
  }
  
  export default Navigation; 

  