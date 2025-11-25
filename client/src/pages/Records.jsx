import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Navigation from "../components/layout/navigation.jsx";
import UserNav from "@/components/layout/userNav.jsx";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select.jsx";
import { Search, Eye, FileText, CheckIcon, ChevronsUpDownIcon, XIcon, UserPlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import axiosInstance from "../lib/axiosInstance";

// API function to fetch patients
const fetchPatients = async () => {
    const { data } = await axiosInstance.get("/patients");
    return data.patients;
};

const Records = () => {
    const navigate = useNavigate();
    const [selectedCheckups, setSelectedCheckups] = useState({});
    const [openPopovers, setOpenPopovers] = useState({});
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch patients from backend
    const { 
        data: recordsData = [], 
        isLoading,
        error 
    } = useQuery({
        queryKey: ["patients"],
        queryFn: fetchPatients,
        refetchOnWindowFocus: false
    });

    const checkupOptions = [
        { value: 'vitals', label: 'Vitals' },
        { value: 'lab', label: 'Laboratory Tests' },
        { value: 'consultation', label: 'Consultation Notes' }
    ];

    const toggleCheckupOption = (recordId, optionValue) => {
        setSelectedCheckups(prev => {
            const current = prev[recordId] || [];
            if (current.includes(optionValue)) {
                return {
                    ...prev,
                    [recordId]: current.filter(val => val !== optionValue)
                };
            } else {
                return {
                    ...prev,
                    [recordId]: [...current, optionValue]
                };
            }
        });
    };

    const removeCheckupOption = (recordId, optionValue) => {
        setSelectedCheckups(prev => ({
            ...prev,
            [recordId]: (prev[recordId] || []).filter(val => val !== optionValue)
        }));
    };

    const handleViewProfile = (recordId) => {
        navigate('/profile', { state: { recordId } });
    };

    const handleStartCheckup = (record) => {
        const selectedOptions = selectedCheckups[record.id] || [];
        if (selectedOptions.length > 0) {
            navigate('/Consult', { 
                state: { 
                    recordId: record.id,
                    recordName: record.name,
                    recordPosition: record.position,
                    recordDepartment: record.department,
                    selectedComponents: selectedOptions 
                } 
            });
            // Close the popover
            setOpenPopovers(prev => ({ ...prev, [record.id]: false }));
        }
    };

    // Filter records based on search query
    const filteredRecords = recordsData.filter(record => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
            record.name?.toLowerCase().includes(searchLower) ||
            record.email?.toLowerCase().includes(searchLower) ||
            record.uuid?.toLowerCase().includes(searchLower) ||
            record.id?.toString().includes(searchLower)
        );
    });

    return (
        <div className="bg-background-primary w-screen h-screen flex flex-row"> 
            <Navigation/>  

            {/* 2nd half of the screen  */}
            <div className="flex-1 flex-col p-4"> 

                <div className="min-w-full px-3 flex justify-between items-center">
                    <p className="text-[20px]"> <b> Records </b> </p>
                    <UserNav/> 
                </div>  

                <div className="bg-background-secondary mt-2 min-h-[700px] rounded-[23px] border-outline border-2 p-7">  

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-[15px]">  
                                <span className="text-[36px] mb-1"> <b> Medical Records </b> </span> 
                                <br/> 
                                Search and Manage Infirmary Records 
                            </p>
                        </div>
                        <Button 
                            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                            onClick={() => navigate('/create')}
                        >
                            <UserPlus className="w-5 h-5" />
                            Create User Profile
                        </Button>
                    </div> 

                    {/* Search and Filter Section */}
                    <div className="flex flex-row gap-4 mb-6 p-4 rounded-[16px] bg-background-secondary border-outline border-2">
                        {/* Search Input */}
                        <div className="flex-1 relative ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 " />
                            <input 
                                type="text" 
                                placeholder="Search with ID, name, or email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 bg-background-secondary  text-gray-700 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filter Dropdown */}
                        <Select className="bg-outline">
                            <SelectTrigger className="w-[180px] h-12 bg-background-secondary  text-gray-700">
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
                            <SelectTrigger className="w-[180px] h-12 text-gray-700">
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

                    {/* Student Records Table */}
                    <div className="bg-white rounded-lg overflow-hidden border-outline border-2">
                        <Table>
                            <TableHeader className="border-outline">
                                <TableRow className="bg-background-secondary border-outline">
                                    <TableHead className="text-black font-semibold">Name</TableHead>
                                    <TableHead className="text-black font-semibold">Position</TableHead>
                                    <TableHead className="text-black font-semibold">Department</TableHead>
                                    <TableHead className="text-black font-semibold text-center"> Actions </TableHead>
                                    <TableHead className="text-black font-semibold text-center"> Check-Up </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                                                <span className="text-gray-600">Loading patients...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="text-red-500">
                                                Error loading patients: {error.message}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredRecords.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="text-gray-500">
                                                {searchQuery ? 'No patients found matching your search.' : 'No patients found.'}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRecords.map((record) => (
                                    <TableRow key={record.id} className="border-outline">
                                        <TableCell className="font-medium  border-outline">
                                            <div>
                                                <div className="font-semibold">{record.name}</div>
                                                <div className="text-xs text-gray-500">{record.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="border-outline">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                record.position === 'Student' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {record.position}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {record.department}
                                        </TableCell>
                                        <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleViewProfile(record.id)}
                                            className="flex items-center gap-2 mx-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                            <Eye className="w-4 h-4" />
                                            View Profile
                                        </Button>
                                        </TableCell>
                                        <TableCell className="text-center">
                                        <Popover 
                                                open={openPopovers[record.id]} 
                                                onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, [record.id]: open }))}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        size="sm"
                                                        aria-expanded={openPopovers[record.id]}
                                                        className="w-[160px] justify-center h-auto min-h-[36px]"
                                                    >
                                                        <div className="flex gap-1 flex-wrap items-center justify-center p-2">
                                                            {(selectedCheckups[record.id] || []).length === 0 ? (
                                                                <>
                                                                    <FileText className="w-10 h-4 mr-1" />
                                                                    <span> check-up </span>
                                                                </>
                                                            ) : (
                                                                (selectedCheckups[record.id] || []).map((checkupValue) => {
                                                                    const option = checkupOptions.find(opt => opt.value === checkupValue);
                                                                    return (
                                                                        <span
                                                                            key={checkupValue}
                                                                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800  rounded-md text-xs font-medium p-1"
                                                                        >
                                                                            {option?.label}
                                                                            <XIcon
                                                                                className="h-3 w-3 cursor-pointer hover:text-red-600"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    removeCheckupOption(record.id, checkupValue);
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[280px] p-0" align="center">
                                                    <Command>
                                                        <CommandInput placeholder="Search check-up types..." />
                                                        <CommandList>
                                                            <CommandEmpty>No check-up type found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {checkupOptions.map((option) => {
                                                                    const isSelected = (selectedCheckups[record.id] || []).includes(option.value);
                                                                    return (
                                                                        <CommandItem
                                                                            key={option.value}
                                                                            value={option.value}
                                                                            onSelect={() => toggleCheckupOption(record.id, option.value)}
                                                                        >
                                                                            <div className="flex items-center gap-2 w-full">
                                                                                <div className={cn(
                                                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                                                    isSelected
                                                                                        ? "bg-primary text-primary-foreground"
                                                                                        : "opacity-50 [&_svg]:invisible"
                                                                                )}>
                                                                                    <CheckIcon className="h-4 w-4" />
                                                                                </div>
                                                                                <span>{option.label}</span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    );
                                                                })}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                    <div className="p-2 border-t">
                                                        <Button
                                                            className="w-full bg-blue-500 hover:bg-blue-600"
                                                            size="sm"
                                                            onClick={() => handleStartCheckup(record)}
                                                            disabled={(selectedCheckups[record.id] || []).length === 0}
                                                        >
                                                            Start Check-Up
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                </div> 
            </div>
        </div> 
    );
}

export default Records;


