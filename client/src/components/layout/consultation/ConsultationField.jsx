import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, Trash2, CheckIcon, ChevronsUpDownIcon, XIcon, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Vitals Field Component for Consultation ---
export const VitalsField = () => {
    const [editingCell, setEditingCell] = useState(null);
    
    const initialVitalsData = [
        { id: 1, test: "Blood Pressure", unit: "mmHg", value: "" },
        { id: 2, test: "Temperature", unit: "°C", value: "" },
        { id: 3, test: "Heart Rate", unit: "bpm", value: "" },
        { id: 4, test: "Respiratory Rate", unit: "breaths/min", value: "" },
        { id: 5, test: "Weight", unit: "kg", value: "" },
        { id: 6, test: "Height", unit: "cm", value: "" },
        { id: 7, test: "BMI", unit: "kg/m²", value: "" }
    ];

    const [vitalsData, setVitalsData] = useState(initialVitalsData);

    const handleCellUpdate = (rowIndex, columnId, value) => {
        const updatedData = vitalsData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: value };
            }
            return row;
        });
        setVitalsData(updatedData);
    };

    const handleAddRow = () => {
        const newRow = { 
            id: Date.now(), 
            test: "", 
            unit: "", 
            value: "" 
        };
        setVitalsData([...vitalsData, newRow]);
    };

    const handleDeleteRow = (rowIndex) => {
        setVitalsData(vitalsData.filter((_, index) => index !== rowIndex));
    };

    const EditableCell = ({ value, rowIndex, columnId, className = "" }) => {
        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId;

        if (isEditing) {
            return (
                <Input
                    type="text"
                    value={value || ""}
                    onChange={(e) => handleCellUpdate(rowIndex, columnId, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingCell(null); }}
                    autoFocus
                    className={`h-8 ${className}`}
                />
            );
        }

        return (
            <div
                onClick={() => setEditingCell({ rowIndex, columnId })}
                className="cursor-pointer min-h-[32px] flex items-center justify-center p-2 -m-2"
            >
                {value || "-"}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            <div className="flex justify-between items-center gap-2 mb-6 flex-wrap">
                <p className="text-xl font-bold">Vitals</p>
                <Button 
                    variant="modify" 
                    className="flex items-center gap-2"
                    onClick={handleAddRow}
                >
                    <Plus className="w-4 h-4" /> Add Row
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold">Vital Test</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-32">Value</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {vitalsData.map((row, rowIndex) => (
                            <TableRow key={row.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    <div className="font-semibold">
                                        <EditableCell 
                                            value={row.test} 
                                            rowIndex={rowIndex} 
                                            columnId="test" 
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <EditableCell 
                                            value={row.unit} 
                                            rowIndex={rowIndex} 
                                            columnId="unit" 
                                        />
                                    </div>
                                </TableCell>

                                <TableCell className="text-center">
                                    <EditableCell 
                                        value={row.value} 
                                        rowIndex={rowIndex} 
                                        columnId="value" 
                                    />
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDeleteRow(rowIndex)} 
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

// --- Lab Field Component for Consultation ---
export const LabFields = () => {
    const [editingCell, setEditingCell] = useState(null);
    
    const initialLabData = [
        { id: 1, test: "Complete Blood Count (CBC)", unit: "g/dL", value: "" },
        { id: 2, test: "Blood Glucose", unit: "mg/dL", value: "" },
        { id: 3, test: "Cholesterol", unit: "mg/dL", value: "" },
        { id: 4, test: "Urinalysis", unit: "N/A", value: "" }
    ];

    const [labData, setLabData] = useState(initialLabData);

    const handleCellUpdate = (rowIndex, columnId, value) => {
        const updatedData = labData.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [columnId]: value };
            }
            return row;
        });
        setLabData(updatedData);
    };

    const handleAddRow = () => {
        const newRow = { 
            id: Date.now(), 
            test: "", 
            unit: "", 
            value: "" 
        };
        setLabData([...labData, newRow]);
    };

    const handleDeleteRow = (rowIndex) => {
        setLabData(labData.filter((_, index) => index !== rowIndex));
    };

    const EditableCell = ({ value, rowIndex, columnId, className = "" }) => {
        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === columnId;

        if (isEditing) {
            return (
                <Input
                    type="text"
                    value={value || ""}
                    onChange={(e) => handleCellUpdate(rowIndex, columnId, e.target.value)}
                    onBlur={() => setEditingCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingCell(null); }}
                    autoFocus
                    className={`h-8 ${className}`}
                />
            );
        }

        return (
            <div
                onClick={() => setEditingCell({ rowIndex, columnId })}
                className="cursor-pointer min-h-[32px] flex items-center justify-center p-2 -m-2"
            >
                {value || "-"}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            <div className="flex justify-between items-center gap-2 mb-6 flex-wrap">
                <p className="text-xl font-bold">Laboratory Tests</p>
                <Button 
                    variant="modify" 
                    className="flex items-center gap-2"
                    onClick={handleAddRow}
                >
                    <Plus className="w-4 h-4" /> Add Row
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold">Laboratory Test</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-32">Result</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {labData.map((row, rowIndex) => (
                            <TableRow key={row.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    <div className="font-semibold">
                                        <EditableCell 
                                            value={row.test} 
                                            rowIndex={rowIndex} 
                                            columnId="test" 
                                        />
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        <EditableCell 
                                            value={row.unit} 
                                            rowIndex={rowIndex} 
                                            columnId="unit" 
                                        />
                                    </div>
                                </TableCell>

                                <TableCell className="text-center">
                                    <EditableCell 
                                        value={row.value} 
                                        rowIndex={rowIndex} 
                                        columnId="value" 
                                    />
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => handleDeleteRow(rowIndex)} 
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

// --- Consultation Notes Component ---
export const ConsultationNotes = () => { 

    // --- Prescription State ---
const [prescriptions, setPrescriptions] = useState([]);
const [showPrescriptionFields, setShowPrescriptionFields] = useState(false);

    const [notes, setNotes] = useState("");
    const [prescription, setPrescription] = useState("");
    const [history, setHistory] = useState(""); 
    const [additionalNotes, setAdditionalNotes] = useState("");  
    
    const [medicalClearance, setMedicalClearance] = useState("");

    const [chronicRiskFactors, setChronicRiskFactors] = useState([]);
    const [openRiskFactors, setOpenRiskFactors] = useState(false);

    const riskFactorOptions = [
        { value: "none", label: "None" },
        { value: "smoking", label: "Smoking" },
        { value: "drinking", label: "Drinking" },
        { value: "hypertension", label: "Hypertension" },
        { value: "diabetes", label: "Diabetes" },
    ]; 

    const handleAddPrescription = () => {
        setShowPrescriptionFields(true);
        setPrescriptions([
            ...prescriptions,
            {
                id: Date.now(),
                name: "",
                quantity: "",
                frequency: "",
                schedule: "",
                tabsPerSchedule: ""
            }
        ]);
    };
    
    const updatePrescription = (id, field, value) => {
        setPrescriptions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
    };
    
    const removePrescription = (id) => {
        setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    };
    
 
    const toggleRiskFactor = (value) => {
        setChronicRiskFactors((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const removeRiskFactor = (value) => {
        setChronicRiskFactors((prev) => prev.filter((item) => item !== value));
    };


    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6 space-y-6">
            <p className="text-lg font-bold text-[#353535]"> Checkup Form- </p> 

            <div className="flex flex-row gap-x-5"> 
                <p className="text-[#353535]"> <b> Date: </b> <span> October 24, 2025 </span> </p>
                <p className="text-[#353535]"> <b> Attending staff: </b> <span> Dr. Resly Kadiri </span> </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-md font-semibold mb-2 text-[#353535]"> Chief Complaint / Symptoms</label>
                    <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px] resize-none rounded-[17px] "
                    />
                </div>

                <div>
                    <label className="block text-md font-semibold mb-2 text-[#353535]"> History </label>
                    <Textarea
                        value={history}
                        onChange={(e) => setHistory(e.target.value)}
                        className="min-h-[100px] resize-none rounded-[17px]"
                    />
                </div> 
                
            {/* ADDED NEW DROPDOWN SECTION HERE */}
            <div className="flex flex-col md:flex-row gap-4 mb-6"> 
                                {/* DROPDOWN SELECTION 1 */}
                                <div className="flex flex-col flex-1"> 
                                    <div>
                                        <label className="block text-md font-semibold mb-1 text-gray-700"> Medical Clearance </label>
                                        <Select value={medicalClearance} onValueChange={setMedicalClearance}>
                                            <SelectTrigger className="rounded-[10px]">
                                                <SelectValue placeholder="Select clearance status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="normal">Normal</SelectItem>
                                                <SelectItem value="at-risk">At Risk</SelectItem>
                                                <SelectItem value="critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* DROPDOWN SELECTION 2 - Multi-select */}
                                <div className="flex flex-col flex-1">
                                    <div>
                                        <label className="block text-md font-semibold mb-1 text-gray-700"> Chronic Risk Factors </label>
                                        <Popover open={openRiskFactors} onOpenChange={setOpenRiskFactors}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openRiskFactors}
                                                    className="w-full justify-between rounded-[10px] h-auto min-h-[40px] py-2"
                                                >
                                                    <div className="flex gap-1 flex-wrap">
                                                        {chronicRiskFactors.length === 0 ? (
                                                            <span className="text-muted-foreground"> Select risk factors</span>
                                                        ) : (
                                                            chronicRiskFactors.map((factor) => {
                                                                const option = riskFactorOptions.find(opt => opt.value === factor);
                                                                return (
                                                                    <span
                                                                        key={factor}
                                                                        className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm"
                                                                    >
                                                                        {option?.label}
                                                                        <XIcon
                                                                            className="h-3 w-3 cursor-pointer hover:text-red-600"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                removeRiskFactor(factor);
                                                                            }}
                                                                        />
                                                                    </span>
                                                                );
                                                            })
                                                        )}
                                                    </div>
                                                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-full p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Search risk factors..." />
                                                    <CommandList>
                                                        <CommandEmpty> No risk factor found. </CommandEmpty>
                                                        <CommandGroup>
                                                            {riskFactorOptions.map((option) => (
                                                                <CommandItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    onSelect={() => toggleRiskFactor(option.value)}
                                                                >
                                                                    <div className="flex items-center gap-2 w-full">
                                                                        <div className={cn(
                                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                                            chronicRiskFactors.includes(option.value)
                                                                                ? "bg-primary text-primary-foreground"
                                                                                : "opacity-50 [&_svg]:invisible"
                                                                        )}>
                                                                            <CheckIcon className="h-4 w-4" />
                                                                        </div>
                                                                        <span>{option.label}</span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                            

                            <div>
                                <label className="block text-md font-semibold mb-2 text-[#353535]"> Additional Notes </label>
                                <Textarea
                                    value={additionalNotes}
                                    onChange={(e) => setAdditionalNotes(e.target.value)}
                                    className="min-h-[100px] resize-none rounded-[17px]"
                                />
                            </div>   


                        {/* --- PRESCRIPTION SECTION --- */}
                        <div className="flex flex-col gap-y-4 mt-6 ">
                            <div className="flex justify-between items-center">
                                <label className="block text-md font-semibold mb-2 text-[#353535]">
                                    Prescription
                                </label>

                                <Button 
                                    className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
                                    onClick={handleAddPrescription}
                                >
                                    <UserPlus className="w-5 h-5" />
                                    Add Prescription
                                </Button>
                            </div>

                            {/* Only show fields if at least one prescription exists */}
                            {showPrescriptionFields && prescriptions.length > 0 && (
                                <div className="space-y-6 ">
                                    {prescriptions.map((p, index) => (
                                        <div 
                                            key={p.id} 
                                            className="border-1 border-outline rounded-xl p-4 shadow-sm space-y-4"
                                        >
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-gray-700">
                                                    Medication {index + 1}
                                                </p>

                                                <Button
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => removePrescription(p.id)}
                                                >
                                                    <XIcon className="w-5 h-5" />
                                                </Button>
                                            </div>

                                            {/* Name */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Medication Name
                                                </label>
                                                <Input
                                                    value={p.name}
                                                    onChange={(e) =>
                                                        updatePrescription(p.id, "name", e.target.value)
                                                    }
                                                    placeholder="Ex: Amoxicillin"
                                                    className="rounded-lg"
                                                />
                                            </div>

                                            {/* Quantity */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Quantity
                                                </label>
                                                <Input
                                                    value={p.quantity}
                                                    onChange={(e) =>
                                                        updatePrescription(p.id, "quantity", e.target.value)
                                                    }
                                                    placeholder="Ex: 10 tablets"
                                                    className="rounded-lg"
                                                />
                                            </div>

                                            {/* Frequency */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Frequency Instructions
                                                </label>
                                                <Input
                                                    value={p.frequency}
                                                    onChange={(e) =>
                                                        updatePrescription(p.id, "frequency", e.target.value)
                                                    }
                                                    placeholder="Ex: Take 1 tab every 8 hours"
                                                    className="rounded-lg"
                                                />
                                            </div>

                                            {/* Schedule Dropdown + Number of Tabs */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Schedule */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Schedule
                                                    </label>
                                                    <Select
                                                        value={p.schedule}
                                                        onValueChange={(v) =>
                                                            updatePrescription(p.id, "schedule", v)
                                                        }
                                                    >
                                                        <SelectTrigger className="rounded-lg">
                                                            <SelectValue placeholder="Select schedule" />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            <SelectItem value="breakfast">Breakfast</SelectItem>
                                                            <SelectItem value="lunch">Lunch</SelectItem>
                                                            <SelectItem value="dinner">Dinner</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {/* Tablets per Schedule */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Tablets per Schedule
                                                    </label>
                                                    <Input
                                                        value={p.tabsPerSchedule}
                                                        onChange={(e) =>
                                                            updatePrescription(p.id, "tabsPerSchedule", e.target.value)
                                                        }
                                                        placeholder="Ex: 1 tab"
                                                        className="rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        </div>
                    </div>
                );
            };
