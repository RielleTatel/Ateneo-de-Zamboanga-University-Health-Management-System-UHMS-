import { LayoutDashboard, Users2, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Navigation = () => {
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
        <div className="w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer"> 
          <LayoutDashboard className="ml-10 w-6 h-6 text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out" />
          <p className="font-semibold text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out hidden md:block">
            <Link to="/Dashboard">Overview</Link>
          </p>
        </div>

        {/* Records Button */}
        <div className="w-full h-[65px] rounded-[14px] flex items-center gap-x-3 pl-6 group hover:bg-attention-blue hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer">
          <Users2 className="ml-10 w-6 h-6 text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out" />
          <p className="font-semibold text-text-primary group-hover:text-white transition-colors duration-300 ease-in-out hidden md:block">
            <Link to="/records">Records</Link>
          </p>
        </div>
        </div>

      </div>
    )
  }
  
  export default Navigation;
