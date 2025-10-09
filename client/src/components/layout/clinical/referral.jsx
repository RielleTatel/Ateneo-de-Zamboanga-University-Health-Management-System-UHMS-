import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Archive } from "lucide-react";

const Referral = () => {
    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Follow-up/Referral Logs</p>
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
                    <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="followup">Follow-up</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="modify">
                        +Add
                    </Button>
                </div>
            </div>

            {/* Referral/Follow-up Records */}
            <div className="space-y-4">
                {/* Follow-Up Record */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-3">Follow-Up - September 3, 2025</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Date of Follow-up: </span>
                                    <span className="text-gray-900">November 3, 2025</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status: </span>
                                    <span className="text-orange-600 font-medium">Ongoing</span>
                                </div>
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

                {/* Referral Record */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-3">Referral - September 3, 2025</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Referred to: </span>
                                    <span className="text-gray-900">Ciudad Medical Zamboanga</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Reason for Referral: </span>
                                    <span className="text-gray-900">Urinary Analysis</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Status: </span>
                                    <span className="text-green-600 font-medium">Resolved</span>
                                </div>
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

export default Referral; 