
import React, { useState } from "react"; 
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import Navigation from "@/components/layout/navigation";
import ProfileHeader from "@/components/layout/profileHeader";
import Vitals from "@/components/layout/clinical/vitals";
import Lab from "@/components/layout/clinical/lab";
import Encounters from "@/components/layout/clinical/encounters";
import { 
    Breadcrumb, 
    BreadcrumbList, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    BreadcrumbPage, 
    BreadcrumbSeparator 
} from "@/components/ui/Breadcrumb";


const Clinical = () => {
    const location = useLocation();
    const navigate = useNavigate(); // ADDED
    const [activeTab, setActiveTab] = useState('vitals');

    // Retrieve state data (recordId/recordName) assumed to be passed from Profile.jsx
    const { recordId, recordName } = location.state || {};

    // Map the internal state value to a user-friendly label for the breadcrumb
    const tabLabelMap = {
        'vitals': 'Vitals',
        'lab': 'Lab Results',
        'encounters': 'Clinical Encounters'
    };
    const currentTabLabel = tabLabelMap[activeTab];

    return (
            <div className="bg-background-primary w-screen min-h-screen flex flex-row">
    
                {/* First container */}
                <Navigation/> 
    
                {/* 2nd part of the screen */}
                <div className="flex-1 flex-col p-4"> 
                    
                    <div className=" min-w-ful p-3"> 
                        
                        {/* Breadcrumb navigation */}
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                className="text-xl mr-2 hover:text-gray-700 font-bold"
                                onClick={() => navigate(-1)}>
                                ← 
                            </button>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link to="/records">Records</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            {/* Link to the Clinical Records root, passing state back */}
                                            <Link to="/clinical" state={{ recordId, recordName }}>
                                                Clinical Records
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        {/* Current Tab Name */}
                                        <BreadcrumbPage>
                                            {currentTabLabel}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        <p className="text-[20px]"> <b>  Clinical Records  </b> </p>
                    </div> 
    
                        {/* Second container */}
                    <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7 "> 
    
                            {/* Tab Navigation (Main Profile/Clinical Toggle) */}
                            <div className="flex gap-4 mb-8">
                                <div className="bg-transparent rounded-full px-6 py-3 w-3/6 text-center">
                                    {/* Link back to profile, passing state */}
                                    <span className="text-text-primary"> 
                                        <Link to={"/profile"} state={{ recordId, recordName }}> PROFILE </Link> 
                                    </span>
                                </div>
                                <div className="bg-outline rounded-full px-6 py-3 w-3/6 text-center">
                                    <span className="text-text-primary font-medium"> CLINICAL RECORDS </span>
                                </div>
                            </div>

                        {/* User Profile Container */}
                        <ProfileHeader recordId={recordId} recordName={recordName} />
    
                        {/* Clinical Navigation e.g., Vitals, Lab Results, Clinical Encounters */}
                        <div className="flex flex-row justify-center bg-background-primary rounded-[23px] p-1 border-outline border-2 mb-4">

                        {/* VITALS COMPONENT */}
                            <div 
                                className={`rounded-full py-2 w-1/3 text-center cursor-pointer transition-colors ${
                                    activeTab === 'vitals' 
                                        ? 'bg-outline' 
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveTab('vitals')}
                            > 
                                <p className={`${
                                    activeTab === 'vitals' 
                                        ? 'text-text-primary font-medium' 
                                        : 'text-text-primary'
                                }`}> 
                                    Vitals 
                                </p>
                            </div>  

                            {/* LAB RESULTS COMPONENT */}
                            <div 
                                className={`rounded-full py-2 w-1/3 text-center cursor-pointer transition-colors ${
                                    activeTab === 'lab' 
                                        ? 'bg-outline' 
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveTab('lab')}
                            > 
                                <p className={`${
                                    activeTab === 'lab' 
                                        ? 'text-text-primary font-medium' 
                                        : 'text-text-primary'
                                }`}> 
                                    Lab Results 
                                </p>
                            </div>  

                            <div 
                                className={`rounded-full py-2 w-1/3 text-center cursor-pointer transition-colors ${
                                    activeTab === 'encounters' 
                                        ? 'bg-outline' 
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveTab('encounters')}
                            > 
                                <p className={`${
                                    activeTab === 'encounters' 
                                        ? 'text-text-primary font-medium' 
                                        : 'text-text-primary'
                                }`}> 
                                    Clinical Encounters
                                </p>
                            </div> 

                        </div> 

                        {/* Conditional Rendering based on active tab */} 
                        {activeTab === 'vitals' && <Vitals />}
                        {activeTab === 'lab' && <Lab />}
                        {activeTab == 'encounters' && <Encounters />}

                    </div>
                </div>
            </div>
    )
}

export default Clinical;
