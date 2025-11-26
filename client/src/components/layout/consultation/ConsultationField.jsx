import React, { useState, useEffect } from "react";
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
export const VitalsField = ({ onDataChange, recordId }) => {
    const [vitalData, setVitalData] = useState({
        date_of_check: new Date().toISOString().split('T')[0],
        blood_pressure: "",
        temperature: "",
        heart_rate: "",
        respiratory_rate: "",
        weight: "",
        height: "",
        bmi: ""
    });

    // Auto-calculate BMI
    useEffect(() => {
        const weight = parseFloat(vitalData.weight);
        const height = parseFloat(vitalData.height);
        if (weight > 0 && height > 0) {
            const heightInMeters = height / 100;
            const calculatedBMI = (weight / (heightInMeters * heightInMeters)).toFixed(2);
            setVitalData(prev => ({ ...prev, bmi: calculatedBMI }));
        }
    }, [vitalData.weight, vitalData.height]);

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange({ ...vitalData, user_uuid: recordId });
        }
    }, [vitalData, recordId, onDataChange]);

    const handleInputChange = (field, value) => {
        setVitalData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            <p className="text-xl font-bold mb-6">Vitals</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Check
                    </label>
                    <Input
                        type="date"
                        value={vitalData.date_of_check}
                        onChange={(e) => handleInputChange('date_of_check', e.target.value)}
                        className="rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Pressure (mmHg)
                    </label>
                    <Input
                        type="text"
                        placeholder="120/80"
                        value={vitalData.blood_pressure}
                        onChange={(e) => handleInputChange('blood_pressure', e.target.value)}
                        className="rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature (°C)
                    </label>
                    <Input
                        type="number"
                        step="0.1"
                        placeholder="36.5"
                        value={vitalData.temperature}
                        onChange={(e) => handleInputChange('temperature', e.target.value)}
                        className="rounded-lg"
                    />
            </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Heart Rate (bpm)
                    </label>
                    <Input
                        type="number"
                        placeholder="72"
                        value={vitalData.heart_rate}
                        onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                        className="rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Respiratory Rate (breaths/min)
                    </label>
                    <Input
                        type="number"
                        placeholder="16"
                        value={vitalData.respiratory_rate}
                        onChange={(e) => handleInputChange('respiratory_rate', e.target.value)}
                        className="rounded-lg"
                                        />
                                    </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weight (kg)
                    </label>
                    <Input
                        type="number"
                        step="0.1"
                        placeholder="70"
                        value={vitalData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="rounded-lg"
                                        />
                                    </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height (cm)
                    </label>
                    <Input
                        type="number"
                        step="0.1"
                        placeholder="170"
                        value={vitalData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        BMI (kg/m²)
                    </label>
                    <Input
                        type="text"
                        value={vitalData.bmi}
                        readOnly
                        className="rounded-lg bg-gray-50"
                        placeholder="Auto-calculated"
                    />
                                    </div>
            </div>
        </div>
    );
};

// --- Lab Field Component for Consultation ---
export const LabFields = ({ onDataChange, recordId }) => {
    // Standard lab test fields from database schema
    const standardLabFields = {
        hgb: '',
        mcv: '',
        wbc: '',
        slp: '',
        tchol: '',
        hdl: '',
        ldl: '',
        trig: '',
        fbs: '',
        hba1c: '',
        sgpt: '',
        screa: '',
        burica: '',
        na: '',
        k: '',
        psa: '',
        ekg: '',
        'echo_2d': '',
        cxr: '',
        diastolic: '',
        systolic: '',
        urinalysis: '',
        folate: '',
        vitd: '',
        b12: '',
        tsh: ''
    };

    const [labData, setLabData] = useState(standardLabFields);
    
    // Custom user-defined fields (for results_fields table)
    const [customFields, setCustomFields] = useState([]);
    
    const [editingCell, setEditingCell] = useState(null);
    
    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            onDataChange({
                standardFields: { ...labData, user_uuid: recordId },
                customFields: customFields
            });
        }
    }, [labData, customFields, recordId]);

    const handleStandardFieldChange = (field, value) => {
        setLabData(prev => ({ ...prev, [field]: value }));
    };

    const handleKeyDown = (e, currentIndex) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex < labTests.length) {
                const nextInput = document.getElementById(`lab-input-${labTests[nextIndex].key}`);
                if (nextInput) {
                    nextInput.focus();
                }
            }
        }
    };

    const handleCustomFieldUpdate = (index, field, value) => {
        const updatedFields = [...customFields];
        updatedFields[index] = { ...updatedFields[index], [field]: value };
        setCustomFields(updatedFields);
    };

    const handleAddCustomRow = () => {
        const newField = { 
            id: Date.now(), 
            field_key: "", 
            field_value: "",
            value_type: "text"
        };
        setCustomFields([...customFields, newField]);
    };

    const handleDeleteCustomRow = (index) => {
        setCustomFields(customFields.filter((_, idx) => idx !== index));
    };

    // Lab test definitions
    const labTests = [
        { key: 'hgb', label: 'HGB (Hemoglobin)', unit: 'g/dL' },
        { key: 'mcv', label: 'MCV', unit: 'fL' },
        { key: 'wbc', label: 'WBC', unit: 'K/μL' },
        { key: 'slp', label: 'S/L/P', unit: '' },
        { key: 'tchol', label: 'Total Cholesterol', unit: 'mg/dL' },
        { key: 'hdl', label: 'HDL', unit: 'mg/dL' },
        { key: 'ldl', label: 'LDL', unit: 'mg/dL' },
        { key: 'trig', label: 'Triglycerides', unit: 'mg/dL' },
        { key: 'fbs', label: 'FBS', unit: 'mg/dL' },
        { key: 'hba1c', label: 'HbA1c', unit: '%' },
        { key: 'sgpt', label: 'SGPT', unit: 'U/L' },
        { key: 'screa', label: 'Serum Creatinine', unit: 'mg/dL' },
        { key: 'burica', label: 'Blood Uric Acid', unit: 'mg/dL' },
        { key: 'na', label: 'Sodium (Na)', unit: 'mEq/L' },
        { key: 'k', label: 'Potassium (K)', unit: 'mEq/L' },
        { key: 'diastolic', label: 'Blood Pressure (DBP)', unit: 'mmHg' },
        { key: 'systolic', label: 'Blood Pressure (SBP)', unit: 'mmHg' },
        { key: 'psa', label: 'PSA', unit: 'ng/mL' },
        { key: 'ekg', label: 'EKG', unit: 'Result' },
        { key: 'echo_2d', label: '2D Echo', unit: 'Result' },
        { key: 'cxr', label: 'CXR', unit: 'Result' },
        { key: 'urinalysis', label: 'Urinalysis', unit: 'Result' },
        { key: 'folate', label: 'Folate', unit: 'ng/mL' },
        { key: 'vitd', label: 'Vitamin D', unit: 'ng/mL' },
        { key: 'b12', label: 'Vitamin B12', unit: 'pg/mL' },
        { key: 'tsh', label: 'TSH', unit: 'mIU/L' }
    ];

    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6">
            <p className="text-xl font-bold mb-6">Laboratory Tests</p>

            {/* Standard Lab Fields - continuous table without categories */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                            <TableHead className="text-white font-semibold">Test Name</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-32">Result/Value</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {labTests.map((test, index) => (
                            <TableRow key={test.key} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    <div className="font-semibold">{test.label}</div>
                                    {test.unit && (
                                        <div className="text-xs text-gray-500">{test.unit}</div>
                                    )}
                                </TableCell>

                                <TableCell className="text-center">
                                    <Input
                                        id={`lab-input-${test.key}`}
                                        type={test.unit === 'Result' ? 'text' : 'number'}
                                        step="0.01"
                                        placeholder={test.unit === 'Result' ? 'Enter result' : 'Enter value'}
                                        value={labData[test.key]}
                                        onChange={(e) => handleStandardFieldChange(test.key, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="h-8"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Custom User-Defined Fields Section */}
            <div className="mt-8 pt-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Additional Custom Tests</h3>
                        <p className="text-sm text-gray-500">Add custom lab tests not in the standard list</p>
                    </div>
                <Button 
                    variant="modify" 
                    className="flex items-center gap-2"
                        onClick={handleAddCustomRow}
                >
                        <Plus className="w-4 h-4" /> Add Custom Test
                </Button>
            </div>

                {customFields.length > 0 && (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800">
                                    <TableHead className="text-white font-semibold">Test Name</TableHead>
                                    <TableHead className="text-white font-semibold text-center min-w-32">Result/Value</TableHead>
                            <TableHead className="text-white font-semibold text-center min-w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                                {customFields.map((field, index) => (
                                    <TableRow key={field.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                            <Input
                                                type="text"
                                                placeholder="e.g., Custom Test Name"
                                                value={field.field_key}
                                                onChange={(e) => handleCustomFieldUpdate(index, 'field_key', e.target.value)}
                                                className="h-8"
                                            />
                                </TableCell>

                                <TableCell className="text-center">
                                            <Input
                                                type="text"
                                                placeholder="Enter result"
                                                value={field.field_value}
                                                onChange={(e) => handleCustomFieldUpdate(index, 'field_value', e.target.value)}
                                                className="h-8"
                                    />
                                </TableCell>

                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                                    onClick={() => handleDeleteCustomRow(index)} 
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
                )}

                {customFields.length === 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm">No custom tests added. Click "Add Custom Test" to add your own.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Consultation Notes Component ---
export const ConsultationNotes = ({ onDataChange, recordId }) => { 
    const [consultationData, setConsultationData] = useState({
        date_of_check: new Date().toISOString().split('T')[0],
        symptoms: "",
        history: "",
        medical_clearance: "",
        chronic_risk_factor: [],
        additional_notes: ""
    });

    // --- Prescription State ---
const [prescriptions, setPrescriptions] = useState([]);
const [showPrescriptionFields, setShowPrescriptionFields] = useState(false);
    const [openRiskFactors, setOpenRiskFactors] = useState(false);

    const riskFactorOptions = [
        { value: "none", label: "None" },
        { value: "smoking", label: "Smoking" },
        { value: "drinking", label: "Drinking" },
        { value: "hypertension", label: "Hypertension" },
        { value: "diabetes", label: "Diabetes" },
    ]; 

    // Notify parent of data changes
    useEffect(() => {
        if (onDataChange) {
            const { additional_notes, ...consultationFields } = consultationData;
            
            onDataChange({
                consultation: {
                    ...consultationFields,
                    uuid: recordId,
                    chronic_risk_factor: consultationData.chronic_risk_factor.join(', ')
                },
                prescriptions: prescriptions,
                additional_notes: additional_notes
            });
        }
    }, [consultationData, prescriptions, recordId, onDataChange]);

    const handleConsultationChange = (field, value) => {
        setConsultationData(prev => ({ ...prev, [field]: value }));
    }; 

    const handleAddPrescription = () => {
        setShowPrescriptionFields(true);
        setPrescriptions([
            ...prescriptions,
            {
                id: Date.now(),
                name: "",
                quantity: "",
                frequency: "",
                schedules: [] // Array of schedule objects
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

    const addSchedule = (prescriptionId) => {
        setPrescriptions((prev) =>
            prev.map((p) =>
                p.id === prescriptionId
                    ? {
                          ...p,
                          schedules: [
                              ...p.schedules,
                              { id: Date.now(), time: "", tabsPerSchedule: "" }
                          ]
                      }
                    : p
            )
        );
    };

    const updateSchedule = (prescriptionId, scheduleId, field, value) => {
        setPrescriptions((prev) =>
            prev.map((p) =>
                p.id === prescriptionId
                    ? {
                          ...p,
                          schedules: p.schedules.map((s) =>
                              s.id === scheduleId ? { ...s, [field]: value } : s
                          )
                      }
                    : p
            )
        );
    };

    const removeSchedule = (prescriptionId, scheduleId) => {
        setPrescriptions((prev) =>
            prev.map((p) =>
                p.id === prescriptionId
                    ? {
                          ...p,
                          schedules: p.schedules.filter((s) => s.id !== scheduleId)
                      }
                    : p
            )
        );
    };
    
 
    const toggleRiskFactor = (value) => {
        setConsultationData(prev => ({
            ...prev,
            chronic_risk_factor: prev.chronic_risk_factor.includes(value)
                ? prev.chronic_risk_factor.filter((item) => item !== value)
                : [...prev.chronic_risk_factor, value]
        }));
    };

    const removeRiskFactor = (value) => {
        setConsultationData(prev => ({
            ...prev,
            chronic_risk_factor: prev.chronic_risk_factor.filter((item) => item !== value)
        }));
    };


    return (
        <div className="bg-white rounded-[23px] border-2 border-[#E5E5E5] p-6 space-y-6">
            <p className="text-lg font-bold text-[#353535]">Consultation Form</p> 

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Check</label>
                <Input
                    type="date"
                    value={consultationData.date_of_check}
                    onChange={(e) => handleConsultationChange('date_of_check', e.target.value)}
                    className="rounded-lg"
                />
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-md font-semibold mb-2 text-[#353535]">Chief Complaint / Symptoms</label>
                    <Textarea
                        value={consultationData.symptoms}
                        onChange={(e) => handleConsultationChange('symptoms', e.target.value)}
                        className="min-h-[100px] resize-none rounded-[17px]"
                    />
                </div>

                <div>
                    <label className="block text-md font-semibold mb-2 text-[#353535]">History</label>
                    <Textarea
                        value={consultationData.history}
                        onChange={(e) => handleConsultationChange('history', e.target.value)}
                        className="min-h-[100px] resize-none rounded-[17px]"
                    />
                </div> 
                
            {/* Medical Clearance & Risk Factors */}
            <div className="flex flex-col md:flex-row gap-4 mb-6"> 
                                {/* DROPDOWN SELECTION 1 */}
                                <div className="flex flex-col flex-1"> 
                                    <div>
                        <label className="block text-md font-semibold mb-1 text-gray-700">Medical Clearance</label>
                        <Select 
                            value={consultationData.medical_clearance} 
                            onValueChange={(value) => handleConsultationChange('medical_clearance', value)}
                        >
                                            <SelectTrigger className="rounded-[10px]">
                                                <SelectValue placeholder="Select clearance status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                <SelectItem value="Normal">Normal</SelectItem>
                                <SelectItem value="At Risk">At Risk</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* DROPDOWN SELECTION 2 - Multi-select */}
                                <div className="flex flex-col flex-1">
                                    <div>
                        <label className="block text-md font-semibold mb-1 text-gray-700">Chronic Risk Factors</label>
                                        <Popover open={openRiskFactors} onOpenChange={setOpenRiskFactors}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={openRiskFactors}
                                                    className="w-full justify-between rounded-[10px] h-auto min-h-[40px] py-2"
                                                >
                                                    <div className="flex gap-1 flex-wrap">
                                        {consultationData.chronic_risk_factor.length === 0 ? (
                                            <span className="text-muted-foreground">Select risk factors</span>
                                                        ) : (
                                            consultationData.chronic_risk_factor.map((factor) => {
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
                                        <CommandEmpty>No risk factor found.</CommandEmpty>
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
                                                            consultationData.chronic_risk_factor.includes(option.value)
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
                                <label className="block text-md font-semibold mb-2 text-[#353535]">Additional Notes</label>
                                <Textarea
                                    value={consultationData.additional_notes}
                                    onChange={(e) => handleConsultationChange('additional_notes', e.target.value)}
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
                                                    General Instructions
                                                </label>
                                                <Input
                                                    value={p.frequency}
                                                    onChange={(e) =>
                                                        updatePrescription(p.id, "frequency", e.target.value)
                                                    }
                                                    placeholder="Ex: Take with food, avoid alcohol"
                                                    className="rounded-lg"
                                                />
                                            </div>

                                            {/* Schedules Section */}
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Dosage Schedule
                                                    </label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => addSchedule(p.id)}
                                                        className="flex items-center gap-1 text-xs"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                        Add Schedule
                                                    </Button>
                                                </div>

                                                {p.schedules.length === 0 ? (
                                                    <div className="text-sm text-gray-500 italic border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                        No schedules added. Click "Add Schedule" to specify when to take this medication.
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {p.schedules.map((schedule, scheduleIndex) => (
                                                            <div
                                                                key={schedule.id}
                                                                className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                                                            >
                                                                {/* Time/Meal Selection */}
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                                        Time/Meal
                                                                    </label>
                                                                    <Select
                                                                        value={schedule.time}
                                                                        onValueChange={(v) =>
                                                                            updateSchedule(p.id, schedule.id, "time", v)
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="rounded-lg h-9">
                                                                            <SelectValue placeholder="Select time" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="before-breakfast">Before Breakfast</SelectItem>
                                                                            <SelectItem value="breakfast">Breakfast</SelectItem>
                                                                            <SelectItem value="after-breakfast">After Breakfast</SelectItem>
                                                                            <SelectItem value="before-lunch">Before Lunch</SelectItem>
                                                                            <SelectItem value="lunch">Lunch</SelectItem>
                                                                            <SelectItem value="after-lunch">After Lunch</SelectItem>
                                                                            <SelectItem value="before-dinner">Before Dinner</SelectItem>
                                                                            <SelectItem value="dinner">Dinner</SelectItem>
                                                                            <SelectItem value="after-dinner">After Dinner</SelectItem>
                                                                            <SelectItem value="bedtime">Bedtime</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                {/* Tablets per Schedule */}
                                                                <div>
                                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                                        Dosage
                                                                    </label>
                                                                    <Input
                                                                        value={schedule.tabsPerSchedule}
                                                                        onChange={(e) =>
                                                                            updateSchedule(
                                                                                p.id,
                                                                                schedule.id,
                                                                                "tabsPerSchedule",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Ex: 1 tablet"
                                                                        className="rounded-lg h-9"
                                                                    />
                                                                </div>

                                                                {/* Remove Schedule Button */}
                                                                <div className="flex items-end">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeSchedule(p.id, schedule.id)}
                                                                        className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
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
