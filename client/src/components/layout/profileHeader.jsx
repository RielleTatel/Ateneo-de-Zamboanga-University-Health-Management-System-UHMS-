import React from "react";
import { User } from "lucide-react";

const ProfileHeader = () => {
    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-2 mb-4">
            <div className="flex items-center gap-x-2">
                {/* Logo Container */}
                <div className="ml-5 w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-text-primary" />
                 </div>
                    {/* Text Container */}
                        <div className="flex flex-col items-start justify-center ml-4">
                            {/* Name row */}
                            <div className="flex items-center gap-x-3 text-left w-full h-[48px] ">
                                <h1 className="text-2xl font-bold text-text-primary leading-tight p-0 m-0"> John Doe </h1>
                                <span className="px-3 py-1 bg-gray-800 text-white text-xs rounded-full font-medium">STUDENT</span>
                            </div>
                            {/* Details row */}    
                            <div className="flex gap-x-8 text-text-primary mb-1">
                                <span> ID: co250001 </span>
                                <span> Age: 18 </span>
                                <span> Sex: M </span>
                                <span> Contact No: 0912-345-6789 </span>
                            </div>
                         </div>
                </div>
            </div>
    )
}

export default ProfileHeader; 