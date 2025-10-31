import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Navigation from "../components/layout/navigation.jsx";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select.jsx";
import { Search, Eye, FileText, CheckIcon, ChevronsUpDownIcon, XIcon, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Records = () => {
    const navigate = useNavigate();
    const [selectedCheckups, setSelectedCheckups] = useState({});
    const [openPopovers, setOpenPopovers] = useState({});

    const checkupOptions = [
        { value: 'vitals', label: 'Vitals' },
        { value: 'lab', label: 'Laboratory Tests' },
        { value: 'consultation', label: 'Consultation Notes' }
    ];

    // Temporary data for staff and students
    const recordsData = [
        {
            id: 1,
            name: "Juan Dela Cruz",
            position: "Student",
            department: "BS Computer Science",
            email: "juan.delacruz@adzu.edu.ph"
        },
        {
            id: 2,
            name: "Maria Santos",
            position: "Staff",
            department: "Registrar Office",
            email: "maria.santos@adzu.edu.ph"
        },
        {
            id: 3,
            name: "Pedro Reyes",
            position: "Student",
            department: "BS Business Administration",
            email: "pedro.reyes@adzu.edu.ph"
        },
        {
            id: 4,
            name: "Ana Garcia",
            position: "Staff",
            department: "Library",
            email: "ana.garcia@adzu.edu.ph"
        },
        {
            id: 5,
            name: "Carlos Mendoza",
            position: "Student",
            department: "BS Nursing",
            email: "carlos.mendoza@adzu.edu.ph"
        },
        {
            id: 6,
            name: "Sofia Rodriguez",
            position: "Student",
            department: "BS Psychology",
            email: "sofia.rodriguez@adzu.edu.ph"
        },
        {
            id: 7,
            name: "Roberto Aquino",
            position: "Staff",
            department: "IT Department",
            email: "roberto.aquino@adzu.edu.ph"
        },
        {
            id: 8,
            name: "Isabella Cruz",
            position: "Student",
            department: "BS Civil Engineering",
            email: "isabella.cruz@adzu.edu.ph"
        }
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

    return (
        <div className="bg-background-primary w-screen h-screen flex flex-row">
            <Navigation/>  

            {/* Second container */}
            <div className="flex-1 flex-col p-4"> 

                <div className=" min-w-ful p-3"> 
                    <p className="text-[20px]"> <b> Records </b> </p>
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
                    <div className="flex flex-row gap-4 mb-6 p-4 rounded-md bg-white">
                        {/* Search Input */}
                        <div className="flex-1 relative ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 " />
                            <input 
                                type="text" 
                                placeholder="Search with ID, name, or email"
                                className="w-full h-12 pl-10 pr-4 rounded-lg border border-gray-300 bg-outline text-gray-700 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        
                        {/* Filter Dropdown */}
                        <Select className="bg-outline">
                            <SelectTrigger className="w-[180px] h-12 bg-outline text-gray-700">
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
                            <SelectTrigger className="w-[180px] h-12 bg-outline text-gray-700">
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
                    <div className="bg-white rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-800 hover:bg-gray-800">
                                    <TableHead className="text-white font-semibold">Name</TableHead>
                                    <TableHead className="text-white font-semibold">Position</TableHead>
                                    <TableHead className="text-white font-semibold">Department</TableHead>
                                    <TableHead className="text-white font-semibold text-center">Check-Up</TableHead>
                                    <TableHead className="text-white font-semibold text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recordsData.map((record) => (
                                    <TableRow key={record.id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <div>
                                                <div className="font-semibold">{record.name}</div>
                                                <div className="text-xs text-gray-500">{record.email}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
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
                                                        <div className="flex gap-1 flex-wrap items-center justify-center ">
                                                            {(selectedCheckups[record.id] || []).length === 0 ? (
                                                                <>
                                                                    <FileText className="w-4 h-4 mr-1" />
                                                                    <span> check-up </span>
                                                                </>
                                                            ) : (
                                                                (selectedCheckups[record.id] || []).map((checkupValue) => {
                                                                    const option = checkupOptions.find(opt => opt.value === checkupValue);
                                                                    return (
                                                                        <span
                                                                            key={checkupValue}
                                                                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800  rounded-md text-xs font-medium"
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
                                                        <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                </div> 
            </div>
        </div> 
    );
}

export default Records;
