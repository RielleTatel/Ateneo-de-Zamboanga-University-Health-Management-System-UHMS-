import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import Navigation from "@/components/layout/navigation";
import ProfileHeader from "@/components/layout/profileHeader";
import Overview from "@/components/layout/profile/overview";
import Immunization from "@/components/layout/profile/immunization";


const Profile = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">

            {/* First container */}
            <Navigation/> 

            {/* Second container */}
            <div className="flex-1 flex-col p-4"> 
                <div className=" min-w-ful p-3"> 
                    <p className="text-[20px]"> <b> Profile </b> </p>
                </div> 

                    {/* Second container */}
                    <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7 "> 

                        {/* Tab Navigation */}
                        <div className="flex gap-4 mb-8">
                            <div className="bg-outline rounded-full px-6 py-3 w-3/6 text-center">
                                <span className="text-text-primary font-medium"> PROFILE </span>
                            </div>
                            <div className="bg-transparent rounded-full px-6 py-3 w-3/6 text-center">
                                <span className="text-text-primary"> <Link to={"/Clinical"}>  CLINICAL RECORDS </Link> </span>
                            </div>
                        </div>

                        <ProfileHeader/>

                        {/* Profile Navigation */}
                        <div className="flex justify-center bg-background-primary rounded-[23px] p-1 border-outline border-2 mb-4">
                            <div 
                                className={`rounded-full py-2 w-6/12 text-center cursor-pointer transition-colors ${
                                    activeTab === 'overview' 
                                        ? 'bg-outline' 
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveTab('overview')}
                            >
                                <span className={`${
                                    activeTab === 'overview' 
                                        ? 'text-text-primary font-medium' 
                                        : 'text-text-primary'
                                }`}> 
                                    Profile overview 
                                </span>
                            </div>
                            <div 
                                className={`rounded-full py-2 w-6/12 text-center cursor-pointer transition-colors ${
                                    activeTab === 'immunization' 
                                        ? 'bg-outline' 
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveTab('immunization')}
                            >
                                <span className={`${
                                    activeTab === 'immunization' 
                                        ? 'text-text-primary font-medium' 
                                        : 'text-text-primary'
                                }`}> 
                                    Immunization 
                                </span>
                            </div>
                        </div> 


                {/* Conditional Rendering based on active tab */}
                {activeTab === 'overview' && <Overview/>}
                {activeTab === 'immunization' && <Immunization/>} 

                </div>
            </div>
        </div>
    )
}

export default Profile; 


