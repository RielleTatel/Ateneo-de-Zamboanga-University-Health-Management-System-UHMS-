import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Archive } from "lucide-react";

const Immunization = () => {
    return (
                    <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">

                    {/* Component header */}
                        <div className="flex justify-between items-center gap-2">
                                <p> <b> Immunization Records </b> </p> 

                                <Button 
                                variant="modify"
                                > 
                                    + Immunization
                                </Button>
                        </div>

                    {/* Immunization Records */}
                    <div className="space-y-4 mt-6">
                        {/* COVID-19 Record */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">COVID - 19 (PFIZER)</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                        <span>Last Administered: August 5, 2022</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-green-600 font-medium">Compliance Status: Completed</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <Archive className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Hepatitis B Record */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Hepatitis B</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                        <span>Last Administered: July 5, 2007</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-green-600 font-medium">Compliance Status: Completed</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <Archive className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Influenza Record */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Influenza</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
                                        <span>Last Administered: August 23, 2024</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-orange-600 font-medium">Compliance Status: Overdue</span>
                                    </div>
                                    <div className="mt-1 text-sm text-red-600">
                                        Due Next: August 23, 2025 (Missed)
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                        <Archive className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    </div> 
                        

    )
}

export default Immunization; 

