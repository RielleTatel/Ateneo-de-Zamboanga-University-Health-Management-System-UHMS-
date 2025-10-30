import React from "react";
import Navigation from "@/components/layout/navigation";

const CreateProfile = () => {
    return (
        <div className="bg-background-primary w-screen min-h-screen flex flex-row">

            {/* 1st half of the screen */}
            <Navigation/> 

            {/* 2nd part of the screen */}
            <div className="flex-1 flex-col p-4 "> 
                <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7 "> 
                    <p className="text-[32px]"> <b> Create New Profile </b> </p> 

                    <div className="bg-background-primary w-[1193px] h-[795px] rounded-xl border-black "> 
                        <p className="text-[22px]"> <b>  </b> </p>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default CreateProfile; 