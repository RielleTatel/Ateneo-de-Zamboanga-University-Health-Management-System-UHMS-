import React from "react";
import Navigation from "../components/layout/navigation.jsx";

const Dashboard = () => {
    return (
        <div className="bg-background-primary w-screen h-screen flex flex-row">
            <Navigation/>  

            {/* Second container */}
            <div className="flex-1 flex-col p-4"> 
                <div className="flex-1 flex-col p-4"> 

                    <div className=" min-w-ful p-3"> 
                        <p className="text-[20px]"> <b> Records </b> </p>
                    </div> 

                    <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7"> 
                        <p className="text-[15px]">  <span className="text-[36px] mb-1"> <b> Dashboard Overview </b> </span> <br/> Welcome back john doe </p> 
                    </div>
                </div>
            </div>
        </div> 
    );
}

export default Dashboard; 