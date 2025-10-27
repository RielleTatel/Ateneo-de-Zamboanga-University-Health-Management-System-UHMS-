import React from "react"; 
import { Link } from "react-router-dom";
import Navigation from "@/components/layout/navigation";

const Consult = () => {
    

    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">

            {/* First container */}
            <Navigation/> 

            {/* 2nd part of the screen */}
            <div className="flex-1 flex-col p-4"> 

                    <div className=" min-w-ful p-3"> 
                        <p className="text-[20px]"> <b> Consultation </b> </p>
                    </div> 

                    {/* Second container */}
                    <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7 "> 

        
                    </div> 

            </div>
        </div>
    )
}

export default Consult; 
