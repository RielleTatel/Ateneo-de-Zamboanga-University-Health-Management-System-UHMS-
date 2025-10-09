import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Archive } from "lucide-react";

const Vitals = () => {
    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Vitals</p>
                <div className="flex items-center gap-4">
                    <Select defaultValue="recent">
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Most Recent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                            <SelectItem value="date">By Date</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="modify">
                        + Add Vitals
                    </Button>
                </div>
            </div>

            {/* Vitals Records */}
            <div className="space-y-4">
                {/* September 3, 2025 Record */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-gray-900 text-lg">September 3, 2025</h3>
                        <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Edit className="w-4 h-4 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <Archive className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Vital Signs Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Blood Pressure</p>
                            <p className="font-medium text-gray-900">120/80</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Weight</p>
                            <p className="font-medium text-gray-900">65kg</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Height</p>
                            <p className="font-medium text-gray-900">170cm</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">BMI</p>
                            <p className="font-medium text-gray-900">22.5</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                            <p className="font-medium text-gray-900">72 bpm</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Temperature</p>
                            <p className="font-medium text-gray-900">36.8 °C</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Respiratory Rate</p>
                            <p className="font-medium text-gray-900">16</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Vitals; 