import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Archive, FileText } from "lucide-react";

const Report = () => {
    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            {/* Component header */}
            <div className="flex justify-between items-center gap-2 mb-6">
                <p className="text-xl font-bold">Doctor Report</p>
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
                        +Add Report
                    </Button>
                </div>
            </div>

            {/* Doctor Report Records */}
            <div className="space-y-4">
                {/* September 3, 2025 Report */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-gray-200 rounded-full">
                                <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Report on September 3, 2025</h3>
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

export default Report; 