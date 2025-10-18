import React from "react";

const Overview = () => {
    return (
                        <div className="grid grid-cols-2 gap-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Basic Information</h2>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date of Birth:</span>
                                        <span className="text-gray-800">January 5, 2007</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Year Level:</span>
                                        <span className="text-gray-800">1st Year</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Department:</span>
                                        <span className="text-gray-800">SITEAO</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Course:</span>
                                        <span className="text-gray-800">Computer Science</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Address:</span>
                                        <span className="text-gray-800 text-right">San Jose Gusu,<br/>Zamboanga City</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-800 mt-8 mb-4">Emergency Contact</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="text-gray-800">Mary Anne Doe</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Relationship:</span>
                                        <span className="text-gray-800">Mother</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Contact No:</span>
                                        <span className="text-gray-800">0912-234-5678</span>
                                    </div>
                                </div>
                            </div>

{/* Health Summary */}
<div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Health Summary</h2>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <span className="text-gray-600">Medical Clearance:</span>
                        {/* Use conditional coloring based on status:
                            - text-green-600 for "Fit"
                            - text-yellow-600 for "At Risk" / "Conditional"
                            - text-red-600 for "Unfit"
                        */}
                        <span className="font-bold text-green-600">Fit</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-600">Diagnosis:</span>
                        <span className="text-gray-800 text-right font-medium">Asthma - Mild</span>
                    </div>

                    <div className="flex justify-between items-start">
                        <span className="text-gray-600">Prescribed Medication:</span>
                        <span className="text-gray-800 text-right">Fluticasone inhaler</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-600">Latest Check-up:</span>
                        <span className="text-gray-800">September 3, 2025</span>
                    </div>
                    <div className="flex justify-between items-start">
                        <span className="text-gray-600">Next Follow-up:</span>
                        <span className="text-gray-800">March 3, 2026</span>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Overview; 