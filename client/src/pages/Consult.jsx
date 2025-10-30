import React from "react"; 
import { Link } from "react-router-dom";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select.jsx"; 

import { VitalsField, LabFields, ConsultationNotes } from "@/components/layout/consultation/ConsultationField";
import ProfileHeader from "@/components/layout/profileHeader";
import Navigation from "@/components/layout/navigation"; 

const Consult = () => {
    

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">

            {/* 1st half of the screen */}
            <Navigation/> 

            {/* 2nd part of the screen */}
            <div className="flex-1 flex-col p-4"> 
                <div className=" min-w-ful p-1"> 
                    <p className="text-[20px]"> <b> Consultation </b> </p>
                </div> 

                <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7">  
                    <ProfileHeader/>  
                    <div className="text-center"> 
                        <h1> <b> Consultation Actions </b> </h1>
                    </div>
                    <div className="flex flex-col gap-y-6"> 
                        <ConsultationNotes/>
                        <VitalsField/>
                        <LabFields/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Consult; 
