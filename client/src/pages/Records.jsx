import React from "react";
import { Link } from "react-router-dom";
import Navigation from "../components/layout/navigation.jsx";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select.jsx";
import { Search, ChevronDown } from "lucide-react";

const Records = () => {
    return (
        <div className="bg-background-primary w-screen h-screen flex flex-row">
            <Navigation/>  

            {/* Second container */}
            <div className="flex-1 flex-col p-4"> 

                <div className=" min-w-ful p-3"> 
                    <p className="text-[20px]"> <b> Records </b> </p>
                </div>  

                <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7">  

                    <p className="text-[15px]">  <span className="text-[36px] mb-1"> <b> Medical Records </b> </span> <br/> Search and Manage Infirmary Records </p> 

                    {/* Search and Filter Section */}
                    <div className="flex flex-row gap-4 mt-8 mb-6 p-4 rounded-md bg-white">
                        {/* Search Input */}
                        <div className="flex-1 relative ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 " />
                            <input 
                                type="text" 
                                placeholder="Search with ID, name, or email"
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 bg-outline text-gray-400 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filter Dropdown */}
                        <Select className="bg-outline">
                            <SelectTrigger className="w-[180px] h-12 bg-outline">
                                <SelectValue placeholder="Filter by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Records</SelectItem>
                                <SelectItem value="students">Students Only</SelectItem>
                                <SelectItem value="staff">Staff Only</SelectItem>
                                <SelectItem value="recent">Recent Visits</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        {/* Sort Dropdown */}
                        <Select className="bg-outline">
                            <SelectTrigger className="w-[180px] h-12 bg-outline">
                                <SelectValue placeholder="Alphabetical" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name-asc">Name A-Z</SelectItem>
                                <SelectItem value="name-desc">Name Z-A</SelectItem>
                                <SelectItem value="id-asc">ID Ascending</SelectItem>
                                <SelectItem value="id-desc">ID Descending</SelectItem>
                                <SelectItem value="date-recent">Most Recent</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Records List */}
                    <div className="space-y-3">
                        {/* John Doe - Student */}
                        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-[18px] font-semibold text-gray-800"> 
                                                <Link to={"/Profile"}> 
                                                    John Doe 
                                                </Link>
                                            </h3>
                                            <span className="px-3 py-1 bg-gray-800 text-white text-xs rounded-full font-medium">STUDENT</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1">ID: co250001 • Computer Science</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div> 
            </div>
        </div> 
    );
}

export default Records; 