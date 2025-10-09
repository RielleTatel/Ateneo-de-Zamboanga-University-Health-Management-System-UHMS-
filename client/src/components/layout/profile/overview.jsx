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

                            {/* Medical Alerts */}
                            <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Medical Alerts</h2>
                                <div className="text-gray-500 text-center py-8">
                                    No medical alerts on record
                                </div>
                            </div>
                        </div>
    )

}

export default Overview; 